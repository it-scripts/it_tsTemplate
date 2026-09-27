# 🚀 IT FiveM TypeScript & Vue 3 Template (`it_tsTemplate`)

Ein modernes, professionelles und hochperformantes FiveM-Ressourcen-Template auf Basis von **TypeScript**, **Vue 3 (Composition API)**, **TailwindCSS**, **Vite** und einem flexiblen **Translation / i18n System**.

---

## ✨ Features

- ⚡ **100% TypeScript**: Vollständig typisierte Client- und Server-Scripts sowie NUI Frontend.
- 🎨 **Modernes NUI (Vue 3 + TailwindCSS + Lucide Icons)**: Ultra-schnelle Ladezeiten via Vite, Dark Mode & Glassmorphism Design.
- 🌐 **Modulares Übersetzungssystem (i18n)**:
  - Zentrale JSON-Sprachdateien in `locales/` (`de.json`, `en.json`, usw.).
  - Unterstützt Parameter-Interpolation (`%{variable}` oder `%s`).
  - Dynamischer Sprachwechsel zur Laufzeit inklusive Synchronisation zwischen NUI und FiveM Backend.
- 🔄 **NUI <-> Client <-> Server Interaktions-Pipeline**:
  - Typisierte NUI Callback Wrapper (`registerNuiCallback`, `fetchNui`).
  - Beispieldialoge, Formulareingaben, Server-Ping, Live-Positionsdaten und Toast-Benachrichtigungen.
- 🛠️ **Lokaler Dev-Simulator**: Das NUI kann im Webbrowser (`npm run dev:web`) komplett ohne laufenden FiveM-Server mit Mock-Daten getestet werden.
- 📦 **Automatisierter Server-Export**: Mit einem einzigen Befehl (`npm run package`) wird das Skript fertig kompiliert und in einen separaten, sofort einsatzbereiten Server-Ordner (`release/it_tsTemplate`) exportiert.
- 🤖 **GitHub Actions CI/CD Release**: Automatische Erstellung von GitHub Releases inkl. ZIP-Artefakt bei jedem Merge in den `main`-Branch.

---

## 📁 Ordnerstruktur

```text
it_tsTemplate/
├── .github/
│   └── workflows/
│       └── release.yml          # GitHub Actions CI/CD Pipeline
├── config.json                  # Externe Konfiguration (ohne Recompile anpassbar)
├── locales/                     # Sprachdateien
│   ├── de.json
│   └── en.json
├── scripts/
│   ├── build.mjs                # TypeScript Build mit esbuild
│   ├── dev.mjs                  # Parallele Dev-Umgebung
│   └── package.mjs              # Standalone Server Packaging & ZIP
├── src/
│   ├── client/                  # FiveM Client Scripts
│   │   ├── client.ts            # Entrypoint, Commands & Keybinds
│   │   ├── nui.ts               # NUI Event & Callback Helpers
│   │   └── controllers/
│   │       └── exampleController.ts
│   ├── server/                  # FiveM Server Scripts
│   │   ├── server.ts            # Entrypoint & Logging
│   │   └── controllers/
│   │       └── exampleController.ts
│   └── shared/                  # Geteilter Code (Client & Server)
│       ├── config.ts            # Konfiguration
│       ├── locale.ts            # Universeller Translation Manager
│       └── types.ts             # TypeScript Interfaces & Types
├── web/                         # Vue 3 NUI Frontend
│   ├── src/
│   │   ├── App.vue              # Haupt-Komponente & NUI Dispatcher
│   │   ├── components/          # Vue Tabs, Toasts & Simulator
│   │   ├── plugins/i18n.ts      # Reaktives i18n Plugin
│   │   ├── stores/appStore.ts   # Pinia State Management
│   │   └── utils/fetchNui.ts    # NUI Fetch mit Browser Mocking
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── fxmanifest.lua               # FiveM Resource Manifest
├── package.json                 # Root Dependencies & Build Scripts
└── tsconfig.json
```

---

## 🚀 Erste Schritte

### 1. Abhängigkeiten installieren

Installiere die Node-Pakete für das Root-Projekt und das NUI Frontend:

```bash
# Im Root-Ordner (it_tsTemplate)
npm install

# Im Web-Ordner
npm --prefix web install
```

---

## 💻 Entwicklung (Development)

### Web Interface im Browser testen (Hot Reload)

```bash
npm run dev:web
```

Öffne `http://localhost:3000` im Browser. Oben erscheint die **Dev Browser Simulator Bar**, mit der du Events simulieren, das UI öffnen/schließen und Sprachen wechseln kannst.

### Live-Watching für FiveM Client & Server

```bash
npm run watch:scripts
```

### Alles zusammen starten

```bash
npm run dev
```

---

## 📦 Kompilieren & Deployment auf FiveM

### Schneller Build

```bash
npm run build
```

Kompiliert das NUI nach `dist/web` und die TypeScript-Scripts nach `dist/client.js` und `dist/server.js`.

### Fertiges Server-Package erstellen (Ready-to-Deploy)

```bash
npm run package
```

Dieser Befehl führt einen vollen Production-Build aus und erstellt:

1. Den Ordner `release/it_tsTemplate/` (enthält nur die fertigen Produktionsdateien wie `fxmanifest.lua`, `dist/`, `locales/`).
2. Das ZIP-Archiv `release/it_tsTemplate.zip`.

👉 **Installation auf FiveM Server:**
Kopiere einfach den Ordner `release/it_tsTemplate` in deinen FiveM `server-data/resources/` Ordner und füge `ensure it_tsTemplate` zu deiner `server.cfg` hinzu!

---

## 🌐 Übersetzungssystem (Neue Sprache hinzufügen)

1. Erstelle eine neue JSON-Datei in `locales/<sprache>.json` (z. B. `locales/es.json` für Spanisch).
2. Kopiere die Struktur aus `locales/en.json` und passe die Übersetzungen an.
3. Im Script aufrufen:

```typescript
import { t } from "./shared/locale";

// Einfacher Text
const welcomeMsg = t("general.welcome");

// Mit Parametern
const actionMsg = t("general.action_executed", { action: "Reparieren" });
```

---

## 🎮 FiveM In-Game Befehle & Tasten

- **Taste:** `F5` (Im GTA-Menü unter Tastenbelegungen anpassbar)
- **Chatbefehl:** `/template`

---

## 📄 Lizenz

MIT License.
