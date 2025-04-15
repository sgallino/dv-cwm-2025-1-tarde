<script>
import MainH1 from '../components/MainH1.vue';

export default {
    name: 'Login',
    components: { MainH1 },
}
</script>

<template>
    <MainH1>Ingresar a Mi Cuenta</MainH1>

    <form 
        action="#"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input type="email" id="email" class="w-full px-4 py-2 border border-gray-400 rounded">
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input type="password" id="password" class="w-full px-4 py-2 border border-gray-400 rounded">
        </div>
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white">Ingresar</button>
    </form>
</template>