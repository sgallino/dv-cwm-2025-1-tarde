<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

// Invocamos los "composables" que usamos.
const { user, handleSubmit } = useRegisterForm(router);

/*
La idea de uso preferido de la Composition API es que cada responsabilidad que un componente tenga sea encapsulada en
una función que lleve como prefijo "use" (lo que se conocen como "composable functions").
Estas funciones deberían recibir como parámetros cualquier dependencia que tenga (ej: el router o cualquier otro valor de
otro composable) y retornar los valores que deben ser utilizados por el componente.

¿Por qué se prefiere trabajar así?
1. Evita la "contaminación" (pollution) del espacio global de variables. La lógica de cada responsabilidad queda 
    limpiamente encapsulada.
2. Es más fácil leer el código. Tenemos al comienzo la lista de responsabilidades que se ejecutan y lo que retornan.
3. Si necesitamos eventualmente reutilizar alguna de estas responsabilidades en otro componente, se vuelve trivial poder
    extraer la función composable a un archivo externo y compartirla.
*/
function useRegisterForm(router) {
    const user = ref({
        email: '',
        password: '',
    });

    async function handleSubmit() {
        try {
            await register(user.value.email, user.value.password);
            router.push('/mi-perfil');
        } catch (error) {
            // TODO: Manejar el error.
            console.error('[Register handleSubmit] Error al registrarnos: ', error);
        }
    }

    return {
        user,
        handleSubmit,
    }
}
</script>


<template>
    <MainH1>Crear una cuenta</MainH1>

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
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white">Crear cuenta</button>
    </form>
</template>