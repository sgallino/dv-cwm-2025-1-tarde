<script setup>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';
import { getLastPrivateChatMessages, sendPrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chats';
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import useAuthUserState from '../composables/useAuthStateUser';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';

const route = useRoute();
const { user: userAuth } = useAuthUserState();
const { user: userChat, loading: loadingUser } = useUserProfile(route.params.id);
// Pasamos el usuario autenticado entero en vez de solo su id para asegurarnos de que se guarde la referencia, así
// puede actualizarse el valor cuando tengamos el usuario cargado.
const { newMessage, sendMessage } = usePrivateChatForm(userAuth, userChat);
const { messages, loading: loadingMessages } = usePrivateChatMessages(userAuth, userChat);

function usePrivateChatMessages(userAuth, userChat) {
    const messages = ref([]);
    const loading = ref(true);
    const chatContainer = useTemplateRef('chatContainer');

    // Asegurándonos de tener el usuario con el que chateamos antes de realizar la búsqueda de los mensajes.
    // Como vimos, recibir el objeto del usuario con el que chateamos tiene el problema de que busca la data en 
    // Supabase. Y hasta que no reciba la respuesta, no tenemos el id. No hay tiempo suficiente para que Supabase
    // me dé esa respuesta antes de que acá queramos usar ese id.
    // Lo que podemos hacer, como una alternativa, para resolver esto, es usar un "watcher".
    // Los "watchers" son una implementación de Vue del patrón Observer. Nos permite detectar cualquier cambio ocurrido
    // en alguna referencia reactiva de Vue (ej: un ref()).
    // Para crear un watcher tenemos que usar la función watch(). Esta función recibe dos parámetros:
    // 1. La referencia que queremos observar.
    // 2. El callback que queremos ejecutar cuando el valor cambie. Este callback va a recibir automáticamente dos
    //  parámetros:
    //      2a. El nuevo valor.
    //      2b. El viejo valor.
    // watch(userChat, async (newVal, oldVal) => {
    //     if(newVal.id) {
    //         try {
    //             // loading.value = true;
                
    //             messages.value = await getLastPrivateChatMessages(userAuth.value.id, userChat.value.id);
    //             loading.value = false;
    //             await nextTick();
    //             chatContainer.value.scrollTop = chatContainer.value.scrollHeight;

    //             subscribeToPrivateChatMessages(userAuth.value.id, userChat.value.id, async newMessage => {
    //                 messages.value.push(newMessage);
    //                 await nextTick();
    //                 chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    //             });
    //         } catch (error) {
    //             // TODO...
    //         }
    //         loading.value = false;
    //     }
    // });

    onMounted(async () => {
        try {
            loading.value = true;
            
            messages.value = await getLastPrivateChatMessages(userAuth.value.id, userChat.value.id);
            loading.value = false;
            await nextTick();
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;

            subscribeToPrivateChatMessages(userAuth.value.id, userChat.value.id, async newMessage => {
                messages.value.push(newMessage);
                await nextTick();
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            });
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    });

    return {
        messages,
        loading,
    }
}

function usePrivateChatForm(userAuth, userChat) {
    const newMessage = ref({
        body: '',
    });

    async function sendMessage() {
        try {
            sendPrivateChatMessage(userAuth.value.id, userChat.value.id, newMessage.value.body);
            newMessage.value.body = '';
        } catch (error) {
            // TODO...
        }
    }

    return {
        newMessage,
        sendMessage,
    }
}
</script>

<template>
    <template v-if="!loadingUser">
        <MainH1>Chat privado con {{ userChat.email }}</MainH1>

        <div 
            ref="chatContainer"
            class="overflow-y-auto h-100 p-4 mb-4 border border-gray-400 rounded"
        >
            <h2 class="sr-only">Lista de Mensajes</h2>

            <ol
                v-if="!loadingMessages"
                class="flex flex-col"
            >
                <li 
                    v-for="message in messages"
                    class="flex flex-col gap-1 max-w-8/12 p-2 mb-4 rounded"
                    :class="{
                        'self-end bg-green-100': message.sender_id == userAuth.id,
                        'self-start bg-gray-100': message.sender_id != userAuth.id,
                    }"
                >
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ol>
            <div 
                v-else
            >
                <MainLoader />
            </div>
        </div>
        <div>
            <h2 class="sr-only">Enviar un mensaje</h2>
            <form 
                class="flex items-stretch gap-4"
                action="#"
                @submit.prevent="() => sendMessage()"
            >
                <div class="w-full">
                    <label for="body" class="sr-only">Mensaje:</label>
                    <textarea
                        id="body"
                        class="w-full px-4 py-2 border border-gray-400 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <MainButton>Enviar</MainButton>
            </form>
        </div>
    </template>
    <MainLoader v-else />
</template>