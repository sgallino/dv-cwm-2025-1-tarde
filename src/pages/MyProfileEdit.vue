<script>
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';
import { subscribeToAuth, updateAuthProfile } from '../services/auth';

// Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
let unsubscribeAuth = () => {};

export default {
    name: 'MyProfileEdit',
    components: { MainH1, MainLoader, MainLabel, MainInput, MainButton },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            profile: {
                bio: '',
                display_name: '',
                career: '',
            },
            updating: false,
        }
    },
    methods: {
        async handleSubmit() {
            // Si ya estamos trabajando, entonces no hacemos nada.
            if(this.updating) return;

            try {
                this.updating = true;
                await updateAuthProfile({
                    ...this.profile
                });
                this.updating = false;
            } catch (error) {
                // TODO: ...
            }
        }
    },
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
    unmounted() {
        // Cancelamos la ssuscripción.
        unsubscribeAuth();
    }
}
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