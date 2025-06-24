<script setup>
import LoginForm from '../components/login/LoginForm.vue';
import MainH1 from '../components/MainH1.vue';
</script>

<template>
    <MainH1>Ingresar a mi cuenta</MainH1>

    <!-- Re-emitimos el evento de changeFeedback que recibimos. -->
    <LoginForm
        @changeFeedback="newFeedback => $emit('changeFeedback', newFeedback)"
    />
</template>