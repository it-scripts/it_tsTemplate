export interface IConfig {
  debug: boolean;
  defaultLocale: string;
  ui: {
    command: string;
    keybind: string;
    description: string;
  };
}

export interface IPlayerData {
  serverId: number;
  name: string;
  coords: {
    x: number;
    y: number;
    z: number;
    heading: number;
  };
}

export interface IServerStats {
  serverTime: string;
  onlinePlayers: number;
  maxPlayers: number;
  uptimeSeconds: number;
}

export interface INuiInitData {
  visible: boolean;
  locale: string;
  translations: Record<string, any>;
  locales?: Record<string, Record<string, any>>;
  player: IPlayerData;
  server: IServerStats;
}

export interface INuiEventMessage<T = any> {
  action: string;
  data: T;
}

export interface ICustomActionPayload {
  message: string;
  category?: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
