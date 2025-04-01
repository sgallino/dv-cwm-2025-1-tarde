<script>
import MainH1 from '../components/MainH1.vue';

export default {
    name: 'GlobalChat',
    components: { MainH1 },
}
</script>

<template>
    <MainH1>Chat Global</MainH1>

    <div class="flex gap-4">
        <div class="w-9/12 min-h-100 p-4 border border-gray-400 rounded">
            <h2 class="sr-only">Lista de Mensajes</h2>

            <!-- Lista de mensajes... -->
        </div>
        <div class="col-3/12 p-4">
            <h2 class="mb-4 text-2xl">Enviar un mensaje</h2>

            <form action="#">
                <div class="mb-4">
                    <label for="email" class="block mb-2">Email:</label>
                    <input type="email" id="email" class="w-full px-4 py-2 border border-gray-400 rounded">
                </div>
                <div class="mb-4">
                    <label for="message" class="block mb-2">Mensaje:</label>
                    <textarea id="message" class="w-full px-4 py-2 border border-gray-400 rounded"></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white">Enviar</button>
            </form>
        </div>
    </div>
</template>