# FiveM TypeScript & Vue 3 Resource Template (`it_tsTemplate`)

A production-grade boilerplate for developing FiveM resources using modern web tooling and TypeScript. It features a fully typed pipeline across Client, Server, and NUI, utilizing Vue 3 (Composition API), Vite, Tailwind CSS, Pinia, and an extensible i18n runtime.

---

## Architecture & Features

- **End-to-End TypeScript**: Strict type definitions shared across FiveM Client, Server, and NUI frontend code.
- **Modern NUI Stack**: Vue 3 with Composition API, Vite for hot module replacement (HMR), Tailwind CSS, and Lucide icons.
- **Runtime i18n Subsystem**:
  - Unified JSON definitions in `locales/` (`en.json`, `de.json`, etc.).
  - Interpolation support via `%{variable}` or `%s`.
  - Dynamic runtime locale changes synchronized across the NUI and FiveM client runtime.
- **NUI Communication Pipeline**:
  - Wrapped helper utilities (`fetchNui`, `registerNuiCallback`) handling data serialization and event lifecycles.
  - Browser mock environment for standalone UI development (`npm run dev:web`) without an active FXServer instance.
- **Build & Packaging Workflow**:
  - esbuild bundling for Client and Server scripts.
  - Automatic packaging into production-ready standalone directories (`release/<resource_name>`) and deployable `.zip` archives.
  - Multi-file version management keeping root `package.json`, `web/package.json`, and `fxmanifest.lua` in sync.
- **CI/CD Integration**: Pre-configured GitHub Actions workflow generating release assets and changelogs derived from Conventional Commits.

---

## Directory Structure

```text
it_tsTemplate/
├── .github/
│   └── workflows/
│       └── release.yml          # Automated CI/CD release workflow
├── config.json                  # External runtime configuration
├── locales/                     # Localization data files
│   ├── de.json
│   └── en.json
├── scripts/
│   ├── build.mjs                # Script bundler using esbuild
│   ├── bump-version.mjs         # SemVer synchronization utility
│   ├── changelog.mjs            # Conventional commit parser
│   ├── dev.mjs                  # Concurrent dev execution environment
│   └── package.mjs              # Production packaging & asset archiver
├── src/
│   ├── client/                  # FiveM Client runtime code
│   │   ├── client.ts            # Resource client entrypoint
│   │   ├── nui.ts               # NUI callback and event helpers
│   │   └── controllers/
│   ├── server/                  # FiveM Server runtime code
│   │   ├── server.ts            # Resource server entrypoint
│   │   └── controllers/
│   └── shared/                  # Shared typings, locale helpers, and constants
│       ├── config.ts
│       ├── locale.ts
│       └── types.ts
├── web/                         # Vue 3 NUI application
│   ├── src/
│   │   ├── App.vue              # Root component & NUI message router
│   │   ├── components/          # Reusable components & local dev simulation bar
│   │   ├── plugins/i18n.ts      # Reactive frontend localization plugin
│   │   ├── stores/appStore.ts   # Pinia state management
│   │   └── utils/fetchNui.ts    # NUI fetch helper with browser mock support
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── fxmanifest.lua               # FXServer resource manifest
├── package.json                 # Project dependencies and operational scripts
└── tsconfig.json                # Base TypeScript compiler settings

```

---

## Prerequisites

- **Node.js**: v.0.0 or higher
- **Package Manager**: npm (v9+) or pnpm / yarn

---

## Getting Started & Setup

Create a new repository from this template via the GitHub UI (**"Use this template"** button) or using the GitHub CLI, then install the dependencies for both the build pipeline and the NUI frontend.

### 1. Initialize from Template

Using the GitHub CLI:

```bash
gh repo create <your-resource-name> --template it_scripts/it_tsTemplate
cd <your-resource-name>
```

Or manually clone your newly created repository:

```bash
git clone https://github.com/it-scripts/it_tsTemplate.git
cd <it_tsTemplate>
```

### 2. Configure Resource Name

Update the `name` field in root `package.json` to match your intended FiveM resource name. The build and packaging scripts use this identifier for exports and bundles.

### 3. Install Dependencies

```bash
# Install root tooling & script dependencies
npm install

# Install Vue 3 NUI frontend dependencies
npm --prefix web install
```

---

## Development Workflow

### 1. Standalone UI Development (Browser)

To build and iterate on the NUI without launching FiveM or connecting to a server:

```bash
npm run dev:web
```

