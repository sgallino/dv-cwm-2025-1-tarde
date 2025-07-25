<script setup>
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { getLastMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';
import useAuthUserState from '../composables/useAuthStateUser';
import useScroll from '../composables/useScroll';

const { user } = useAuthUserState();
const { newMessage, sendMessage } = useGlobalChatForm(user);
const { messages, loadingMessages } = useGlobalChatMessages();

function useGlobalChatMessages() {
    const messages = ref([]);
    const loadingMessages = ref(true);
    const container = useTemplateRef('chatContainer');
    // const { moveScrollToBottom } = useScroll(container);
    async function moveScrollToBottom() {
        await nextTick();
        container.value.scrollTop = container.value.scrollHeight;
    }

    onMounted(async () => {
        subscribeToGlobalChatNewMessages(async newMessageReceived => {
            messages.value.push(newMessageReceived);
            await moveScrollToBottom();
        });

        try {
            messages.value = await getLastMessages();
            loadingMessages.value = false;

            await moveScrollToBottom();
        } catch (error) {
            // TODO: 
        }
    });

    return {
        messages,
        loadingMessages,
    }
}

function useGlobalChatForm(user) {
    const newMessage = ref({
        body: '',
    });

    async function sendMessage() {
        try {
            await saveGlobalChatMessage({
                body: newMessage.value.body,
                user_id: user.value.id,
                email: user.value.email,
            });
            newMessage.value.body = '';
        } catch (error) {
            // TODO...
            console.error("[GlobalChat.vue sendMessage] Error al enviar el mensaje: ", error);
        }
    }

    return {
        newMessage,
        sendMessage,
    }
}

/*
    async mounted() {
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
}*/
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