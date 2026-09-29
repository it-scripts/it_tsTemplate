import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchNui } from "../utils/fetchNui";
import { useI18n } from "../plugins/i18n";

export interface IToast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
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

export const useAppStore = defineStore("app", () => {
  const isVisible = ref<boolean>(false);
  const activeTab = ref<"dashboard" | "actions" | "settings" | "info">(
    "dashboard",
  );

  const player = ref<IPlayerData>({
    serverId: 1,
    name: "Player One",
    coords: { x: 215.4, y: -810.2, z: 30.5, heading: 180.0 },
  });

  const server = ref<IServerStats>({
    serverTime: "12:00:00",
    onlinePlayers: 1,
    maxPlayers: 64,
    uptimeSeconds: 3600,
  });

  const isPinging = ref<boolean>(false);
  const isSendingAction = ref<boolean>(false);
  const lastActionResponse = ref<any>(null);

  const toasts = ref<IToast[]>([]);
  const { t, setLocale, addTranslations } = useI18n();

  const addToast = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.value.push({ id, type, title, message });

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const setVisibility = (visible: boolean) => {
    isVisible.value = visible;
  };

  const closeUI = async () => {
    isVisible.value = false;
    await fetchNui("hideUI", {}, { success: true });
  };

  const initUI = (data: {
    visible?: boolean;
    locale?: string;
    translations?: Record<string, any>;
    locales?: Record<string, Record<string, any>>;
    player?: IPlayerData;
    server?: IServerStats;
  }) => {
    if (data.visible !== undefined) isVisible.value = data.visible;
    if (data.locales) {
      Object.entries(data.locales).forEach(([lang, dict]) => {
        addTranslations(lang, dict);
      });
    } else if (data.locale && data.translations) {
      addTranslations(data.locale, data.translations);
    }
    if (data.locale) setLocale(data.locale);
    if (data.player) player.value = data.player;
    if (data.server) server.value = data.server;
  };

  const pingServer = async () => {
    isPinging.value = true;
    try {
      const resp = await fetchNui<
        any,
        { success: boolean; data: IServerStats }
      >(
        "getServerData",
        {},
        {
          success: true,
          data: {
            serverTime: new Date().toLocaleTimeString("de-DE"),
            onlinePlayers: Math.floor(Math.random() * 20) + 1,
            maxPlayers: 64,
            uptimeSeconds: server.value.uptimeSeconds + 60,
          },
        },
      );

      if (resp.success && resp.data) {
        server.value = resp.data;
        addToast(
          "success",
          t("notifications.ping_success_title"),
          t("notifications.ping_success_body"),
        );
      }
    } catch (error) {
      addToast("error", t("notifications.error_title"), String(error));
    } finally {
      isPinging.value = false;
    }
  };

  const sendCustomAction = async (
    message: string,
    category: string = "general",
  ) => {
    isSendingAction.value = true;
    try {
      const resp = await fetchNui<
        any,
        { success: boolean; data?: any; error?: string }
      >(
        "triggerAction",
        { message, category },
        {
          success: true,
          data: {
            receivedMessage: message,
            timestamp: new Date().toISOString(),
            responseMsg: `Browser Mock Echo: "${message}" (${category})`,
          },
        },
      );

      if (resp.success) {
        lastActionResponse.value = resp.data;
        addToast(
          "success",
          t("notifications.action_success_title"),
          t("notifications.action_success_body", { message }),
        );
      } else {
        addToast(
          "error",
          t("notifications.error_title"),
          resp.error || "Server error",
        );
      }
    } catch (error) {
      addToast("error", t("notifications.error_title"), String(error));
    } finally {
      isSendingAction.value = false;
    }
  };

  const switchLanguage = async (locale: string) => {
    setLocale(locale);
    try {
      await fetchNui("setLocale", { locale }, { success: true });
      addToast(
        "info",
        t("notifications.locale_changed_title"),
        t("notifications.locale_changed_body"),
      );
    } catch (error) {
      console.error("Konnte Sprache nicht mit Server abgleichen:", error);
    }
  };

  return {
    isVisible,
    activeTab,
    player,
    server,
    isPinging,
    isSendingAction,
    lastActionResponse,
    toasts,
    addToast,
    removeToast,
    setVisibility,
    closeUI,
    initUI,
    pingServer,
    sendCustomAction,
    switchLanguage,
  };
});
