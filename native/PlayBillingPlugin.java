package pl.djfokus176.quizochrona;

import android.os.Bundle;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Native bridge only. It NEVER grants entitlements, consumes or acknowledges a purchase.
 * A Firebase Cloud Function verifies the purchase with Google Play and consumes it.
 */
@CapacitorPlugin(name = "PlayBilling")
public class PlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    private static final String PRODUCT_ID = "dostep_7_dni";
    private BillingClient client;
    private ProductDetails currentProduct;

    @Override
    public void load() {
        client = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .enableAutoServiceReconnection()
            .build();
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    deliverOutstandingPurchases();
                }
            }
            @Override public void onBillingServiceDisconnected() {}
        });
    }

    @PluginMethod
    public void product(PluginCall call) {
        if (client == null || !client.isReady()) {
            call.reject("Google Play Billing nie jest dostępny.");
            return;
        }
        QueryProductDetailsParams.Product item = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(PRODUCT_ID)
            .setProductType(BillingClient.ProductType.INAPP)
            .build();
        QueryProductDetailsParams query = QueryProductDetailsParams.newBuilder()
            .setProductList(Collections.singletonList(item))
            .build();
        client.queryProductDetailsAsync(query, (result, response) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK ||
                response.getProductDetailsList().isEmpty()) {
                call.reject("Produkt jest jeszcze niedostępny w Google Play.");
                return;
            }
            currentProduct = response.getProductDetailsList().get(0);
            JSObject out = new JSObject();
            out.put("productId", PRODUCT_ID);
            List<ProductDetails.OneTimePurchaseOfferDetails> offers = currentProduct.getOneTimePurchaseOfferDetailsList();
            if (offers != null && !offers.isEmpty()) {
                out.put("formattedPrice", offers.get(0).getFormattedPrice());
            }
            call.resolve(out);
        });
    }

    @PluginMethod
    public void buy(PluginCall call) {
        String uid = call.getString("uid");
        if (uid == null || uid.length() < 10 || uid.length() > 128) {
            call.reject("Najpierw zaloguj się na swoje konto.");
            return;
        }
        if (client == null || !client.isReady() || currentProduct == null) {
            call.reject("Najpierw pobierz informacje o produkcie Google Play.");
            return;
        }
        ProductDetails.OneTimePurchaseOfferDetails offer = null;
        List<ProductDetails.OneTimePurchaseOfferDetails> offers = currentProduct.getOneTimePurchaseOfferDetailsList();
        if (offers != null && !offers.isEmpty()) offer = offers.get(0);
        if (offer == null) {
            call.reject("Produkt nie ma aktywnej oferty.");
            return;
        }
        BillingFlowParams.ProductDetailsParams params = BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(currentProduct)
            .setOfferToken(offer.getOfferToken())
            .build();
        BillingFlowParams flow = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(Collections.singletonList(params))
            .setObfuscatedAccountId(sha256(uid))
            .build();
        getActivity().runOnUiThread(() -> {
            BillingResult result = client.launchBillingFlow(getActivity(), flow);
            if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                call.resolve();
            } else {
                call.reject("Google Play: " + result.getDebugMessage());
            }
        });
    }

    @PluginMethod
    public void restore(PluginCall call) {
        if (client == null || !client.isReady()) {
            call.reject("Google Play Billing jeszcze nie jest gotowy.");
            return;
        }
        client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (result, purchases) -> {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("Nie udało się sprawdzić zakupów Google Play.");
                    return;
                }
                for (Purchase p : purchases) emitPurchase(p);
                call.resolve();
            }
        );
    }

    private void deliverOutstandingPurchases() {
        if (client == null || !client.isReady()) return;
        client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (result, purchases) -> {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK)
                    for (Purchase p : purchases) emitPurchase(p);
            }
        );
    }

    @Override
    public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase p : purchases) emitPurchase(p);
        }
        JSObject state = new JSObject();
        state.put("responseCode", result.getResponseCode());
        state.put("message", result.getDebugMessage());
        notifyListeners("purchaseState", state);
    }

    private void emitPurchase(Purchase p) {
        if (!p.getProducts().contains(PRODUCT_ID)) return;
        JSObject event = new JSObject();
        event.put("purchaseToken", p.getPurchaseToken());
        event.put("state", p.getPurchaseState() == Purchase.PurchaseState.PURCHASED ? "PURCHASED" : "PENDING");
        notifyListeners("purchase", event);
    }

    private static String sha256(String input) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder(64);
            for (byte b : hash) result.append(String.format("%02x", b & 0xff));
            return result.toString();
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    @Override
    protected void handleOnDestroy() {
        if (client != null) client.endConnection();
        super.handleOnDestroy();
    }
}
