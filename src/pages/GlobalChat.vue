<script>
import MainH1 from '../components/MainH1.vue';
import { saveGlobalChatMessage } from '../services/global-chat';

const exampleMessages = [
    {
        id: 1,
        email: 'test@user.com',
        body: '¡Hola mundo!',
        created_at: new Date(),
    },
    {
        id: 2,
        email: 'sara@za.com',
        body: 'Hola, ¿qué tal?',
        created_at: new Date(),
    },
    {
        id: 3,
        email: 'pepe@trueno.com',
        body: 'holaaaaaaaaa todo bien????',
        created_at: new Date(),
    },
];

export default {
    name: 'GlobalChat',
    components: { MainH1 },
    /*
    En los componentes de Vue que usan la Options API, definen su "state" (sus datos internos que pueden mutar) a través
    de la propiedad "data".
    Esta propiedad debe ser una función que retorne un objeto con los datos del "state" que queremos, y sus valores
    iniciales.
    */
    data: function() {
        return {
            messages: exampleMessages,
            newMessage: {
                email: '',
                body: '',
            }
        }
    },
    // data: () => {
    //     return {}
    // }
    // data() {
    //     return {

    //     }
    // }
    methods: {
        async sendMessage() {
            // this.messages.push({
            //     id: this.messages.length + 1,
            //     email: this.newMessage.email,
            //     body: this.newMessage.body,
            //     created_at: new Date(),
            // });
            try {
                await saveGlobalChatMessage({...this.newMessage});
                this.newMessage.body = "";
            } catch (error) {
                // TODO: Manage the error.
                console.error("[GlobalChat.vue sendMessage] Error al enviar el mensaje: ", error);
            }
        },
    }
}
</script>

<template>
    <MainH1>Chat Global</MainH1>

    <div class="flex gap-4">
        <div class="w-9/12 min-h-100 p-4 border border-gray-400 rounded">
            <h2 class="sr-only">Lista de Mensajes</h2>

            <ul>
                <li 
                    v-for="message in messages"
                    class="flex flex-col gap-1 mb-4"
                >
                    <div><b>{{ message.email }}</b> dijo:</div>
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
        </div>
        <div class="col-3/12 p-4">
            <h2 class="mb-4 text-2xl">Enviar un mensaje</h2>

            <!-- 
            Para asociar eventos en Vue usamos la directiva:
                v-on:evento
            O su forma abreviada:
                @evento
            Como valor debe llevar la función que queremos ejecutar con el evento.
            Adicionalmente, Vue nos permite agregar modificadores al evento, que agregan algún comportamiento o 
            verificación extra. Por ejemplo, el ".prevent" que ejecuta un "preventDefault()".
            -->
            <form 
                action="#"
                @submit.prevent="() => sendMessage()"
            >
                <div class="mb-4">
                    <label for="email" class="block mb-2">Email:</label>
                    <!-- 
                    v-model es una directiva que agrega un evento y un bindeo para generar un "two-way data binding".
                    "Two-day data binding" significa que quedan vinculados el valor del state y el valor del input,
                    de manera tal que si uno cambia, el otro se actualiza automáticamente.
                    -->
                    <input
                        type="email"
                        id="email"
                        class="w-full px-4 py-2 border border-gray-400 rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-4">
                    <label for="body" class="block mb-2">Mensaje:</label>
                    <textarea
                        id="body"
                        class="w-full
                        px-4 py-2 border border-gray-400 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white">Enviar</button>
            </form>
        </div>
    </div>
</template>