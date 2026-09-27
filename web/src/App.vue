<template>
    <div class="w-screen h-screen overflow-hidden flex items-center justify-center p-4">
        <!-- Dev Browser Bar (nur im lokalen Browser sichtbar) -->
        <DevSimulator />

        <!-- Toast Benachrichtigungen -->
        <ToastContainer />

        <!-- Main NUI Container mit Transitions -->
        <Transition enter-active-class="transform transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transform transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 translate-y-4">
            <div v-if="store.isVisible"
                class="w-full max-w-3xl bg-slate-950/90 border border-slate-800/90 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div
                    class="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            <Terminal class="w-5 h-5" />
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="font-bold text-slate-100 text-lg tracking-tight">{{ t('ui.title') }}</h1>
                                <span
                                    class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                                    {{ t('ui.badge') }}
                                </span>
                            </div>
                            <p class="text-xs text-slate-400">{{ t('ui.subtitle') }}</p>
                        </div>
                    </div>

                    <!-- Close Button (X) -->
                    <button @click="store.closeUI"
                        class="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Navigation Tabs -->
                <div class="px-6 pt-3 pb-2 border-b border-slate-800/60 bg-slate-950/50 flex gap-2 overflow-x-auto">
                    <button v-for="tab in tabs" :key="tab.id" @click="store.activeTab = tab.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        :class="store.activeTab === tab.id ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'">
                        <component :is="tab.icon" class="w-4 h-4" />
                        <span>{{ t(tab.labelKey) }}</span>
                    </button>
                </div>

                <!-- Content Area -->
                <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <DashboardTab v-if="store.activeTab === 'dashboard'" />
                    <ActionsTab v-else-if="store.activeTab === 'actions'" />
                    <SettingsTab v-else-if="store.activeTab === 'settings'" />
                    <InfoTab v-else-if="store.activeTab === 'info'" />
                </div>

                <!-- Footer -->
                <div
                    class="px-6 py-3.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>FiveM NUI Ready</span>
                    </div>

                    <div class="flex items-center gap-3">
                        <span class="text-slate-500 font-mono text-[11px]">ESC zum Schließen</span>
                        <button @click="store.closeUI"
                            class="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors">
                            {{ t('ui.close') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from './stores/appStore';
import { useI18n } from './plugins/i18n';
import { useNuiEvent } from './utils/useNuiEvent';
import DevSimulator from './components/DevSimulator.vue';
import ToastContainer from './components/ToastContainer.vue';
import DashboardTab from './components/tabs/DashboardTab.vue';
import ActionsTab from './components/tabs/ActionsTab.vue';
import SettingsTab from './components/tabs/SettingsTab.vue';
import InfoTab from './components/tabs/InfoTab.vue';
import { Terminal, LayoutDashboard, Zap, Settings, BookOpen, X } from 'lucide-vue-next';

const store = useAppStore();
const { t } = useI18n();

const tabs = [
    { id: 'dashboard' as const, labelKey: 'ui.tabs.dashboard', icon: LayoutDashboard },
    { id: 'actions' as const, labelKey: 'ui.tabs.actions', icon: Zap },
    { id: 'settings' as const, labelKey: 'ui.tabs.settings', icon: Settings },
    { id: 'info' as const, labelKey: 'ui.tabs.info', icon: BookOpen }
];

// NUI Messages von FiveM empfangen
useNuiEvent('initUI', (data: any) => {
    store.initUI(data);
});

useNuiEvent('setVisible', (visible: boolean) => {
    store.setVisibility(visible);
});

useNuiEvent('updateServerStats', (stats: any) => {
    store.server = stats;
});

// ESC Taste zum Schließen abfangen
const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && store.isVisible) {
        store.closeUI();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>
