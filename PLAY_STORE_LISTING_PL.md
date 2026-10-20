# Google Play — gotowy tekst opisu (PL)

**Nazwa aplikacji (Google Play):** Quiz Ochrona – Testy ABC

**Krótki opis (poniżej 80 znaków):**

200 pytań ABC, próbne egzaminy i powtórki błędów. Aplikacja niezależna.

## Pełny opis

**Quiz Ochrona – Testy ABC** to niezależna aplikacja edukacyjna wspierająca przygotowanie do części teoretycznej egzaminu z przepisów dotyczących broni i amunicji oraz dopuszczenia do posiadania broni.

Najważniejsze funkcje:
- Zestaw 200 pytań i wariantów odpowiedzi A/B/C na podstawie bazy egzaminacyjnej opublikowanej przez Policję.
- Nauka z natychmiastowym sprawdzeniem odpowiedzi.
- Próbny egzamin: 20 pytań, 30 minut, próg 18 poprawnych odpowiedzi.
- Szybki test 10 pytań.
- Baza własnych błędów, statystyki pomyłek i powtórki aż do opanowania pytań.
- Lokalny zapis postępów i eksport/import historii w JSON.
- Możliwość zgłaszania wątpliwości do klucza przez GitHub Issues (wymaga konta GitHub, zgłoszenia są publiczne).
- Nauka dostępna bez połączenia z internetem.

**Ważne:** Aplikacja nie jest oficjalną aplikacją Policji, nie jest wydawana ani autoryzowana przez jakikolwiek organ państwowy. Nie pozwala załatwiać spraw urzędowych. Pytania mają źródło w publicznym zestawie Policji, ale klucz poprawnych odpowiedzi jest **nieoficjalnym opracowaniem edukacyjnym**, wymagającym dalszej kontroli zgodności z aktualnymi przepisami. Aplikacja nie gwarantuje zdania państwowego egzaminu.

Oficjalna baza pytań:
https://ksp.policja.gov.pl/download/188/236472/PYTANIAEGZAMINACYJNE.pdf

Przepisy:
https://eli.gov.pl/api/acts/DU/2024/485/text.html

Informacje o stanie weryfikacji:
https://djfokus176-stack.github.io/egzamin-bron-ochrona/audit.html

Polityka prywatności:
https://djfokus176-stack.github.io/egzamin-bron-ochrona/privacy.html

## Konfiguracja w Play Console

- **Kategoria:** Edukacja
- **Cena:** na początek bezpłatna; późniejsza zmiana modelu wymaga przeanalizowania zasad Play.
- **Reklamy:** brak w obecnej wersji.
- **Zakupy w aplikacji:** brak w obecnej wersji.
- **Wymagane od wydawcy:** prawdziwy adres kontaktowy e-mail do wsparcia, informacje o deweloperze, formularz bezpieczeństwa danych, deklaracja treści rządowych / brak powiązania z Policją, klasyfikacja treści i wymagany test.
- **Zastrzeżenie:** nie wybieraj w konsoli odpowiedzi dotyczących danych osobowych bez sprawdzenia wszystkich komponentów, w tym GitHub Issues oraz hostingu GitHub Pages.

## Grafiki

- `play_icon_512.png`: 512×512 (ikona sklepu)
- `feature_graphic_1024x500.png`: 1024×500 (grafika promocyjna)
- Wykonane przez Playwright zrzuty ekranu aplikacji: workflow `Zrzuty ekranu Google Play` → `Artifacts` → cztery obrazy 1080×1920.
- Przejrzyj finalne zrzuty i upewnij się, że odpowiadają bieżącej wersji programu i nie pokazują prywatnych danych.

Nie prześlij aplikacji do produkcji bez ukończenia audytu 200 odpowiedzi i podpisania AAB.