Navigate to `http://localhost:3000`. The integrated simulation bar allows you to trigger mock NUI events, simulate opening/closing UI layers, and switch active locale files.

### 2. Client & Server Script Watching

Recompiles `src/client` and `src/server` on every file change:

```bash
npm run watch:scripts
```

### 3. Concurrent Development Mode

Runs both the web dev server and script watchers simultaneously:

```bash
npm run dev
```

---

## Building & Deployment

### Quick Build

Compile all source code into production assets:

```bash
npm run build
```

This compiles:

- Vue frontend to `dist/web/`
- Client bundle to `dist/client.js`
- Server bundle to `dist/server.js`

### Release Packaging

To prepare a fully self-contained resource for production deployment:

```bash
npm run package
```

The script performs the following actions:

1. Compiles frontend and backend assets with production optimizations.
2. Identifies the target resource name from `package.json` (`name` field).
3. Copies all necessary runtime files (`fxmanifest.lua`, `config.json`, `dist/`, `locales/`) into `release/<resource_name>/`.
4. Creates a compressed deployment archive: `release/<resource_name>.zip`.

#### Installing on FXServer:

1. Copy the folder `release/<resource_name>` into your server's `resources/` directory.
2. Add `ensure <resource_name>` to your `server.cfg`.

---

## Localization (i18n)

### Adding a New Language

1. Add a new locale file in `locales/<lang_code>.json` (e.g., `locales/fr.json`):

```json
{
  "general": {
    "welcome": "Bienvenue",
    "action_executed": "Action exécutée: %{action}"
  }
}
```

2. Ensure identical key structures matching `locales/en.json`.

### Consuming Translations in Code

```typescript
import { t } from "./shared/locale";

// Static string lookup
const welcomeMessage = t("general.welcome");

// Variable interpolation
const actionMessage = t("general.action_executed", { action: "Repair" });
```

---

## Default Controls & Commands

| Trigger     | Default Input | Context / Behavior                                                               |
| ----------- | ------------- | -------------------------------------------------------------------------------- |
| **Command** | `/template`   | Toggles the default template NUI interface.                                      |
| **Keybind** | `F5`          | Mapped via FiveM Key Mapping (`registerKeyMapping`). Rebindable in GTA Settings. |

---

## Version Management

The repository includes a SemVer synchronization script that updates the `version` field across `package.json`, `web/package.json`, and `fxmanifest.lua` simultaneously:

```bash
# Increment patch version (e.g., 1.0.0 -> 1.0.1)
npm run bump:patch

# Increment minor version (e.g., 1.0.0 -> 1.1.0)
npm run bump:minor

# Increment major version (e.g., 1.0.0 -> 2.0.0)
npm run bump:major

# Set an explicit version
npm run bump 1.2.3
```

---

## Releases & Automated Changelog

Releases are triggered automatically via GitHub Actions whenever a Git tag matching `v*.*.*` is pushed.

### Commit Conventions

Release notes are parsed by `scripts/changelog.mjs` using the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<optional scope>): <description>
```

| Type       | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| `feat`     | New user-facing features or capabilities                    |
| `fix`      | Bug fixes and patches                                       |
| `perf`     | Code changes that improve performance                       |
| `refactor` | Structural changes that neither fix a bug nor add a feature |
| `docs`     | Documentation updates                                       |
| `style`    | Formatting, missing semi-colons, whitespace                 |
| `test`     | Adding or correcting unit and integration tests             |
| `chore`    | Build tasks, tool configs, or auxiliary changes             |
| `ci`       | CI/CD pipeline and deployment adjustments                   |

### Publishing a New Release

1. Bump the resource version:

```bash
npm run bump:minor # or bump:patch / bump:major
```

2. Commit the updated version files:

```bash
git add package.json web/package.json fxmanifest.lua
git commit -m "chore(release): bump version to 1.1.0"
```

3. Tag the commit and push:

```bash
git tag v1.1.0
git push origin main --tags
```

GitHub Actions will compile the production bundle, generate categorized release notes from git history, and publish the `.zip` archive to the repository's Releases page.

---

## License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).

---

<br>
<table>
  <tr>
    <td><h4 align="center">Legal Notices</h4></td>
  </tr>
  <tr>
    <td>
      it_tsTemplate (it-scripts)<br><br>
      Copyright (c) 2026 <a href="https://github.com/it-scripts">it-scripts</a><br><br>
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:<br><br>
      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.<br><br>
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
    </td>
  </tr>
</table>
