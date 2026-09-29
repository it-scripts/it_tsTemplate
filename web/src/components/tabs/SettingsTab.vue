<template>
    <div class="space-y-6 animate-fade-in">
        <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div class="mb-5">
                <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Settings class="w-5 h-5 text-brand-400" />
                    {{ t('ui.settings.title') }}
                </h3>
            </div>

            <div class="space-y-5">
                <!-- Language Switcher -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                    <div>
                        <h4 class="text-sm font-medium text-slate-200">
                            {{ t('ui.settings.language_label') }}
                        </h4>
                        <p class="text-xs text-slate-400 mt-0.5">
                            {{ t('ui.settings.language_desc') }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 flex-wrap">
                        <button v-for="lang in i18n.availableLocales.value" :key="lang"
                            @click="store.switchLanguage(lang)"
                            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                            :class="i18n.currentLocale.value === lang ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'text-slate-400 hover:text-slate-200'">
                            <span>{{ getLangFlag(lang) }}</span>
                            <span>{{ getLangName(lang) }}</span>
                        </button>
                    </div>
                </div>

                <!-- Sound Effects Toggle -->
                <div class="flex items-center justify-between pb-5 border-b border-slate-800">
                    <div>
                        <h4 class="text-sm font-medium text-slate-200">
                            {{ t('ui.settings.sounds_label') }}
                        </h4>
                        <p class="text-xs text-slate-400 mt-0.5">
                            {{ t('ui.settings.sounds_desc') }}
                        </p>
                    </div>

                    <button @click="soundEnabled = !soundEnabled"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        :class="soundEnabled ? 'bg-brand-600' : 'bg-slate-800'">
                        <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            :class="soundEnabled ? 'translate-x-6' : 'translate-x-1'" />
                    </button>
                </div>

                <!-- Debug Mode Toggle -->
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-medium text-slate-200">
                            {{ t('ui.settings.debug_label') }}
                        </h4>
                        <p class="text-xs text-slate-400 mt-0.5">
                            {{ t('ui.settings.debug_desc') }}
                        </p>
                    </div>

                    <button @click="debugEnabled = !debugEnabled"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        :class="debugEnabled ? 'bg-brand-600' : 'bg-slate-800'">
                        <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            :class="debugEnabled ? 'translate-x-6' : 'translate-x-1'" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../../stores/appStore';
import { useI18n } from '../../plugins/i18n';
import { Settings } from 'lucide-vue-next';

const store = useAppStore();
const i18n = useI18n();
const { t } = i18n;

const soundEnabled = ref(true);
const debugEnabled = ref(false);

const getLangFlag = (lang: string) => {
    const flags: Record<string, string> = {
        de: '🇩🇪',
        en: '🇬🇧',
        fr: '🇫🇷',
        es: '🇪🇸',
        it: '🇮🇹',
        nl: '🇳🇱',
        pl: '🇵🇱',
        pt: '🇵🇹',
        tr: '🇹🇷',
    };
    return flags[lang.toLowerCase()] || '🌐';
};

const getLangName = (lang: string) => {
    const names: Record<string, string> = {
        de: 'Deutsch',
        en: 'English',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
        nl: 'Nederlands',
        pl: 'Polski',
        pt: 'Português',
        tr: 'Türkçe',
    };
    return names[lang.toLowerCase()] || lang.toUpperCase();
};
</script>
