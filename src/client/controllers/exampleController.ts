import { registerNuiCallback, sendNuiMessage } from "../nui";
import { triggerServerCallback } from "../callbacks";
import {
  IApiResponse,
  ICustomActionPayload,
  INuiInitData,
  IPlayerData,
  IServerStats,
} from "../../shared/types";
import { Locales } from "../../shared/locale";
import { Config } from "../../shared/config";
import { getResourceName } from "../../shared/resource";

export class ClientExampleController {
  private isUiOpen: boolean = false;

  constructor() {
    this.registerNuiCallbacks();
    this.registerNetEvents();
  }

  public toggleUI(forceState?: boolean): void {
    const newState = forceState !== undefined ? forceState : !this.isUiOpen;
    this.setUiVisibility(newState);
  }

  public setUiVisibility(visible: boolean): void {
    this.isUiOpen = visible;

    // NUI Focus ein- oder ausschalten
    SetNuiFocus(visible, visible);

    if (visible) {
      const playerData = this.getLocalPlayerData();
      const initialPayload: INuiInitData = {
        visible: true,
        locale: Locales.getLocale(),
        translations: Locales.getTranslations(),
        locales: Locales.getAllLocalesData(),
        player: playerData,
        server: {
          serverTime: new Date().toLocaleTimeString("de-DE"),
          onlinePlayers: 1,
          maxPlayers: 48,
          uptimeSeconds: 0,
        },
      };

      sendNuiMessage("initUI", initialPayload);

      if (Config.debug) {
        console.log(
          `[${getResourceName()}] NUI geöffnet mit PlayerData:`,
          JSON.stringify(playerData),
        );
      }
    } else {
      sendNuiMessage("setVisible", false);
    }
  }

  private registerNuiCallbacks(): void {
    // UI Schließen
    registerNuiCallback("hideUI", (_data, cb) => {
      this.setUiVisibility(false);
      cb({ success: true });
    });

    // Server-Daten anfragen
    registerNuiCallback("getServerData", async (_data, cb) => {
      const response =
        await triggerServerCallback<IApiResponse<IServerStats>>(
          "fetchServerData",
        );

      // Event auch direkt an NUI pushen
      if (response.success && response.data) {
        sendNuiMessage("updateServerStats", response.data);
      }

      cb(response);
    });

    // Benutzerdefinierte Aktion an Server senden
    registerNuiCallback<ICustomActionPayload>(
      "triggerAction",
      async (payload, cb) => {
        const response = await triggerServerCallback<IApiResponse>(
          "triggerCustomAction",
          payload,
        );
        cb(response);
      },
    );

    // Sprache ändern
    registerNuiCallback<{ locale: string }>("setLocale", (data, cb) => {
      if (data && data.locale) {
        Locales.setLocale(data.locale);
        cb({
          success: true,
          data: {
            locale: data.locale,
            translations: Locales.getTranslations(data.locale),
          },
        });
      } else {
        cb({ success: false, error: "Keine Sprache angegeben" });
      }
    });
  }

  private registerNetEvents(): void {
    // Hier können clientseitige Net-Events registriert werden
  }

  private getLocalPlayerData(): IPlayerData {
    const ped = PlayerPedId();
    const [x, y, z] = GetEntityCoords(ped, true);
    const heading = GetEntityHeading(ped);
    const serverId = GetPlayerServerId(PlayerId());
    const name = GetPlayerName(PlayerId()) || "FiveM Player";

    return {
      serverId,
      name,
      coords: {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        z: Number(z.toFixed(2)),
        heading: Number(heading.toFixed(2)),
      },
    };
  }
}
