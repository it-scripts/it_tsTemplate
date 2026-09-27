<template>
    <div class="space-y-6 animate-fade-in">
        <!-- Top Summary Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Player Name Card -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div class="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                    <User class="w-6 h-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {{ t('ui.player_card.name') }}
                    </span>
                    <p class="text-lg font-bold text-slate-100 truncate max-w-[150px]">
                        {{ store.player.name }}
                    </p>
                </div>
            </div>

            <!-- Server ID Card -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <Hash class="w-6 h-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {{ t('ui.player_card.server_id') }}
                    </span>
                    <p class="text-lg font-bold text-slate-100">
                        #{{ store.player.serverId }}
                    </p>
                </div>
            </div>

            <!-- Online Players Card -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div class="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                    <Users class="w-6 h-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {{ t('ui.server_card.players') }}
                    </span>
                    <p class="text-lg font-bold text-slate-100">
                        {{ store.server.onlinePlayers }} <span class="text-xs font-normal text-slate-400">/ {{
                            store.server.maxPlayers }}</span>
                    </p>
                </div>
            </div>
        </div>

        <!-- Main 2-Column Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Player Coordinates & Position -->
            <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-slate-100 flex items-center gap-2">
                            <Compass class="w-5 h-5 text-brand-400" />
                            {{ t('ui.player_card.title') }}
                        </h3>
                        <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                            Heading: {{ store.player.coords.heading }}°
                        </span>
                    </div>

                    <div class="grid grid-cols-3 gap-3 my-4">
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                            <span class="text-xs text-slate-400 block font-medium">X</span>
                            <span class="text-base font-mono font-semibold text-slate-200">
                                {{ store.player.coords.x }}
                            </span>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                            <span class="text-xs text-slate-400 block font-medium">Y</span>
                            <span class="text-base font-mono font-semibold text-slate-200">
                                {{ store.player.coords.y }}
                            </span>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                            <span class="text-xs text-slate-400 block font-medium">Z</span>
                            <span class="text-base font-mono font-semibold text-slate-200">
                                {{ store.player.coords.z }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <span>Client Controller: <strong class="text-emerald-400">Aktiv</strong></span>
                    <span class="text-slate-500 font-mono">FiveM Native V8</span>
                </div>
            </div>

            <!-- Server Connection & Live Status -->
            <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-slate-100 flex items-center gap-2">
                            <Server class="w-5 h-5 text-emerald-400" />
                            {{ t('ui.server_card.title') }}
                        </h3>
                        <div
                            class="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {{ t('general.server_status_online') }}
                        </div>
                    </div>

                    <div class="space-y-3 mb-4">
                        <div class="flex justify-between items-center text-sm py-1 border-b border-slate-800/60">
                            <span class="text-slate-400">{{ t('ui.server_card.server_time') }}</span>
                            <span class="font-mono font-medium text-slate-200">{{ store.server.serverTime }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm py-1 border-b border-slate-800/60">
                            <span class="text-slate-400">{{ t('ui.server_card.uptime') }}</span>
                            <span class="font-mono font-medium text-slate-200">{{
                                formatUptime(store.server.uptimeSeconds) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Ping / Refresh Button -->
                <button @click="store.pingServer" :disabled="store.isPinging"
                    class="w-full mt-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-[0.98] disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/20">
                    <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': store.isPinging }" />
                    <span>{{ store.isPinging ? t('ui.server_card.pinging') : t('ui.server_card.ping_button') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../stores/appStore';
import { useI18n } from '../../plugins/i18n';
import { User, Hash, Users, Compass, Server, RefreshCw } from 'lucide-vue-next';

const store = useAppStore();
const { t } = useI18n();

const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
};
</script>
