<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import MainButton from '../MainButton.vue';
import NotificationBox from '../NotificationBox.vue';
import { login } from '../../services/auth';
import { PROVIDE_GLOBAL_FEEDBACK_KEY } from '../../symbols/provide-keys';

const emit = defineEmits(['changeFeedback']);

const router = useRouter();
const { user, loading ,feedback, handleSubmit } = useLoginForm(router);

// # Feedback global: Versión con provide / inject
// Pedimos inyectar la dependencia de "globalFeedback" que definimos en un ancestro (en este caso, App).
// const { feedback: globalFeedback } = inject("globalFeedback");
const { setFeedback: setGlobalFeedback } = inject(PROVIDE_GLOBAL_FEEDBACK_KEY);

function useLoginForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);
    const localFeedback = ref({
        message: null,
        title: null,
        type: 'success',
        icon: 'success',
    });

    async function handleSubmit() {
        localFeedback.value = {
            message: null,
            title: null,
            type: 'success',
            icon: 'success',
        }

        try {
            loading.value = true;
            await login(user.value.email, user.value.password);

            // # Feedback global: Versión con provide / inject
            // globalFeedback.value = {
            //     message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
            //     title: 'Éxito',
            //     type: 'success',
            //     icon: 'success',
            // }
            setGlobalFeedback({
                message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
                title: 'Éxito',
                type: 'success',
                icon: 'success',
            });

            // # Feedback global: Versión con emisión de eventos
            // Emitimos el cambio del mensaje de feedback.
            // emit('changeFeedback', {
            //     message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
            //     title: 'Éxito',
            //     type: 'success',
            //     icon: 'success',
            // });

            // localFeedback.value = {
            //     message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
            //     title: 'Éxito',
            //     type: 'success',
            //     icon: 'success',
            // }

            router.push('/mi-perfil');
        } catch (error) {
            console.error('[Login handleSubmit] Error al iniciar sesión: ', error);
            localFeedback.value = {
                message: 'Las credenciales ingresadas no coinciden con nuestros registros.',
                title: 'Error',
                type: 'error',
                icon: 'error',
            }
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        feedback: localFeedback,
        handleSubmit,
    }
}
</script>

<template>
    <NotificationBox
        v-if="feedback.message"
        :content="feedback"
        @close="() => feedback.message = null"
    >
        <template v-slot:header>
            <h2 class="pb-2 mb-4 border-b text-2xl">{{ feedback.title }}</h2>
        </template>
    </NotificationBox>

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