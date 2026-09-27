<template>
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        <TransitionGroup enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0 scale-95">
            <div v-for="toast in store.toasts" :key="toast.id"
                class="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all text-sm"
                :class="getToastClasses(toast.type)">
                <component :is="getToastIcon(toast.type)" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                    <h4 class="font-semibold text-slate-100 leading-tight">{{ toast.title }}</h4>
                    <p class="text-xs text-slate-300 mt-0.5">{{ toast.message }}</p>
                </div>
                <button @click="store.removeToast(toast.id)"
                    class="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors">
                    <X class="w-4 h-4" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next';

const store = useAppStore();

const getToastClasses = (type: string) => {
    switch (type) {
        case 'success':
            return 'bg-slate-900/95 border-emerald-500/40 text-emerald-400';
        case 'error':
            return 'bg-slate-900/95 border-rose-500/40 text-rose-400';
        case 'info':
        default:
            return 'bg-slate-900/95 border-brand-500/40 text-brand-400';
    }
};

const getToastIcon = (type: string) => {
    switch (type) {
        case 'success':
            return CheckCircle2;
        case 'error':
            return AlertCircle;
        case 'info':
        default:
            return Info;
    }
};
</script>
