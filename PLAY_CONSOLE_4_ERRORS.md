# Cztery błędy Google Play Console — sposób rozwiązania

Sprawdzone 23 października 2026 na podstawie rzeczywistego ekranu błędów przesłanego przez właściciela.

## 1. Brak pełnego opisu

W Google Play Console → **Obecność w Google Play** → **Główna strona aplikacji** wklej w pole **Pełny opis** treść z pliku [PLAY_STORE_LISTING_PL.md](PLAY_STORE_LISTING_PL.md). Zapisz. Limit 4000 znaków.

## 2. Brak deklaracji funkcji finansowych

Kliknij **Przejdź do funkcji finansowych** z listy błędów (albo Zasady i programy → Zawartość aplikacji → Funkcje finansowe). Wybierz opcję znaczącą **Moja aplikacja nie udostępnia żadnych funkcji finansowych**, a następnie **Zapisz**.

W obecnej wersji aplikacja to quiz edukacyjny. Nawet planowany zakup przez Google Play Billing nie jest oferowaniem usług bankowych, pożyczek, portfeli, transferów pieniędzy czy doradztwa finansowego. Deklaracja dotyczy funkcji finansowych świadczonych użytkownikom, a nie tego, że w sklepie będzie można kiedyś zapłacić za aplikację.

## 3. Brak deklaracji zdrowotnej

Kliknij **Przejdź do deklaracji** (albo Zasady i programy → Zawartość aplikacji → Zdrowie). Zaznacz **Moja aplikacja nie oferuje żadnych funkcji zdrowotnych**, a następnie **Zapisz**.

Nauka przepisów o broni nie jest funkcją medyczną, monitorowaniem zdrowia ani treningiem zdrowotnym.

## 4. „Aplikacji nie można na razie opublikować”

To zbiorczy błąd informujący, że nadal istnieją niezakończone zadania na stronie **Panel**. Kliknij **Otwórz Panel** i dokończ deklaracje treści, informacje o aplikacji, politykę prywatności oraz pozostałe pozycje. Nie zaznaczaj fałszywych odpowiedzi, aby ominąć kontrolę.

## Ważne ograniczenia

- ChatGPT nie ma z tego połączenia możliwości klikania ani zatwierdzania oświadczeń na prywatnym koncie Google Play Console.
- Plik AAB przesłano już do wersji testowej; nie trzeba go wgrywać ponownie tylko dlatego, że brakuje deklaracji.
- Polityka prywatności i usuwanie konta nadal wymagają uzupełnienia przed wydaniem do produkcji; automatyczny proces usuwania konta nie jest jeszcze wdrożony.
- Przed sprzedażą niezbędne są działające płatności, serwerowa kontrola dostępu i pełny audyt 200 odpowiedzi.

## Źródła Google

- https://support.google.com/googleplay/android-developer/answer/13849271
- https://support.google.com/googleplay/android-developer/answer/14738291
- https://support.google.com/googleplay/android-developer/answer/13393723
