<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';
import MainButton from '../components/MainButton.vue';

const router = useRouter();
const { user, loading, handleSubmit } = useLoginForm(router);

function useLoginForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;
            await login(user.value.email, user.value.password);
            router.push('/mi-perfil');
        } catch (error) {
            // TODO: Manejar el error.
            console.error('[Login handleSubmit] Error al iniciar sesión: ', error);
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <MainH1>Ingresar a mi cuenta</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input
                v-model="user.email"
                type="email"
                id="email"
                class="w-full px-4 py-2 border border-gray-400 rounded"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                v-model="user.password"
                type="password"
                id="password"
                class="w-full px-4 py-2 border border-gray-400 rounded"
            >
        </div>
        <MainButton 
            :loading="loading"
            type="submit"
        >Ingresar</MainButton>
    </form>
</template>