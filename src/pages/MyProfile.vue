<script>
import MainH1 from '../components/MainH1.vue';
import { subscribeToAuth } from '../services/auth';

// Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
let unsubscribeAuth = () => {};

export default {
    name: 'MyProfile',
    components: { MainH1 },
    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
            },
        }
    },
    mounted() {
        // Capturamos la función que cancela la suscripción.
        unsubscribeAuth = subscribeToAuth(newUserData => this.user = newUserData);
    },
    unmounted() {
        // Cancelamos la ssuscripción.
        unsubscribeAuth();
    }
}
</script>

<template>
    <div class="flex gap-4 items-end">
        <MainH1>Mi perfil</MainH1>
        <router-link
            to="/mi-perfil/editar"
            class="pb-4 text-blue-700"
        >Editar</router-link>
    </div>
    
    <div class="mb-4 italic">{{ user.bio || 'Acá va tu mini-biografía...' }}</div>

    <dl>
        <dt><b>Email</b></dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt><b>Nombre</b></dt>
        <dd class="mb-2">{{ user.display_name || 'No especificado' }}</dd>
        <dt><b>Carrera</b></dt>
        <dd class="mb-2">{{ user.career || 'No especificada' }}</dd>
    </dl>
</template>