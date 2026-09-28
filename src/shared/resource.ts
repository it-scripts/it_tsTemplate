/**
 * Ermittelt den aktuellen FiveM-Ressourcennamen dynamisch.
 * Verwendet im FiveM-Kontext GetCurrentResourceName(), andernfalls 'script'.
 */
export const getResourceName = (): string => {
  if (typeof GetCurrentResourceName === "function") {
    return GetCurrentResourceName();
  }
  return "script";
};

/**
 * Erstellt einen dynamischen Event-Namen basierend auf dem aktuellen Ressourcennamen.
 * Beispiel: getResourceEvent("server:fetchServerData") -> "mein_script:server:fetchServerData"
 */
export const getResourceEvent = (eventName: string): string => {
  return `${getResourceName()}:${eventName}`;
};
