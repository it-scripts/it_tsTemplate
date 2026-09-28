/**
 * Gibt true zurück, wenn die Anwendung im normalen Browser (z. B. während Vite dev) läuft
 */
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

/**
 * Gibt den aktuellen FiveM Ressourcennamen zurück.
 * In-Game nutzt FiveM GetParentResourceName().
 * Im Browser (Vite dev) fällt es auf 'nui-dev' zurück.
 */
export const getResourceName = (): string => {
  return (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : "nui-dev";
};

/**
 * Helper für No-Op Funktionen
 */
export const noop = () => {};
