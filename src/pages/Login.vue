<script>
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { MainH1 },
    data() {
        return {
            user: {
                email: '',
                password: '',
            }
        }
    },
    methods: {
        async handleSubmit() {
            try {
                const user = await login(this.user.email, this.user.password);
                console.log("Usuario autenticado: ", user);

                // Podemos emitir un evento "login" que pase la data del usuario autenticado.
                // this.$emit nos permite hacer que el componente emita un evento arbitrario al componente contenedor.
                // Recibe como primer argumento un string con el nombre del evento (puede ser lo que quieran), y como
                // segundo el valor que quieren que acompañe.
                // this.$emit('login', {id: user.id, email: user.email});
            } catch (error) {
                // TODO: Manejar el error.
                console.error('[Login handleSubmit] Error al iniciar sesión: ', error);
            }
        }
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