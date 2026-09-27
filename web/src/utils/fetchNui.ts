import { getResourceName, isEnvBrowser } from "./misc";

/**
 * Wrapper für NUI Callbacks an den FiveM Client mit Mock-Unterstützung im Browser
 */
export async function fetchNui<TRequest = any, TResponse = any>(
  eventName: string,
  data?: TRequest,
  mockResponse?: TResponse,
): Promise<TResponse> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data || {}),
  };

  if (isEnvBrowser() && mockResponse !== undefined) {
    console.log(
      `[Dev Browser Mock] fetchNui('${eventName}'):`,
      data,
      "-> Response:",
      mockResponse,
    );
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockResponse), 150),
    );
  }

  const resourceName = getResourceName();

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);
    return await resp.json();
  } catch (error) {
    if (isEnvBrowser()) {
      console.warn(
        `[Dev Mock] Fetch fehlgeschlagen (Browser Mode) für '${eventName}'. Gebe Standardobjekt zurück.`,
      );
      return { success: true } as unknown as TResponse;
    }
    console.error(`[fetchNui] Fehler beim Aufruf von '${eventName}':`, error);
    throw error;
  }
}
