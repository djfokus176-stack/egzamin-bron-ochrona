// Moduł konta testowego. Brak automatycznych zakupów i blokady treści.
// Klucze projektu w firebase-config.js są publiczną konfiguracją klienta,
// ale nigdy nie wolno tu umieszczać sekretów / konta administracyjnego.
import { firebaseConfig } from "./firebase-config.js";
import { BILLING_ENABLED, PRODUCT_ID } from "./billing-config.js";

const $ = id => document.getElementById(id);
const show=(id,yes)=>$(id).classList.toggle("hidden",!yes);
const say=(message)=>{$("feedback").textContent=message;};
const readable=(e)=>{
 const code=e?.code||"";
 if(code==="auth/email-already-in-use")return "Ten adres ma już konto. Spróbuj się zalogować.";
 if(code==="auth/invalid-credential"||code==="auth/wrong-password")return "Niepoprawny e-mail lub hasło.";
 if(code==="auth/weak-password")return "Hasło jest za krótkie.";
 if(code==="auth/invalid-email")return "Niepoprawny adres e-mail.";
 if(code==="auth/too-many-requests")return "Za dużo prób. Spróbuj później.";
 if(code==="permission-denied")return "Brak uprawnień Firestore. Sprawdź reguły w konsoli Firebase.";
 if(code==="auth/network-request-failed"||code==="unavailable")return "Brak połączenia z Firebase. Sprawdź internet.";
 return "Operacja nie powiodła się ("+(code||"nieznany błąd")+").";
};
if(!firebaseConfig?.apiKey||!firebaseConfig?.authDomain||!firebaseConfig?.projectId||!firebaseConfig?.appId){
 $("setup").textContent="Firebase jeszcze nie jest skonfigurowany. Właściciel aplikacji musi uzupełnić firebase-config.js. Nauka ABC nadal działa.";
 say("Ten ekran będzie aktywny po podłączeniu projektu Firebase.");
}else{
 try{
  const [
   {initializeApp},
   {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signOut,reload},
   {getFirestore,doc,getDocFromServer,setDoc,serverTimestamp}
  ]=await Promise.all([
   import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
   import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
   import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
  ]);
  const app=initializeApp(firebaseConfig), auth=getAuth(app), db=getFirestore(app);
  // Uwaga: zakup może się rozpocząć WYŁĄCZNIE po wdrożeniu bezpiecznej weryfikacji.
  const billingPlugin=window.Capacitor?.isNativePlatform?.() ? window.Capacitor?.Plugins?.PlayBilling : null;
  let nativeBillingReady=false;
  let verifyPurchase;
  if(BILLING_ENABLED && billingPlugin){
    try{
      const {getFunctions,httpsCallable}=await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js");
      verifyPurchase=httpsCallable(getFunctions(app,"europe-west1"),"verifyPlayPurchase");
      const result=await billingPlugin.product();
      if(result.productId===PRODUCT_ID){
        nativeBillingReady=true;
        $("purchase").textContent="Kup 7 dni za "+(result.formattedPrice||"cenę z Google Play");
        $("purchase").disabled=false;
        $("restorePurchase").disabled=false;
      }
      await billingPlugin.addListener("purchase",async data=>{
        if(data.state!=="PURCHASED"){say("Płatność oczekuje na potwierdzenie w Google Play.");return}
        await action(async()=>{
          say("Weryfikuję płatność na serwerze. Nie zamykaj aplikacji.");
          const response=await verifyPurchase({purchaseToken:data.purchaseToken});
          if(!response.data?.ok)throw Error("verification-failed");
          await refreshAccount();
          say("Płatność zweryfikowana. Dostęp przedłużony.");
        });
      });
      await billingPlugin.restore();
    }catch(e){
      console.warn("Google Play Billing niegotowe",e?.code||e?.message);
      nativeBillingReady=false;
      $("purchase").disabled=true;
      $("restorePurchase").disabled=true;
      $("billingMessage").textContent="Google Play nie udostępnia jeszcze produktu. Zakup wyłączony.";
    }
  }
  $("setup").textContent="Połączono z projektem "+firebaseConfig.projectId+".";
  const email=()=>$("email").value.trim();
  const password=()=>$("password").value;
  const lock=busy=>["login","register","forgot","logout","verify","resend"].forEach(id=>$(id).disabled=busy);
  const action=async fn=>{lock(true);try{await fn();}catch(e){console.warn("Błąd konta Firebase",e?.code||e?.name);say(readable(e));}finally{lock(false)}};
  $("accountForm").addEventListener("submit",e=>{e.preventDefault();action(async()=>{await signInWithEmailAndPassword(auth,email(),password());say("Zalogowano.");})});
  $("register").addEventListener("click",()=>action(async()=>{
    if(!email()||password().length<6){say("Podaj poprawny e-mail i hasło długości co najmniej 6 znaków.");return}
    const {user}=await createUserWithEmailAndPassword(auth,email(),password());
    await sendEmailVerification(user);
    say("Konto utworzone. Otwórz wiadomość e-mail i potwierdź adres przed rozpoczęciem próby.");
  }));
  $("forgot").addEventListener("click",()=>action(async()=>{
    if(!email()){say("Wprowadź swój adres e-mail.");return}
    await sendPasswordResetEmail(auth,email());
    say("Jeżeli konto istnieje, na ten adres zostanie wysłana wiadomość do zmiany hasła.");
  }));
  $("logout").addEventListener("click",()=>action(async()=>{await signOut(auth);say("Wylogowano.");}));
  $("resend").addEventListener("click",()=>action(async()=>{
    if(!auth.currentUser){say("Najpierw się zaloguj.");return}
    await sendEmailVerification(auth.currentUser);
    say("Wysłano wiadomość weryfikacyjną. Sprawdź skrzynkę.");
  }));
  $("purchase").addEventListener("click",()=>action(async()=>{
    if(!nativeBillingReady||!BILLING_ENABLED||!auth.currentUser)throw Error("billing-not-enabled");
    await billingPlugin.buy({uid:auth.currentUser.uid});
    say("Zatwierdź zakup w oknie Google Play. Dostęp włączymy po weryfikacji płatności.");
  }));
  $("restorePurchase").addEventListener("click",()=>action(async()=>{
    if(!nativeBillingReady)throw Error("billing-not-enabled");
    await billingPlugin.restore();
    say("Sprawdzono zakupy oczekujące na weryfikację.");
  }));
  async function refreshAccount(){
    const user=auth.currentUser;
    if(!user)return;
    show("billingSection",BILLING_ENABLED&&!!billingPlugin);
    await reload(user);
    if(!user.emailVerified){
      $("access").textContent="Potwierdź adres e-mail. Okres 3 dni jeszcze się nie rozpoczął.";
      show("resend",true);show("verify",true);return;
    }
    show("resend",false);show("verify",false);
    $("access").textContent="Sprawdzam uprawnienia i datę okresu próbnego…";
    const ent=await getDocFromServer(doc(db,"entitlements",user.uid));
    if(ent.exists()&&ent.data().tier==="owner"){
      show("billingSection",false);
      $("access").textContent="Właściciel aplikacji — darmowy dostęp bezterminowo.";
      return;
    }
    const paid=ent.exists()?ent.data().paidUntil:null;
    if(paid && typeof paid.toMillis==="function" && paid.toMillis()>Date.now()){
      show("billingSection",false);
      $("access").textContent="Opłacony dostęp do: "+paid.toDate().toLocaleString("pl-PL")+".";
      return;
    }
    const ref=doc(db,"trials",user.uid);
    let snap=await getDocFromServer(ref);
    if(!snap.exists()){
      try{await setDoc(ref,{startedAt:serverTimestamp()});}
      catch(e){ // Dwie sesje mogą równolegle spróbować utworzyć jeden dokument.
        snap=await getDocFromServer(ref);
        if(!snap.exists())throw e;
      }
      snap=await getDocFromServer(ref);
    }
    const start=snap.data()?.startedAt;
    if(!start||typeof start.toMillis!=="function")throw Error("missing-server-timestamp");
    const end=start.toMillis()+3*24*60*60*1000;
    if(BILLING_ENABLED&&billingPlugin){
      show("billingSection",end<=Date.now());
      $("billingMessage").textContent=nativeBillingReady?"Darmowy okres próbny wygasł. Możesz kupić dostęp przez Google Play.":"Zakup jeszcze niedostępny w Google Play.";
    }
    $("access").textContent=end>Date.now()
      ?"Trwa bezpłatny okres próbny — do "+new Date(end).toLocaleString("pl-PL")+"."
      :"Bezpłatny okres próbny upłynął. Zakup 7 dni za 5 zł nie jest jeszcze dostępny — wersja testowa pozostaje otwarta.";
  }
  $("verify").addEventListener("click",()=>action(async()=>{await refreshAccount();say("Odświeżono status konta.");}));
  onAuthStateChanged(auth,async user=>{
    show("authFields",!user);show("loggedIn",!!user);
    if(!user){say("Możesz się zalogować lub utworzyć konto.");return}
    $("currentEmail").textContent=user.email||"brak";
    $("currentUid").textContent=user.uid;
    try{await refreshAccount();say("Status pobrany z Firebase.");}
    catch(e){$("access").textContent="Nie można zweryfikować uprawnień. Dostęp płatny nie może być na tej podstawie przyznany.";say(readable(e));}
  });
 }catch(e){console.warn("Firebase initialization failed",e?.name||"error");$("setup").textContent="Błąd uruchamiania połączenia Firebase.";say("Sprawdź konfigurację oraz połączenie z internetem.");}
}
