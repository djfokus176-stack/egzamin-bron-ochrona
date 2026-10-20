# Wersja mobilna — Android i iPhone (projekt testowy)

Repozytorium zawiera **kod aplikacji** i konfigurację Capacitor 8. **Nie jest jeszcze gotowym plikiem APK, AAB ani IPA**. Nie wymaga serwera do nauki. Po zbudowaniu cała baza pytań jest osadzona w aplikacji.

## Android na Windows
1. Zainstaluj Node.js w wersji wspieranej przez Capacitor 8, Android Studio oraz wymagane Android SDK/JDK. Sprawdź wymagania w [dokumentacji Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup).
2. Pobierz repozytorium lub wykonaj `git clone https://github.com/djfokus176-stack/egzamin-bron-ochrona.git`.
3. W katalogu projektu wykonaj:

```sh
npm install
npm run android:init
npm run android:open
```

4. W Android Studio wybierz testowy emulator/telefon. Aby przygotować podpisany **AAB** do Play Console, skorzystaj z `Build > Generate Signed Bundle / APK`, utwórz i zachowaj swój prywatny klucz podpisywania. **Nie wgrywaj go na GitHub**.
5. Dla kolejnych aktualizacji kodu: `npm run android:open`.

## iPhone / iOS
Do kompilacji i publikacji potrzebny jest Mac z Xcode oraz konto w Apple Developer Program (TestFlight/App Store). Na Macu:

```sh
npm install
npm run ios:init
npm run ios:open
```

Po otwarciu projektu w Xcode ustaw swój team podpisujący i przeprowadź archiwizację oraz przesłanie do App Store Connect. W razie potrzeby doinstaluj narzędzia CocoaPods zgodnie z bieżącą dokumentacją Capacitor.

## Ważne przed publikacją w sklepach
- Uzupełnij wiarygodne dane dewelopera i bezpośredni kontakt w polityce prywatności. Projekt jest obecnie prototypem, **nie jest jeszcze gotowy do publicznej sprzedaży**.
- W pełni skontroluj wszystkie 200 odpowiedzi oraz aktualność tekstu ustawy, rozporządzenia i zasad egzaminu.
- Zapewnij zrozumiałe, praktyczne zgłaszanie błędów także osobom bez konta GitHub (obecnie zgłoszenia w GitHub Issues wymagają zalogowania i są publiczne).
- Przygotuj grafiki sklepowe, ikony PNG o wymaganych wymiarach, zrzuty ekranów, opis źródeł i wyraźny brak związku z Policją.
- Zweryfikuj na urządzeniach zachowanie linków zewnętrznych, dialogu zgłoszeń, eksportu/importu JSON oraz zachowania zapisów po aktualizacji aplikacji.
- Apple może odrzucić zbyt prosty wrapper strony — należy wykazać rzeczywistą funkcjonalność edukacyjną i użyteczność offline.
- Jeśli dojdą reklamy, płatności, konta lub backend, zaktualizuj politykę prywatności, formularze danych w Google Play / App Store oraz rozważ dodatkowe obowiązki prawne.

## Koszt i konta
Google Play Console: opłata rejestracyjna ok. **25 USD jednorazowo**. Dla nowych kont osobistych zwykle wymagany jest test zamknięty (12 osób przez 14 dni). Apple Developer Program: **99 USD rocznie**. Tworzenie i testowanie prototypu lokalnie nie wymaga od razu opłaty sklepowej.
