<script>
import { nextTick } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { getLastMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { subscribeToAuth } from '../services/auth';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';

// Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
let unsubscribeAuth = () => {};

export default {
    name: 'GlobalChat',
    components: { MainH1, MainLoader, MainButton },
    /*
    En los componentes de Vue que usan la Options API, definen su "state" (sus datos internos que pueden mutar) a través
    de la propiedad "data".
    Esta propiedad debe ser una función que retorne un objeto con los datos del "state" que queremos, y sus valores
    iniciales.
    */
    data: function() {
        return {
            messages: [],
            loadingMessages: true,

            newMessage: {
                body: '',
            },

            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
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
            try {
                await saveGlobalChatMessage({
                    body: this.newMessage.body,
                    // Los datos que identifican al usuario los sacamos del usuario autenticado.
                    user_id: this.user.id,
                    email: this.user.email,
                });
                // Versión para 'Broadcast'.
                // const message = {
                //     id: this.messages.length + 1,
                //     email: this.newMessage.email,
                //     body: this.newMessage.body,
                //     created_at: new Date(),
                // };
                // await saveGlobalChatMessage(message);
                this.newMessage.body = "";
            } catch (error) {
                // TODO: Manage the error.
                console.error("[GlobalChat.vue sendMessage] Error al enviar el mensaje: ", error);
            }
        },
    },
    async mounted() {
        unsubscribeAuth = subscribeToAuth(newUser => this.user = newUser);

        // Pedimos recibir los nuevos mensajes para agregarlos en el array de mensajes.
        subscribeToGlobalChatNewMessages(async newMessageReceived => {
            this.messages.push(newMessageReceived);
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        });
        
        // Traemos los mensajes iniciales.
        try {
            this.messages = await getLastMessages();
            this.loadingMessages = false;

            // Movemos el scroll del elemento del contenedor del chat al final.
            console.log(this.$refs.chatContainer);
            // nextTick() es una función que nos permite esperar al próximo frame de redibujo de Vue.
            // ¿Por qué lo necesitamos acá?
            // Nuestra intención es que traigamos los mensajes, se agreguen en el DOM, y luego de que se hayan agregado,
            // se calcule el alto del scroll del contenedor del chat, y lo movamos al final.
            // Esos son dos pasos diferentes en cuando al "redraw" del browser. Para que el scroll del contenedor se
            // actualice, necesitamos que el browser renderice primero en el DOM todos los mensajes.
            // Por defecto, Vue no actualiza el DOM instantánmeamente cada vez que modificamos algo del componente.
            // Para optimizar la performance (ya que el "redraw" es de las tareas más intensivas para el browsers), 
            // Vue "agrupa" (batch) varias acciones de modificación del DOM, y las ejecuta todas juntas.
            // En la mayoría de los casos, es el camino ideal para seguir.
            // Pero hay casos, como este, donde antes de realizar otra acción, necesito sí o sí que lo anterior se
            // ejecute. Ahí es donde necesitamos nextTick().
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        } catch (error) {
            // TODO:
        }
    },
    unmounted() {
        unsubscribeAuth();
    }
}
</script>

<template>
    <MainH1>Chat global</MainH1>

    <div class="flex gap-4">
        <div 
            ref="chatContainer"
            class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-400 rounded"
        >
            <h2 class="sr-only">Lista de Mensajes</h2>

            <ul
                v-if="!loadingMessages"
            >
                <li 
                    v-for="message in messages"
                    class="flex flex-col gap-1 mb-4"
                >
                    <div>
                        <router-link 
                            :to="`/usuario/${message.user_id}`"
                            class="text-blue-700 font-bold underline"
                        >
                            {{ message.email }}
                        </router-link>
                        dijo:
                    </div>
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
            <div 
                v-else
            >
                <MainLoader />
            </div>
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
                    <div class="block mb-2">Email:</div>
                    <div class="font-bold">{{ user.email }}</div>
                </div>
                <div class="mb-4">
                    <label for="body" class="block mb-2">Mensaje:</label>
                    <!-- 
                    v-model es una directiva que agrega un evento y un bindeo para generar un "two-way data binding".
                    "Two-day data binding" significa que quedan vinculados el valor del state y el valor del input,
                    de manera tal que si uno cambia, el otro se actualiza automáticamente.
                    -->
                    <textarea
                        id="body"
                        class="w-full px-4 py-2 border border-gray-400 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <MainButton>Enviar</MainButton>
            </form>
        </div>
    </div>
</template>