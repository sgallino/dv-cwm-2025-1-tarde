<script setup>
import { onMounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthStateUser';
import { updateAuthProfile } from '../services/auth';

// Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
const { user } = useAuthUserState();
const { profile, updating, handleSubmit } = useProfileEditForm(user);

function useProfileEditForm(authUser) {
    const profile = ref({
        bio: '',
        display_name: '',
        career: '',
    });
    const updating = ref(false);

    async function handleSubmit() {
        if(updating.value) return;

        try {
            updating.value = true;
            updateAuthProfile({
                // bio: profile.value.bio,
                // display_name: profile.value.display_name,
                // career: profile.value.career,
                ...profile.value
            });
        } catch (error) {
            // TODO...
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
        handleSubmit,
    }
}

/*
    mounted() {
        unsubscribeAuth = subscribeToAuth(newUserData => {
            this.user = newUserData;
            // Asignamos los datos del perfil extendido a los del form.
            this.profile = {
                bio: this.user.bio,
                display_name: this.user.display_name,
                career: this.user.career,
            }
        }); // TODO: Unsub
    },
*/
</script>

<template>
    <MainH1>Editar mi perfil</MainH1>

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
            type="submit"
            class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white"
        >
            <template v-if="!updating">
                Actualizar
            </template>
            <MainLoader v-else />
        </MainButton>
    </form>
</template>