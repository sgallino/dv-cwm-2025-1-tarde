<script setup>
import { onMounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthStateUser';
import { updateAuthProfile } from '../services/auth';
import NotificationBox from '../components/NotificationBox.vue';

// Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
const { user } = useAuthUserState();
const { profile, updating, feedback, handleSubmit } = useProfileEditForm(user);

function useProfileEditForm(authUser) {
    const profile = ref({
        bio: '',
        display_name: '',
        career: '',
    });
    const updating = ref(false);
    const feedback = ref({
        message: null,
        type: 'success',
        icon: 'success',
        title: 'Éxito',
    });

    async function handleSubmit() {
        if(updating.value) return;

        try {
            updating.value = true;
            await updateAuthProfile({
                // bio: profile.value.bio,
                // display_name: profile.value.display_name,
                // career: profile.value.career,
                ...profile.value
            });
            feedback.value = {
                message: 'Los datos de tu perfil se actualizaron con éxito.',
                type: 'success',
                icon: 'success',
                title: 'Éxito',
            }
        } catch (error) {
            feedback.value = {
                message: 'Ocurrió un error al actualizar tus datos. Por favor, probá de nuevo más tarde.',
                type: 'error',
                icon: 'error',
                title: 'Error',
            }
        }
        updating.value = false;
    }

    onMounted(() => profile.value = {
        bio: authUser.value.bio,
        display_name: authUser.value.display_name,
        career: authUser.value.career,
    });

    return {
        profile,
        updating,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <MainH1>Editar mi perfil</MainH1>

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
            <MainLabel for="bio">Biografía:</MainLabel>
            <textarea
                id="bio"
                class="w-full px-4 py-2 border border-gray-400 rounded"
                v-model="profile.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <MainLabel for="display_name">Nombre:</MainLabel>
            <MainInput
                type="text"
                id="display_name"
                v-model="profile.display_name"
            />
        </div>
        <div class="mb-4">
            <MainLabel for="career">Carrera:</MainLabel>
            <MainInput
                type="text"
                id="career"
                v-model="profile.career"
            />
        </div>
        <MainButton
            :loading="updating"
            type="submit"
        >
            Actualizar
        </MainButton>
    </form>
</template>