<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getUserProfileByPK } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { MainH1, MainLoader },
    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
            },
            loading: false,
        }
    },
    async mounted() {
        // Cargamos el perfil del usuario que se está pidiendo ver.
        // Usamos el parámetro "id" de la ruta.
        // Recordamos: Cuando usamos Vue Router, los componentes que usen la Options API van a tener dos propiedades
        // ya definidas llamadas $route y $router, que van a tener acceso a la ruta actual y a la instancia del Vue Router,
        // respectivamente.
        try {
            this.loading = true;
            this.user = await getUserProfileByPK(this.$route.params.id);
            this.loading = false;
        } catch (error) {
            
        }
    }
}
</script>

<template>
    <div v-if="!loading">
        <div class="flex gap-4 items-end">
            <MainH1>Perfil de {{ user.email }}</MainH1>
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
    </div>
    <MainLoader v-else />
</template>