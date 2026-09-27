import { IConfig } from "./types";
import defaultConfig from "../../config.json";

class ConfigManager {
  private config: IConfig = { ...defaultConfig };

  constructor() {
    this.loadConfig();
  }

  public loadConfig(): void {
    if (
      typeof GetCurrentResourceName === "function" &&
      typeof LoadResourceFile === "function"
    ) {
      try {
        const resourceName = GetCurrentResourceName();
        const rawContent = LoadResourceFile(resourceName, "config.json");
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          this.config = {
            ...this.config,
            ...parsed,
            ui: {
              ...this.config.ui,
              ...(parsed.ui || {}),
            },
          };
        }
      } catch (err) {
        console.warn(
          "[it_tsTemplate] Konnte externe config.json nicht laden, nutze Standard-Werte:",
          err,
        );
      }
    }
  }

  public get(): IConfig {
    return this.config;
  }
}

export const ConfigLoader = new ConfigManager();
export const Config: IConfig = ConfigLoader.get();
