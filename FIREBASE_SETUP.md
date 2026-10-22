# Testy na Broń – Ochrona: podłączenie Firebase

**Stan (22.10.2026):** publiczny `firebaseConfig` został dodany do aplikacji dla projektu `testy-na-bron`. To łączy klienta z właściwym projektem, ale **nie potwierdza włączenia Authentication ani utworzenia Firestore i wdrożenia jego reguł**. Płatności nie są uruchomione. Nie uruchamiaj publicznej blokady nauki, dopóki nie zostaną zweryfikowane logowania i uprawnienia.

## 1. Zarejestruj aplikację internetową

Na stronie [Firebase Console](https://console.firebase.google.com/) otwórz projekt `testy-na-bron`.

Na **Project Overview** kliknij **+ Add app** i wybierz ikonę **Web (</>)**. 
Nazwa rozpoznawcza: `Testy na Broń – Ochrona (web + Capacitor)`.
Nie włączaj Firebase Hosting; aktualna strona jest publikowana przez GitHub Pages.
Kliknij **Register app**. W zakładce **SDK setup and configuration** przełącz się na **Config** i zanotuj obiekt `firebaseConfig`: `apiKey`, `authDomain`, `projectId`, `appId` (opcjonalnie pozostałe pola).

**Ważne:** konfiguracja klienta Firebase nie jest kluczem administracyjnym, ale nigdy nie publikuj hasła, tokenu konta, klucza service-account ani pliku JSON konta serwisowego.

## 2. Włącz logowanie

**Security → Authentication → Get started → Sign-in method → Email/Password → Enable → Save**.

Następnie **Authentication → Settings → Authorized domains**: dodaj dokładny host `djfokus176-stack.github.io` do listy dozwolonych domen, jeśli jeszcze go tam nie ma. Dodatkowy schemat hosta aplikacji mobilnej może wymagać osobnej konfiguracji po testach na urządzeniu.

## 3. Utwórz bazę Firestore

**Databases & Storage → Firestore Database → Create database**. Wybierz region europejski i **Production mode** (domyślnie zamknięte reguły), a następnie w **Rules** wstaw zawartość pliku [firebase/firestore.rules](firebase/firestore.rules) i kliknij **Publish**.

Plik definiuje tylko dwie kolekcje:
- `trials/{uid}` – jeden niezapisywalny ponownie znacznik `startedAt` nadany czasem serwera, 3 dni próbne;
- `entitlements/{uid}` – zapisane przez zaufany backend uprawnienie `owner` albo `paidUntil`. Zwykły klient nie może ich edytować.

Przykładowy dokument przyznawany właścicielowi przez administracyjną konsolę Firebase (dopiero po rozpoznaniu jego UID): `entitlements/<UID>` z polem `tier` o wartości `owner`. **Nie podawaj UID innej osoby i nie opieraj się na adresie e-mail wpisywanym przez klienta.**

## 4. Co będzie następne?

- Podłączyć Firebase SDK do obecnej aplikacji (web i Android/Capacitor), wykorzystując konkretny `firebaseConfig`.
- Dodać rejestrację, logowanie, reset hasła i synchronizację sesji.
- Rozpocząć pierwsze 3 dni od **pierwszego zalogowania** i zapisywać datę tylko po stronie zaufanej usługi/Firestore, a nie według daty telefonu.
- Wdrożyć zakup **7 dni za 5 zł** przez Google Play Billing. Backend musi zweryfikować Google Play purchase token i dopiero po tym przyznać datę końca dostępu. Operacje serwerowe mogą wymagać rozliczania Firebase Blaze; sprawdź koszty przed włączeniem.
- Przetestować przywracanie zakupów, użytkownika po 3 dniach, drugi telefon, zmianę hasła i konto właściciela.
- Sprawdzić legalność i poprawność klucza odpowiedzi oraz aktualizować politykę prywatności, zanim aplikacja będzie sprzedawana.

**Bezpieczeństwo i ograniczenia:** sama baza `trials` nie zapobiegnie tworzeniu nowych kont w celu uzyskania kolejnego okresu próbnego. Połączenie z Firebase, włączenie Email Verification, App Check i zabezpieczenia przeciwko nadużyciom będą potrzebne przy wdrożeniu. Obecnie pytania są statycznie osadzone w aplikacji, więc sam interfejsowy ekran paywalla nie chroni przed modyfikacją kodu; pełna ochrona płatnej bazy wymaga architektury, w której serwer egzekwuje dostęp.

## 5. Ekran konta — przygotowany w repozytorium

Został dodany [account.html](account.html) i [account.js](account.js). Po wpisaniu **wyłącznie publicznego** obiektu `firebaseConfig` do [firebase-config.js](firebase-config.js) i opublikowaniu reguł Firestore ekran umożliwi e-mail/hasło, potwierdzenie adresu, reset hasła, wylogowanie i odczyt trzydniowej próby z serwera.

Na GitHubie otwórz [firebase-config.js](firebase-config.js), kliknij ikonę ołówka i zamień `null` na obiekt z konsoli Firebase, przykładowo:

```js
export const firebaseConfig = {
  apiKey: "wartość z Firebase Console",
  authDomain: "wartość z Firebase Console",
  projectId: "wartość z Firebase Console",
  appId: "wartość z Firebase Console"
};
```

Nie używaj fikcyjnych wartości z tego przykładu. Nazwa projektu widoczna w panelu nie gwarantuje, że prawdziwy `projectId` jest taki sam. Konfiguracja klienta Firebase jest widoczna publicznie, dlatego bezpieczeństwo opiera się na **regułach Firestore, uprawnieniach kont i serwerowej weryfikacji płatności**, a nie na jej ukrywaniu.

Konfiguracja została już ustawiona przez właściciela w czacie; wejdź na https://djfokus176-stack.github.io/egzamin-bron-ochrona/account.html i przetestuj konto dopiero po aktywacji Email/Password i utworzeniu Firestore z regułami.

**Uwaga:** obecny ekran nie weryfikuje jeszcze zakupów, nie blokuje nauki i nie zapewnia egzekwowania 3 dni przeciwko zakładaniu nowych kont. Przygotowanie frontendu nie oznacza uruchomienia płatnej usługi.

## 6. Google Play Billing — kod przygotowany, sprzedaż wyłączona

W repozytorium znajduje się `native/PlayBillingPlugin.java` i backend `functions/index.js`. Aktualnie `billing-config.js` ma `BILLING_ENABLED = false`, więc nikt nie może zostać obciążony za pomocą nieuruchomionej funkcji serwerowej. Procedura uruchomienia jest w [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md).
