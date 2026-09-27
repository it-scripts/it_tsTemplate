import { ref, computed } from "vue";
import deDict from "../locales/de.json";
import enDict from "../locales/en.json";

const currentLocale = ref<string>("de");
const dictionaries = ref<Record<string, any>>({
  de: deDict,
  en: enDict,
});

export function useI18n() {
  const setLocale = (locale: string) => {
    if (dictionaries.value[locale]) {
      currentLocale.value = locale;
    }
  };

  const addTranslations = (locale: string, dict: Record<string, any>) => {
    dictionaries.value[locale] = {
      ...(dictionaries.value[locale] || {}),
      ...dict,
    };
  };

  const availableLocales = computed(() => Object.keys(dictionaries.value));

  const t = (
    key: string,
    params?: Record<string, string | number> | (string | number)[],
  ): string => {
    const dict =
      dictionaries.value[currentLocale.value] || dictionaries.value["en"] || {};
    const parts = key.split(".");
    let current: any = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        // Fallback to english
        const enFallback = dictionaries.value["en"];
        let enCurrent: any = enFallback;
        for (const p of parts) {
          if (enCurrent && typeof enCurrent === "object" && p in enCurrent) {
            enCurrent = enCurrent[p];
          } else {
            enCurrent = undefined;
            break;
          }
        }
        current = enCurrent;
        break;
      }
    }

    if (typeof current !== "string") {
      return `[${key}]`;
    }

    let text = current;
    if (params) {
      if (Array.isArray(params)) {
        params.forEach((param) => {
          text = text.replace(/%s/, String(param));
        });
      } else {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          text = text.replace(
            new RegExp(`%\\{${paramKey}\\}|\\{${paramKey}\\}`, "g"),
            String(paramValue),
          );
        });
      }
    }

    return text;
  };

  return {
    currentLocale,
    availableLocales,
    setLocale,
    addTranslations,
    t,
  };
}
