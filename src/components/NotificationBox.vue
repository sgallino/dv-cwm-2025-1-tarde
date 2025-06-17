<script setup>
import { computed } from 'vue';
import check from '/icons/check.svg';
import cross from '/icons/cross.svg';

const props = defineProps({
    // message: {
    //     default: null,
    // },
    // type: {
    //     type: String,
    //     default: 'success',
    // }
    content: {
        type: Object,
    }
});

defineEmits(['close']);

const CLASSES_MAP = {
    success: 'bg-green-100',
    error: 'bg-red-100',
}

const ICONS_MAP = {
    success: check,
    error: cross,
}

const colorClasses = computed(() => CLASSES_MAP[props.content.type] || '');
</script>

<template>
    <div
        class="relative flex gap-4 p-4 mb-4 rounded"
        :class="colorClasses"
    >
        <div
            v-if="content.icon"
            class="p-2 py-2"
        >
            <img
                :src="ICONS_MAP[content.icon]"
                alt=""
                class="w-6 h-6"
            >
        </div>
        <div>
            <slot name="header" />
            <div>
                {{ content.message }}
            </div>
        </div>
        <button
            v-if="content.closable !== false"
            type="button"
            class="flex justify-center items-center absolute top-0 right-0 h-14 w-14"
            @click="$emit('close')"
        >&times;</button>
    </div>
</template>