/**
 * Gibt true zurück, wenn die Anwendung im normalen Browser (z. B. während Vite dev) läuft
 */
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

/**
 * Gibt den aktuellen FiveM Ressourcennamen zurück
 */
export const getResourceName = (): string => {
  return (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : "it_tsTemplate";
};

/**
 * Helper für No-Op Funktionen
 */
export const noop = () => {};
