# Warunki publikacji i audyt legalności (wersja robocza, 20.10.2026)

**Nie jest to opinia prawna ani certyfikat zgodności.** Projekt ma już bazę pytań i obsługę zgłoszeń, lecz nie powinien jeszcze być oferowany komercyjnie bez weryfikacji. Stan dotyczy niezależnej aplikacji edukacyjnej, a nie usług Policji ani sprzedaży broni.

## 1. Nazwa, źródła i prawa autorskie

- Nie używaj oficjalnych odznak, logo Policji ani tytułu sugerującego upoważnienie („oficjalna aplikacja Policji”).
- W sklepie i w aplikacji podawaj, że to **niezależny quiz edukacyjny**, a źródłem materiału egzaminacyjnego jest [publiczny PDF Policji](https://ksp.policja.gov.pl/download/188/236472/PYTANIAEGZAMINACYJNE.pdf).
- Art. 4 prawa autorskiego wyłącza z ochrony m.in. urzędowe dokumenty i materiały; **nie oznacza to automatycznej licencji na każdy cudzy zbiór, transkrypcję, komentarz, grafikę lub aplikację**. Należy potwierdzić status pytań i prawa do opracowania oraz porównać tekst z oryginalnym PDF.
- Wewnętrzna transkrypcja pytań pochodziła z [blues-git/wpa-quiz](https://github.com/blues-git/wpa-quiz), a nie z autorskiej ręcznej transkrypcji oryginalnego PDF. Należy sprawdzić zgodność i ewentualne prawa do części autorskich, jeśli występują.

## 2. Odpowiedzi i ryzyko wprowadzenia w błąd

- Odpowiedzi Policji nie zostały udostępnione jako oficjalny klucz. W bazie poprawiono na podstawie ustawy: **11: B (art. 5 ust. 3), 50: B (art. 10 ust. 6), 67: A (art. 12 ust. 2), 155: A (art. 34 ust. 1)**.
- **196 pozostałych odpowiedzi nie ma zakończonej, indywidualnej weryfikacji**. Nie przedstawiaj tego klucza jako pewnego ani oficjalnego. Dodatkowy audyt powinien obejmować akty wykonawcze i kodeks karny, nie tylko ustawę o broni i amunicji.
- Wysyłanie błędów przez użytkowników nie może samodzielnie zmieniać poprawnej odpowiedzi. Moderator powinien odnotować podstawę prawną, datę weryfikacji, decyzję i zmianę wersji programu.

## 3. Prywatność i zgłoszenia

- Bez kont użytkowników aplikacja zapisuje historię lokalnie w localStorage. Po aktualizacji APK / zmianie telefonu dane mogą się nie przenieść automatycznie. Użytkownik ma eksport/import JSON i reset wyników.
- Zgłoszenia obecnie odbywają się w **publicznych GitHub Issues** i wymagają konta. Interfejs ostrzega, żeby nie publikować danych osobowych. Dla powszechnej aplikacji należy wdrożyć bardziej dostępny kanał (formularz z backendem lub adres wsparcia) oraz proces reagowania na zgłoszenia.
- Przed komercyjną publikacją polityka prywatności musi zawierać prawdziwe dane administratora, kontakt, opis podstaw i celów przetwarzania, okres retencji i sposób realizacji praw osób. Konieczne jest uzupełnienie formularzy Google Play Data safety i App Store Privacy po ostatecznym wyborze narzędzi.
- Obecna strona `privacy.html` to **opis wersji testowej**; bez danych podmiotu i ostatecznego kanału zgłoszeń nie należy jej przedstawiać jako gotowej polityki RODO dla wersji komercyjnej.

## 4. Google Play

- Źródła informacji urzędowych muszą być widoczne w sklepie i aplikacji; zastrzeżenie braku powiązań z Policją musi być wyraźne.
- Wypełnij deklarację Government apps, klasyfikację treści i Data safety rzetelnie, zgodnie z rzeczywistym przetwarzaniem danych.
- Konto: [Play Console](https://support.google.com/googleplay/android-developer/answer/6112435) — 25 USD opłaty jednorazowej. Nowe konta osobiste: zwykle [12 testerów przez co najmniej 14 dni](https://support.google.com/googleplay/android-developer/answer/14151465) przed możliwością ubiegania się o dostęp produkcyjny.
- Testowy APK z GitHub Actions nie jest pakietem produkcyjnym. Wydanie sklepowe wymaga podpisanego AAB, odpowiednich ikon/grafik i testów na urządzeniach.

## 5. App Store

- Apple Developer Program: [99 USD rocznie](https://developer.apple.com/programs/whats-included/). Do natywnego budowania IPA potrzebny jest Mac z Xcode (lub płatny runner macOS).
- Guideline 4.2: Apple może odrzucić wyłącznie zapakowaną stronę. Utrzymuj funkcjonalność offline, nawigację mobilną, powtórki i prawdziwą użyteczność. Potrzebne testy na iOS i prawidłowe zewnętrzne linki.
- W App Store Connect podaj prawdziwy kontakt dewelopera, URL polityki prywatności, informacje o źródłach, brak związku z Policją i metadane adekwatne do faktycznej aplikacji.

## 6. Sprzedaż w Polsce

- Jeśli aplikacja będzie płatna, potrzebne są dodatkowe decyzje: sposób prowadzenia działalności / opodatkowanie, zasady konsumenckie dotyczące treści cyfrowych, regulamin, ewentualne płatności w sklepach i zasady zwrotów. Warto zamówić krótki przegląd z polskim prawnikiem obsługującym IT i e-commerce przed pobieraniem opłat.
- Nie obiecuj zdania państwowego egzaminu ani zgodności przepisów bez daty ostatniego audytu.

**Oficjalne regulacje sklepów:** [Google Play — informacje urzędowe](https://support.google.com/googleplay/android-developer/answer/9514050?hl=en), [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), [art. 4 ustawy o prawie autorskim](https://eli.gov.pl/api/acts/DU/2019/1231/text.html).
