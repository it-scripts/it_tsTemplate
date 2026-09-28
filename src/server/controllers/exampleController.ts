import {
  IApiResponse,
  ICustomActionPayload,
  IServerStats,
} from "../../shared/types";
import { Locales, t } from "../../shared/locale";
import { Config } from "../../shared/config";
import { getResourceEvent, getResourceName } from "../../shared/resource";

export class ServerExampleController {
  private startTime: number = Date.now();

  constructor() {
    this.registerEvents();
    if (Config.debug) {
      console.log(
        `[${getResourceName()}] ServerExampleController initialized.`,
      );
    }
  }

  private registerEvents(): void {
    // Event: Client fragt Server-Statistiken ab
    onNet(getResourceEvent("server:fetchServerData"), () => {
      const src = source;
      const stats = this.getServerStats();

      emitNet(getResourceEvent("client:receiveServerData"), src, {
        success: true,
        data: stats,
      } as IApiResponse<IServerStats>);
    });

    // Event: Client löst eine benutzerdefinierte Aktion aus
    onNet(
      getResourceEvent("server:triggerCustomAction"),
      (payload: ICustomActionPayload) => {
        const src = source;
        const playerName = GetPlayerName(src.toString()) || `Player_${src}`;

        console.log(
          `[${getResourceName()}] Aktion von ${playerName} (${src}) empfangen: "${payload.message}"`,
        );

        // Antwort zurück an Client senden
        const responseText = t("general.action_executed", {
          action: payload.message,
        });
        emitNet(getResourceEvent("client:actionResponse"), src, {
          success: true,
          data: {
            receivedMessage: payload.message,
            timestamp: new Date().toISOString(),
            responseMsg: responseText,
          },
        } as IApiResponse);
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
