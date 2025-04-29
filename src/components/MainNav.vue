<script>
import { logout, subscribeToAuth } from '../services/auth';

export default {
    name: 'MainNav',
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    methods: {
        handleLogout() {
            logout();
            // Redireccionamos a la pantalla del login.
            // Para redireccionar programáticamente podemos usar el método "push" del router, que podemos acceder con
            // this.$router.
            this.$router.push('/ingresar');
        }
    },
    mounted() {
        subscribeToAuth(newUserData => this.user = newUserData);
    },
}
</script>

<template>
    <nav class="flex gap-8 p-4 bg-slate-300">
        <router-link class="text-lg" to="/">DV Social</router-link>
        <ul class="flex gap-4">
            <li>
                <!-- <RouterLink to="/">Home</RouterLink> -->
                <router-link to="/">Home</router-link>
            </li>
            <template v-if="user.id === null">
                <li>
                    <router-link to="/ingresar">Iniciar sesión</router-link>
                </li>
                <li>
                    <router-link to="/registro">Registrarse</router-link>
                </li>
            </template>
            <template v-else>
                <li>
                    <router-link to="/chat-global">Chat global</router-link>
                </li>
                <li>
                    <router-link to="/mi-perfil">Mi perfil</router-link>
                </li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit">{{ user.email }} (Cerrar sesión)</button>
                    </form>
                </li>
            </template>
        </ul>
    </nav>
</template>