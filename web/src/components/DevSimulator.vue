<template>
    <div v-if="isBrowser"
        class="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-brand-500/40 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5 font-semibold text-brand-400">
            <span class="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
            Dev Browser Simulator
        </div>

        <div class="h-4 w-px bg-slate-700"></div>

        <button @click="toggleVisibility" class="px-3 py-1 rounded-full font-medium transition-all"
            :class="store.isVisible ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'">
            {{ store.isVisible ? 'UI Schließen (ESC)' : 'UI Öffnen (F5)' }}
        </button>

        <button @click="simulateFiveMInit"
            class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full font-medium transition-colors">
            Simulate NUI Message
        </button>

        <div class="h-4 w-px bg-slate-700"></div>

        <div class="flex gap-1 flex-wrap">
            <button v-for="lang in i18n.availableLocales.value" :key="lang"
                @click="store.switchLanguage(lang)"
                class="px-2 py-0.5 rounded text-[11px] uppercase"
                :class="i18n.currentLocale.value === lang ? 'bg-brand-600 text-white font-bold' : 'bg-slate-800 text-slate-400'">
                {{ lang }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isEnvBrowser } from '../utils/misc';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../plugins/i18n';

const isBrowser = isEnvBrowser();
const store = useAppStore();
const i18n = useI18n();

const toggleVisibility = () => {
    store.setVisibility(!store.isVisible);
};

const simulateFiveMInit = () => {
    window.postMessage(
        {
            action: 'initUI',
            data: {
                visible: true,
                locale: 'de',
                player: {
                    serverId: 42,
                    name: 'FiveM_Developer',
                    coords: { x: -1037.2, y: -2738.1, z: 20.1, heading: 90.0 }
                },
                server: {
                    serverTime: new Date().toLocaleTimeString('de-DE'),
                    onlinePlayers: 32,
                    maxPlayers: 128,
                    uptimeSeconds: 7200
                }
            }
        },
        '*'
    );
};
</script>
