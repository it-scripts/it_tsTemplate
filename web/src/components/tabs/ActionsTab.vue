<template>
    <div class="space-y-6 animate-fade-in">
        <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div class="mb-5">
                <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Send class="w-5 h-5 text-brand-400" />
                    {{ t('ui.actions.title') }}
                </h3>
                <p class="text-xs text-slate-400 mt-1">
                    {{ t('ui.actions.desc') }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Message Input -->
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1.5">
                        {{ t('ui.actions.input_label') }}
                    </label>
                    <div class="relative">
                        <input v-model="customMessage" type="text" required
                            :placeholder="t('ui.actions.input_placeholder')"
                            class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
                    </div>
                </div>

                <!-- Category Selection -->
                <div class="grid grid-cols-3 gap-3">
                    <button type="button" v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id"
                        class="py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2"
                        :class="selectedCategory === cat.id ? 'bg-brand-600/20 border-brand-500 text-brand-300' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'">
                        <span>{{ cat.label }}</span>
                    </button>
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="store.isSendingAction || !customMessage.trim()"
                    class="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/25">
                    <Loader2 v-if="store.isSendingAction" class="w-4 h-4 animate-spin" />
                    <Send v-else class="w-4 h-4" />
                    <span>{{ store.isSendingAction ? t('ui.actions.sending') : t('ui.actions.send_button') }}</span>
                </button>
            </form>
        </div>

        <!-- Server Response Box (Shown after action) -->
        <div v-if="store.lastActionResponse"
            class="bg-slate-900/50 border border-emerald-500/30 rounded-2xl p-5 animate-fade-in">
            <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4" />
                    {{ t('ui.actions.last_response') }}
                </h4>
                <span class="text-[11px] font-mono text-slate-500">
                    {{ store.lastActionResponse.timestamp }}
                </span>
            </div>
            <p class="text-sm font-medium text-slate-200">
                {{ store.lastActionResponse.responseMsg }}
            </p>
            <div class="mt-3 bg-slate-950/80 rounded-lg p-3 font-mono text-xs text-slate-400 border border-slate-800">
                {{ JSON.stringify(store.lastActionResponse, null, 2) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../../stores/appStore';
import { useI18n } from '../../plugins/i18n';
import { Send, Loader2, CheckCircle } from 'lucide-vue-next';

const store = useAppStore();
const { t } = useI18n();

const customMessage = ref('');
const selectedCategory = ref('general');

const categories = [
    { id: 'general', label: 'Allgemein' },
    { id: 'economy', label: 'Economy' },
    { id: 'admin', label: 'Admin / Debug' }
];

const handleSubmit = async () => {
    if (!customMessage.value.trim()) return;
    await store.sendCustomAction(customMessage.value, selectedCategory.value);
    customMessage.value = '';
};
</script>
