import { Config } from "./config";

// Eingebetteter Fallback falls LoadResourceFile nicht verfügbar ist (z.B. Mock-Umgebung)
import fallbackDe from "../../locales/de.json";
import fallbackEn from "../../locales/en.json";

class LocaleManager {
  private currentLocale: string = Config.defaultLocale || "de";
  private locales: Record<string, Record<string, any>> = {
    de: fallbackDe,
    en: fallbackEn,
  };

  constructor() {
    this.init();
  }

  public init(): void {
    // Falls in FiveM Runtime: Lade JSON-Dateien dynamisch aus dem locales-Ordner
    if (
      typeof GetCurrentResourceName === "function" &&
      typeof LoadResourceFile === "function"
    ) {
      const resourceName = GetCurrentResourceName();
      const foundLangs = new Set<string>();

      // Scanne Metadaten nach allen Dateien im locales/-Ordner
      if (
        typeof GetNumResourceMetadata === "function" &&
        typeof GetResourceMetadata === "function"
      ) {
        for (const metaKey of ["file", "files"]) {
          const numFiles = GetNumResourceMetadata(resourceName, metaKey);
          for (let i = 0; i < numFiles; i++) {
            const filePath = GetResourceMetadata(resourceName, metaKey, i);
            if (filePath) {
              const match = filePath.match(
                /^locales[/\\]([a-zA-Z0-9_-]+)\.json$/i,
              );
              if (match && match[1]) {
                foundLangs.add(match[1]);
              }
            }
          }
        }
      }

      // Fallback: Falls keine Metadaten gefunden wurden, verwende die vordefinierten Sprachen
      if (foundLangs.size === 0) {
        Object.keys(this.locales).forEach((lang) => foundLangs.add(lang));
      }

      for (const lang of foundLangs) {
        try {
          const fileContent = LoadResourceFile(
            resourceName,
            `locales/${lang}.json`,
          );
          if (fileContent) {
            this.locales[lang] = JSON.parse(fileContent);
          }
        } catch (err) {
          if (Config.debug) {
            console.warn(
              `[LocaleManager] Konnte locales/${lang}.json nicht laden:`,
              err,
            );
          }
        }
      }
    }
  }

  public setLocale(locale: string): void {
    if (this.locales[locale]) {
      this.currentLocale = locale;
    } else {
      console.warn(
        `[LocaleManager] Sprache '${locale}' nicht gefunden, behalte '${this.currentLocale}'`,
      );
    }
  }

  public getLocale(): string {
    return this.currentLocale;
  }

  public getAvailableLocales(): string[] {
    return Object.keys(this.locales);
  }

  public getAllLocalesData(): Record<string, Record<string, any>> {
    return this.locales;
  }

  public addLocale(
    localeName: string,
    translations: Record<string, any>,
  ): void {
    this.locales[localeName] = translations;
  }

  public getTranslations(locale?: string): Record<string, any> {
    const target = locale || this.currentLocale;
    return this.locales[target] || this.locales["en"] || {};
  }

  /**
   * Übersetzt einen Key (z. B. 'general.welcome' oder 'notifications.action_success_body')
   * Unterstützt Interpolation mit Objekten ({ param: 'wert' }) oder String-Formatierung (%{param} oder %s)
   */
  public t(
    key: string,
    params?: Record<string, string | number> | (string | number)[],
  ): string {
    let text = this.getNestedTranslation(this.currentLocale, key);

    // Fallback auf Englisch falls Key fehlt
    if (!text && this.currentLocale !== "en") {
      text = this.getNestedTranslation("en", key);
    }

    if (!text) {
      return `[MISSING: ${key}]`;
    }

    let formattedText = text;

    if (params) {
      if (Array.isArray(params)) {
        for (const param of params) {
          formattedText = formattedText.replace(/%s/, String(param));
        }
      } else {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          formattedText = formattedText.replace(
            new RegExp(`%\\{${paramKey}\\}|\\{${paramKey}\\}`, "g"),
            String(paramValue),
          );
        }
      }
    }

    return formattedText;
  }

  private getNestedTranslation(
    locale: string,
    path: string,
  ): string | undefined {
    const dict = this.locales[locale];
    if (!dict) return undefined;

    const parts = path.split(".");
    let current: any = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return typeof current === "string" ? current : undefined;
  }
}

export const Locales = new LocaleManager();
export const t = (
  key: string,
  params?: Record<string, string | number> | (string | number)[],
) => Locales.t(key, params);
