<script setup>
// Con la Composition API, podemos usar la "macro" defineModel() para generar un modelo compatible con el v-model que
// recibimos. Este modelo lo podemos pasar directamente al <input> (o textarea o select) con su propio v-model.
const model = defineModel();

// ¿Qué es una "macro"?
// Van a poder notar que la función "defineModel" no la importamos.
// Las "macros" de Vue (que, estrictamente hablando, se llaman "macros de compilación" o "compile macros") son 
// instrucciones especiales que son interpretadas por el compilador de Vue. Es decir, no son realmente funciones de JS.
</script>

<template>
    <input
        class="w-full px-4 py-2 border border-gray-400 rounded"
        v-model="model"
    >
</template>
<!-- <script>
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
</template> -->