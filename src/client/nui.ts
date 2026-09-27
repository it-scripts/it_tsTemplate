import { INuiEventMessage } from "../shared/types";
import { Config } from "../shared/config";

/**
 * Sendet eine typisierte NUI Message an das Web Interface
 */
export function sendNuiMessage<T = any>(action: string, data: T): void {
  const payload: INuiEventMessage<T> = {
    action,
    data,
  };
  SendNuiMessage(JSON.stringify(payload));
}

/**
 * Registriert einen typisierten NUI Callback Handler
 */
export function registerNuiCallback<TRequest = any, TResponse = any>(
  event: string,
  handler: (
    data: TRequest,
    cb: (response: TResponse) => void,
  ) => void | Promise<void>,
): void {
  RegisterNuiCallbackType(event);
  on(
    `__cfx_nui:${event}`,
    async (data: TRequest, cb: (response: any) => void) => {
      if (Config.debug) {
        console.log(`[NUI Callback Recv] '${event}':`, JSON.stringify(data));
      }
      try {
        await handler(data, (response: TResponse) => {
          if (Config.debug) {
            console.log(
              `[NUI Callback Send] '${event}':`,
              JSON.stringify(response),
            );
          }
          cb(response);
        });
      } catch (error) {
        console.error(`[NUI Callback Error] '${event}':`, error);
        cb({ success: false, error: String(error) });
      }
    },
  );
}
