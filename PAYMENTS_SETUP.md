# Uruchomienie płatności — Testy na Broń – Ochrona

## Obecny status

**Właściciel jest już rozpoznawany jako `tier = owner` i nie płaci.** Wersja v1.4 zawiera roboczy kod zakupów Android i serwerowej weryfikacji. Nie uruchamia jednak jeszcze transakcji: `billing-config.js` ma `BILLING_ENABLED = false`.

W tej chwili rejestracja i trzydniowa próba są zapisywane w Firebase, ale nauka nadal pozostaje dostępna bez opłat. Nie ma jeszcze skutecznej blokady płatnych pytań. **Nie publikować jako płatną aplikację.**

## Model sprzedaży

- Nowy użytkownik: 3 dni dostępu od potwierdzenia e-maila, liczone od znacznika czasu serwera w Firestore.
- Po trzech dniach: 5,00 zł za 7 dni, bez automatycznego odnawiania; kolejny zakup może przedłużyć okres ważności.
- Konto właściciela: bezterminowe, bezpłatne, rozpoznawane po UID i `tier = owner`, a nie po publicznym adresie e-mail.
- Kod produktu Google Play: `dostep_7_dni`, typ jednorazowy konsumowalny (INAPP).

## Google Play Console — kroki właściciela

1. Utwórz aplikację o niezmiennym identyfikatorze `pl.djfokus176.quizochrona` w [Play Console](https://play.google.com/console/).
2. W sekcji płatności skonfiguruj profil sprzedawcy, konto bankowe i wymagane dane podatkowe. Pieniądze wypłaca Google na rachunek bankowy.
3. W sekcji produktów w aplikacji utwórz jednorazowy produkt `dostep_7_dni`, nazwa `7 dni dostępu`, cena w Polsce `5,00 zł`. Produkt musi pozwalać na ponowny zakup po wykorzystaniu.
4. Po skonfigurowaniu bezpiecznego podpisu i AAB wgraj testową wersję przez Play Console. Dodaj testerów licencyjnych, żeby przetestować proces bez realnego obciążania.
5. Powiąż Play Developer API z kontem serwisowym uruchomieniowym Firebase Functions i nadaj mu ograniczone uprawnienia weryfikacji i obsługi zakupów. **Nie przesyłaj konta serwisowego do chatu lub repozytorium.**

## Firebase — kroki właściciela

1. Plan Spark wystarcza do kont i Firestore w ramach limitów. Serwerowe Firebase Cloud Functions do weryfikacji płatności wymagają planu Blaze i skonfigurowanego rozliczania; ustaw alert budżetowy.
2. Po włączeniu Blaze wdroż funkcję z `functions/index.js`, nazwa `verifyPlayPurchase`, region `europe-west1`, upewniając się, że konto serwisowe posiada dostęp do Google Play Developer API.
3. Przetestuj transakcję i sprawdź, że token dostępu jest potwierdzany na serwerze oraz odtwarzany po utracie połączenia. Nie włączaj sprzedaży przy błędach funkcji.
4. Przed udostępnieniem produkcyjnym trzeba wdrożyć obsługę zwrotów, anulowań i ponowień nieudanego zużycia produktu (Google RTDN / Voided Purchases API).

## Obowiązkowe zabezpieczenia przed sprzedażą

- Przenieś bazę pytań i klucz odpowiedzi poza publiczną stronę HTML oraz poza bezwarunkowo pakowany APK. Dopiero wtedy Firestore będzie mógł egzekwować dostęp do treści po upływie okresu próbnego.
- Dodaj sprawdzanie uprawnień przy wejściu do aplikacji i przełączeniu zakładek. Bez poprawnego statusu owner, aktywnej próby lub opłaconego okresu pokaż ekran zakupu.
- Nigdy nie przyznawaj opłaconych dni w JavaScript. Uprawnienia wpisuje wyłącznie serwer po weryfikacji Google Play.
- Testuj refund, oczekującą płatność, awarie sieci, duplikaty tokenów, logowanie na drugim telefonie, 3-dniowy limit i status owner.
- Dokończ prawny audyt wszystkich 200 pytań oraz aktualizację regulaminu i polityki prywatności; bez tego aplikacja nie powinna być sprzedawana.

## Uwaga o obecnym kodzie

`native/PlayBillingPlugin.java` i `functions/index.js` to implementacja do uruchomienia i testów, **nie działająca usługa płatności**. Obecny `BILLING_ENABLED = false` celowo uniemożliwia obciążenie klienta bez pewnej możliwości przyznania dostępu.

Oficjalne dokumenty: [Google Play Billing](https://developer.android.com/google/play/billing/integrate), [Firebase Functions](https://firebase.google.com/docs/functions), [Payments profile](https://support.google.com/googleplay/android-developer/answer/7161426).
