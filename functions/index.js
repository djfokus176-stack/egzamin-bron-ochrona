import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { GoogleAuth } from "google-auth-library";
import { createHash } from "node:crypto";

initializeApp();
const db=getFirestore();
const googleAuth = new GoogleAuth({scopes:["https://www.googleapis.com/auth/androidpublisher"]});
const packageName="pl.djfokus176.quizochrona";
const productId="dostep_7_dni";
const week=7*24*60*60*1000;
const hash = value=>createHash("sha256").update(value).digest("hex");

async function playRequest(path,method="GET") {
  const client=await googleAuth.getClient();
  const token=await client.getAccessToken();
  const response=await fetch("https://androidpublisher.googleapis.com/androidpublisher/v3/applications/"+packageName+path,{
    method,headers:{Authorization:"Bearer "+token.token,"Content-Type":"application/json"}
  });
  const payload=await response.text();
  if(!response.ok)throw new Error("Google Play API HTTP "+response.status+" "+payload.slice(0,160));
  return payload?JSON.parse(payload):{};
}

/**
 * Callable by Firebase Authentication users only.
 * The client cannot write paidUntil or owner permissions through Firestore.
 * Requires Blaze + deployed Functions + linked Play Developer API service account.
 */
export const verifyPlayPurchase = onCall({
  region:"europe-west1",maxInstances:5,timeoutSeconds:60,invoker:"public"
},async(request)=>{
  const uid=request.auth?.uid;
  if(!uid)throw new HttpsError("unauthenticated","Zaloguj się przed zakupem.");
  const user=await getAuth().getUser(uid);
  if(!user.emailVerified)throw new HttpsError("failed-precondition","Potwierdź adres e-mail.");
  const purchaseToken=request.data?.purchaseToken;
  if(typeof purchaseToken!=="string"||purchaseToken.length<20||purchaseToken.length>4096)
    throw new HttpsError("invalid-argument","Niepoprawny token zakupu.");

  const id=hash(purchaseToken);
  const record=db.doc("playPurchases/"+id);
  const entitlement=db.doc("entitlements/"+uid);

  // In case a client retries after processing, never grant the same token twice.
  const existing=await record.get();
  if(existing.exists){
    if(existing.get("uid")!==uid)throw new HttpsError("permission-denied","Zakup należy do innego konta.");
    return {ok:true,alreadyProcessed:true,expiresAt:existing.get("expiresAt").toDate().toISOString()};
  }

  let verified;
  try {
    verified=await playRequest("/purchases/productsv2/tokens/"+encodeURIComponent(purchaseToken));
  } catch(e) {
    console.error("Google Play verification failed",String(e).slice(0,220));
    throw new HttpsError("unavailable","Nie udało się zweryfikować zakupu w Google Play. Spróbuj ponownie.");
  }
  if(verified.purchaseStateContext?.purchaseState!=="PURCHASED")
    throw new HttpsError("failed-precondition","Płatność jest oczekująca albo anulowana.");
  if(!Array.isArray(verified.productLineItem)||verified.productLineItem.length!==1||
      verified.productLineItem[0].productId!==productId)
    throw new HttpsError("failed-precondition","Zakup nie dotyczy dostępu 7 dni.");
  if(verified.obfuscatedExternalAccountId!==hash(uid))
    throw new HttpsError("permission-denied","Nieprawidłowe konto przypisane do zakupu.");

  const expiresAt=await db.runTransaction(async tx=>{
    const old=await tx.get(record);
    if(old.exists){
      if(old.get("uid")!==uid)throw new HttpsError("permission-denied","Zakup już przypisano innemu kontu.");
      return old.get("expiresAt");
    }
    const ent=await tx.get(entitlement);
    if(ent.exists&&ent.get("tier")==="owner")
      throw new HttpsError("failed-precondition","Właściciel aplikacji nie musi płacić.");
    const now=Date.now();
    const current=ent.get("paidUntil")?.toMillis?.()??0;
    const base=Math.max(now,current);
    const expiration=Timestamp.fromMillis(base+week);
    tx.set(entitlement,{tier:"paid",paidUntil:expiration,updatedAt:FieldValue.serverTimestamp()},{merge:true});
    tx.create(record,{uid,productId,createdAt:FieldValue.serverTimestamp(),
      expiresAt:expiration,consumption:"pending"});
    return expiration;
  });

  // A consumable must be consumed to permit buying another week.
  // Grant is idempotent even if Google consumption briefly fails.
  try {
    await playRequest("/purchases/products/"+productId+"/tokens/"+encodeURIComponent(purchaseToken)+":consume","POST");
    await record.update({consumption:"complete",consumedAt:FieldValue.serverTimestamp()});
  }catch(e){
    // Do not grant another week on retry; record ensures idempotency.
    console.error("Play purchase consumption needs reconciliation",id,String(e).slice(0,150));
  }

  return {ok:true,expiresAt:expiresAt.toDate().toISOString()};
});
