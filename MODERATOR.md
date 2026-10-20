# Moderator — obsługa zgłoszeń pytań

Ten projekt ma **publiczną skrzynkę zgłoszeń** w GitHub Issues. Użytkownik klika przycisk „⚑ Zgłoś błąd” przy konkretnym pytaniu, następnie otwiera GitHub, **loguje się i zatwierdza utworzenie zgłoszenia**. Samo naciśnięcie przycisku w aplikacji **nie jest jeszcze wysłaniem zgłoszenia**.

### Gdzie zgłoszenia trafiają?

[Otwórz skrzynkę moderatora — Issues](https://github.com/djfokus176-stack/egzamin-bron-ochrona/issues).

Właściciel repozytorium może oznaczać, zamykać i komentować zgłoszenia. Osoba bez konta GitHub nie prześle zgłoszenia w ten sposób.

### Zasady bezpiecznej moderacji

- Sprawdź numer pytania, przytoczony artykuł i aktualny tekst ustawy z ELI.
- Nie zmieniaj odpowiedzi automatycznie na podstawie pojedynczego zgłoszenia.
- Udokumentuj w zgłoszeniu cytowaną podstawę prawną (link, przepis, data weryfikacji), decyzję i numer nowej wersji aplikacji.
- Popraw `const KEY` w `index.html`, aktualizuj `audit.html` i testy, potem uruchom GitHub Actions.
- Jeżeli zgłoszenie zawiera dane osobowe, wykorzystaj funkcje moderacji GitHub do ich usunięcia / ukrycia; nie kopiuj ich do kodu lub logów.
- Nie używaj oznaczeń i logotypów Policji sugerujących autoryzację.

### Publiczne uruchomienie

Dla powszechnej aplikacji zalecany jest dodatkowy, prosty kontakt do wydawcy bez konta GitHub. Można wdrożyć bezpieczny formularz z moderacją antyspamową, gdy właściciel wskaże adres lub skonfiguruje backend. Obecnie nie ma żadnej prywatnej skrzynki e-mail ani bazy zgłoszeń po stronie serwera.

**Ważne:** wymagany przez Google Play adres e-mail kontaktowy dewelopera musi podać właściciel konta Play Console.
