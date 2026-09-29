import {
  IApiResponse,
  ICustomActionPayload,
  IServerStats,
} from "../../shared/types";
import { registerServerCallback } from "../callbacks";
import { t } from "../../shared/locale";
import { Config } from "../../shared/config";
import { getResourceName } from "../../shared/resource";

export class ServerExampleController {
  private startTime: number = Date.now();

  constructor() {
    this.registerServerCallbacks();
    if (Config.debug) {
      console.log(
        `[${getResourceName()}] ServerExampleController initialized.`,
      );
    }
  }

  private registerServerCallbacks(): void {
    // Server-Callback: Server-Statistiken abfragen
    registerServerCallback<void, IApiResponse<IServerStats>>(
      "fetchServerData",
      () => {
        const stats = this.getServerStats();
        return {
          success: true,
          data: stats,
        };
      },
    );

    // Server-Callback: Benutzerdefinierte Aktion ausführen
    registerServerCallback<ICustomActionPayload, IApiResponse>(
      "triggerCustomAction",
      (src, payload) => {
        const playerName = GetPlayerName(src.toString()) || `Player_${src}`;

        if (Config.debug) {
          console.log(
            `[${getResourceName()}] Aktion von ${playerName} (${src}) empfangen: "${payload.message}"`,
          );
        }

        // Antwort zurück an Client senden
        const responseText = t("general.action_executed", {
          action: payload.message,
        });

        return {
          success: true,
          data: {
            receivedMessage: payload.message,
            timestamp: new Date().toISOString(),
            responseMsg: responseText,
          },
        };
      },
    );
  }

  public getServerStats(): IServerStats {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const now = new Date();
    const serverTime = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const onlinePlayers = GetNumPlayerIndices ? GetNumPlayerIndices() : 1;
    const maxPlayers = GetConvarInt("sv_maxclients", 48);

    return {
      serverTime,
      onlinePlayers,
      maxPlayers,
      uptimeSeconds,
    };
  }
}
