<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const { user, handleSubmit } = useLoginForm(router);

function useLoginForm(router) {
    const user = ref({
        email: '',
        password: '',
    });

    async function handleSubmit() {
        try {
            await login(user.value.email, user.value.password);
            router.push('/mi-perfil');
        } catch (error) {
            // TODO: Manejar el error.
            console.error('[Login handleSubmit] Error al iniciar sesión: ', error);
        }
    }

    return {
        user,
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
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white">Ingresar</button>
    </form>
</template>