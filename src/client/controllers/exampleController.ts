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

    // Set NUI Focus - on or off
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
    // =========================================================================
    // EXAMPLE WITH NUI: NUI sends a request -> the client triggers a server callback -> response to NUI
    // =========================================================================

    // close NUI
    registerNuiCallback("hideUI", (_data, cb) => {
      this.setUiVisibility(false);
      cb({ success: true });
    });

    // Request Server Data (NUI -> Client -> Server Callback -> Client -> NUI)
    registerNuiCallback("getServerData", async (_data, cb) => {
      const response =
        await triggerServerCallback<IApiResponse<IServerStats>>(
          "fetchServerData",
        );

      // Push the event directly to NUI
      if (response.success && response.data) {
        sendNuiMessage("updateServerStats", response.data);
      }

      cb(response);
    });

    // Send a custom action to the server (NUI -> Client -> Server Callback -> Client -> NUI)
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

    // Change language
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

  /**
   * =========================================================================
   * EXAMPLE WITHOUT NUI: Directly triggering a server callback from the client code
   * (e.g., called via a command, an in-game event, a keybinding, or the game loop/tick)
   * =========================================================================
   */
  public async exampleDirectServerCallback(): Promise<void> {
    if (Config.debug) {
      console.log(
        `[${getResourceName()}] Sende direkten Server-Callback (ohne NUI)...`,
      );
    }

    const response =
      await triggerServerCallback<IApiResponse<IServerStats>>(
        "fetchServerData",
      );

    if (response.success && response.data) {
      console.log(
        `[${getResourceName()}] Direkter Callback erfolgreich! Serverzeit: ${response.data.serverTime}, Spieler: ${response.data.onlinePlayers}/${response.data.maxPlayers}`,
      );
    } else {
      console.error(
        `[${getResourceName()}] Direkter Callback fehlgeschlagen:`,
        response.error,
      );
    }
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
