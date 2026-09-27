import { onMounted, onUnmounted } from "vue";

interface NuiMessage<T = any> {
  action: string;
  data: T;
}

/**
 * Vue Composable zum Lauschen auf NUI Events von FiveM (SendNuiMessage)
 */
export function useNuiEvent<T = any>(
  action: string,
  handler: (data: T) => void,
) {
  const eventListener = (event: MessageEvent<NuiMessage<T>>) => {
    const { action: eventAction, data } = event.data;
    if (eventAction === action) {
      handler(data);
    }
  };

  onMounted(() => {
    window.addEventListener("message", eventListener);
  });

  onUnmounted(() => {
    window.removeEventListener("message", eventListener);
  });
}
