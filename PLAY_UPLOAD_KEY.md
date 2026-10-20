# Jak otrzymać podpisany AAB do Google Play

Bezpieczny klucz podpisujący musi należeć do właściciela aplikacji. **Nie umieszczaj go w repozytorium i nie wysyłaj go do czatu.** Przygotowane GitHub Actions nigdy nie drukuje haseł ani zawartości klucza.

## Etap A — przygotowanie klucza na Twoim komputerze

Zainstaluj JDK (Java) i uruchom w PowerShell w swoim prywatnym katalogu:

```powershell
keytool -genkeypair -v -keystore quiz-ochrona-upload.jks -alias quizochrona -keyalg RSA -keysize 3072 -validity 10000
```

Program poprosi o hasło magazynu i hasło klucza oraz dane certyfikatu. Zapisz wszystko **offline** i zrób zaszyfrowaną kopię zapasową `quiz-ochrona-upload.jks`. Jeśli `keytool` jest nierozpoznawany, uruchom terminal JDK lub użyj pełnej ścieżki do `keytool.exe`.

Następnie skopiuj zawartość klucza zakodowaną do base64 do schowka, nie wypisując jej na ekranie:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\quiz-ochrona-upload.jks"))) | Set-Clipboard
```

## Etap B — cztery sekrety GitHub

Wejdź na [Settings → Secrets and variables → Actions](https://github.com/djfokus176-stack/egzamin-bron-ochrona/settings/secrets/actions) i dodaj poniższe sekrety repozytorium (*New repository secret*):

1. `PLAY_UPLOAD_KEYSTORE_B64` — zawartość schowka z PowerShell.
2. `PLAY_UPLOAD_STORE_PASSWORD` — hasło do magazynu.
3. `PLAY_UPLOAD_KEY_ALIAS` — `quizochrona` (jeżeli tak nazwałeś klucz).
4. `PLAY_UPLOAD_KEY_PASSWORD` — hasło do klucza.

Wartości te powinieneś wprowadzić **sam**. Nie wpisuj ich w Issues, README ani plikach kodu.

## Etap C — automatyczna kompilacja

Otwórz [Play Console — Android AAB](https://github.com/djfokus176-stack/egzamin-bron-ochrona/actions/workflows/play-aab.yml), kliknij **Run workflow** na `main`. Kiedy zakończy się pomyślnie, pobierz artefakt `quiz-ochrona-play-aab` i rozpakuj ZIP. Powinien zawierać:

- `app-release.aab` — pakiet do Google Play.
- `SIGNING_STATUS.txt` — potwierdzenie **PODPISANY** (jeżeli to `NIEPODPISANY`, nie wgrywaj pliku!).

Podpisany AAB prześlij do **testów wewnętrznych** Google Play Console. Nie wybieraj od razu udostępnienia publicznego.

## Uwagi

- `applicationId` = `pl.djfokus176.quizochrona`; po opublikowaniu nie zmieniaj identyfikatora.
- `versionCode` = 2, `versionName` = 1.3.0. Przy kolejnym wydaniu należy zwiększyć versionCode.
- Capacitor 8 celuje w API 36. Workflow sprawdza tę wartość przy każdej kompilacji.
- Po aktywowaniu Play App Signing podpis Google Play chroni aplikację wydawaną użytkownikom. Własny **upload key** nadal służy do podpisywania kolejnych aktualizacji.
- Nie publikuj publicznie bez zakończenia audytu klucza odpowiedzi, uzupełnienia danych wydawcy w polityce prywatności i przejścia wymaganych testów w Google Play.
