<template>
    <div class="space-y-6 animate-fade-in">
        <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div class="mb-5">
                <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <BookOpen class="w-5 h-5 text-brand-400" />
                    {{ t('ui.info.title') }}
                </h3>
                <p class="text-xs text-slate-400 mt-1">
                    {{ t('ui.info.desc') }}
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                    <Code2 class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-semibold text-slate-200">TypeScript Core</h5>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ t('ui.info.features.ts') }}</p>
                    </div>
                </div>

                <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                    <Layers class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-semibold text-slate-200">Vue 3 + Vite</h5>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ t('ui.info.features.vue') }}</p>
                    </div>
                </div>

                <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                    <Palette class="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-semibold text-slate-200">TailwindCSS</h5>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ t('ui.info.features.tailwind') }}</p>
                    </div>
                </div>

                <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                    <Languages class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-semibold text-slate-200">i18n Translations</h5>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ t('ui.info.features.i18n') }}</p>
                    </div>
                </div>

                <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                    <Radio class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-semibold text-slate-200">NUI Event Pipeline</h5>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ t('ui.info.features.nui') }}</p>
                    </div>
                </div>

                <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                    <GitPullRequest class="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-semibold text-slate-200">GitHub CI/CD Release</h5>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ t('ui.info.features.ci') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../plugins/i18n';
import { BookOpen, Code2, Layers, Palette, Languages, Radio, GitPullRequest } from 'lucide-vue-next';

const { t } = useI18n();
</script>
