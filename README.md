# Testy na Broń – Ochrona

Nieoficjalna, darmowa aplikacja treningowa do egzaminu na **dopuszczenie do posiadania broni** dla kwalifikowanych pracowników ochrony fizycznej.

## Uruchomienie

Wystarczy otworzyć plik `index.html` w przeglądarce lub opublikować katalog główny przez GitHub Pages. **Nie potrzeba serwera, konta ani dodatkowego pliku pytań.** Wszystkie 200 pytań A/B/C zostało osadzonych w `index.html`.

### GitHub Pages

1. Otwórz `Settings → Pages`.
2. Ustaw `Build and deployment → Deploy from a branch`.
3. Ustaw `main` i `/(root)`, następnie kliknij **Save**.
4. Gdy strona zostanie opublikowana, otwórz: https://djfokus176-stack.github.io/egzamin-bron-ochrona/

## Funkcje

- Baza 200 pytań opublikowanych przez Policję, bez konieczności pobierania ich w przeglądarce.
- Nauka z natychmiastową oceną odpowiedzi.
- Losowa kolejność pytań, ale zachowana oryginalna kolejność odpowiedzi A/B/C (część pytań odwołuje się do liter a i b).
- Symulacja 20 pytań na 30 minut; 18 poprawnych do zaliczenia.
- Szybki test 10 pytań, wyszukiwarka całej bazy, powtórki błędów.
- Historia wyników przechowywana w `localStorage` oraz eksport i import JSON.
- **Trwała baza błędów:** wszystkie nowe pomyłki są zapisywane i nie znikają po poprawnym rozwiązaniu; liczba błędów, przegląd wszystkich problematycznych pytań.
- **Powtórki:** automatyczne oznaczenie jako opanowane po 3 poprawnych odpowiedziach z rzędu, ręczne oznaczanie i przywracanie do powtórek.
- **Zachowanie dotychczasowych danych:** aktywne błędy z wcześniejszej wersji są przenoszone przy otwarciu nowej strony. Błędów wymazanych przez dawny program nie da się odzyskać.
- Działa na telefonie i komputerze, offline po zapisaniu pliku.

## Zgłaszanie błędów i aplikacje mobilne

Od wersji 1.2 przy pytaniach działa przycisk zgłoszenia błędu do publicznych GitHub Issues (zalogowanie kontem GitHub jest wymagane). Udostępniono manifest PWA, działanie offline i konfigurację Android/iOS w Capacitor; szczegóły w [MOBILE_PUBLISHING.md](MOBILE_PUBLISHING.md). Klucz poprawiono dla pytań 11, 50, 67 oraz 155 według wskazanych przepisów.

## Ważne informacje o odpowiedziach

Policja publikuje pytania bez oficjalnego klucza. Klucz odpowiedzi programu jest **nieoficjalnym opracowaniem edukacyjnym i wymaga niezależnego audytu przed komercjalizacją**. Przed egzaminem sprawdzaj aktualne przepisy. W szczególności poprawiono roboczą odpowiedź na pytanie 134 (A) zgodnie z art. 28 ustawy, ale całość klucza nie jest jeszcze po audycie.

Oficjalny zbiór pytań (PDF): https://ksp.policja.gov.pl/download/188/236472/PYTANIAEGZAMINACYJNE.pdf

KWP Szczecin (opis egzaminu): https://zachodniopomorska.bip.policja.gov.pl/KWS/wydzial-postepowan-admi/licencje-1/24805%2CDopuszczenie-do-posiadania-broni.html

Kopia tekstowa 200 pytań użyta do budowy programu: https://github.com/blues-git/wpa-quiz/blob/main/pytania/PYTANIA_EGZAMINACYJNE.txt

## Prywatność

Wyniki nie są wysyłane na serwer ani na GitHub. Dane znikną po wyczyszczeniu pamięci witryny w przeglądarce; dlatego eksportuj kopię JSON.

## Rozwój

Przed publiczną sprzedażą konieczny jest audyt klucza i podstaw prawnych, weryfikacja licencji do materiałów, testy na urządzeniach mobilnych, właściwe informacje prawne i regulamin. Repozytorium jest obecnie prototypem treningowym.

## Publikacja Android

Proces budowania AAB (z podpisem dopiero po konfiguracji klucza właściciela) opisano w [PLAY_UPLOAD_KEY.md](PLAY_UPLOAD_KEY.md). Aplikacja docelowo korzysta z API 36. Wersja próbna **nie została jeszcze dopuszczona do publicznej sprzedaży**.

## Model przyszłych opłat

Właściciel (`tier=owner`) ma bezterminowo darmowy dostęp. Planowany jest trzydniowy okres próbny i 7 dni za 5 zł. Przygotowano [moduł Google Play Billing](PAYMENTS_SETUP.md), ale **płatności nie są jeszcze aktywne** — wymagają osobnej konfiguracji Play Console i Firebase Functions na planie Blaze. Nie uruchamiaj paywalla bez serwerowego egzekwowania dostępu. 
