import { getResourceEvent, getResourceName } from "../shared/resource";
import { Config } from "../shared/config";

type ServerCallbackHandler<TRequest = any, TResponse = any> = (
  source: number,
  data: TRequest,
) => TResponse | Promise<TResponse>;

const callbackHandlers = new Map<string, ServerCallbackHandler>();
let isInitialized = false;

/**
 * Registriert einen Server-Callback Handler für Client-Anfragen.
 */
export function registerServerCallback<TRequest = any, TResponse = any>(
  eventName: string,
  handler: ServerCallbackHandler<TRequest, TResponse>,
): void {
  callbackHandlers.set(eventName, handler);
  ensureServerCallbacksInitialized();
}

function ensureServerCallbacksInitialized(): void {
  if (isInitialized) return;
  isInitialized = true;

  onNet(
    getResourceEvent("server:triggerCallback"),
    async (eventName: string, requestId: string, data: any) => {
      const src = source;
      const handler = callbackHandlers.get(eventName);

      if (!handler) {
        if (Config.debug) {
          console.error(
            `[${getResourceName()}] Kein Server-Callback Handler für '${eventName}' registriert!`,
          );
        }
        emitNet(
          getResourceEvent("client:serverCallbackResponse"),
          src,
          requestId,
          {
            success: false,
            error: `Unbekannter Server Callback: ${eventName}`,
          },
        );
        return;
      }

      try {
        const result = await handler(src, data);
        emitNet(
          getResourceEvent("client:serverCallbackResponse"),
          src,
          requestId,
          result,
        );
      } catch (error) {
        console.error(
          `[${getResourceName()}] Fehler bei Server Callback '${eventName}':`,
          error,
        );
        emitNet(
          getResourceEvent("client:serverCallbackResponse"),
          src,
          requestId,
          {
            success: false,
            error: String(error),
          },
        );
      }
    },
  );
}
