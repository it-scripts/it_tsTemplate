import { getResourceEvent, getResourceName } from "../shared/resource";
import { Config } from "../shared/config";

interface IPendingCallback {
  resolve: (value: any) => void;
  timer: ReturnType<typeof setTimeout>;
}

const pendingCallbacks = new Map<string, IPendingCallback>();
let requestIdCounter = 0;

// Registriere das NetEvent für Callback-Antworten vom Server einmalig beim Modul-Import
onNet(
  getResourceEvent("client:serverCallbackResponse"),
  (requestId: string, response: any) => {
    const pending = pendingCallbacks.get(requestId);
    if (pending) {
      clearTimeout(pending.timer);
      pendingCallbacks.delete(requestId);
      pending.resolve(response);
    }
  },
);

/**
 * Sendet eine Callback-Anfrage an den Server und wartet auf die Antwort.
 * Verwendet eindeutige Request-IDs und verhindert Race-Conditions durch sauberes Timeout-Handling.
 */
export function triggerServerCallback<TResponse = any, TRequest = any>(
  eventName: string,
  data?: TRequest,
  timeoutMs: number = 5000,
): Promise<TResponse> {
  return new Promise((resolve) => {
    requestIdCounter = (requestIdCounter + 1) % Number.MAX_SAFE_INTEGER;
    const requestId = `${Date.now()}_${requestIdCounter}_${Math.random().toString(36).substring(2, 7)}`;

    const timer = setTimeout(() => {
      if (pendingCallbacks.has(requestId)) {
        pendingCallbacks.delete(requestId);
        if (Config.debug) {
          console.warn(
            `[${getResourceName()}] Server Callback Timeout für '${eventName}' (ID: ${requestId})`,
          );
        }
        resolve({
          success: false,
          error: "Server timeout",
        } as TResponse);
      }
    }, timeoutMs);

    pendingCallbacks.set(requestId, { resolve, timer });

    emitNet(
      getResourceEvent("server:triggerCallback"),
      eventName,
      requestId,
      data,
    );
  });
}
