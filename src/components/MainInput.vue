<script>
export default {
    name: 'MainInput',
    props: ['modelValue'],
    emits: ['update:modelValue'],
}
</script>

<template>
    <input
        class="w-full px-4 py-2 border border-gray-400 rounded"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    >
</template>