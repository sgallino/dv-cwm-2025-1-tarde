<!-- <script>
import MainH1 from '../components/MainH1.vue';

export default {
    name: 'Home',
    components: { MainH1 },
}
</script> -->
<script setup>
// En la Composition API *NO* exportamos un objeto (el export lo agrega el propio Vue al compilar el SFC).
// Esto incluye que no necesitamos declarar los componentes que usamos. Solo necesitamos importarlos.
import MainH1 from '../components/MainH1.vue';
</script>

<template>
    <MainH1>¡Les damos la bienvenida a DV Social!</MainH1>

    <p>Acá vas a encontrar todo lo referente a la Escuela Da Vinci. Blah blah blah.</p>
</template>