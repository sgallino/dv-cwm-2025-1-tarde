<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';
import { subscribeToAuth } from '../services/auth';
import { getUserProfileByPK } from '../services/user-profile';
import { getLastPrivateChatMessages, sendPrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chats';
import { nextTick } from 'vue';

// Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
let unsubscribeAuth = () => {};

export default {
    name: 'PrivateChat',
    components: { MainH1, MainLoader, MainButton, },
    data() {
        return {
            userAuth: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
            },

            // Datos del usuario con el que estamos chateando.
            userChat: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
            },
            loadingUser: false,

            messages: [],
            loadingMessages: false,

            newMessage: {
                body: '',
            },
        }
    },
    methods: {
        async sendMessage() {
            try {
                sendPrivateChatMessage(this.userAuth.id, this.userChat.id, this.newMessage.body);
                this.newMessage.body = '';
            } catch (error) {
                // TODO...
            }
        }
    },
    async mounted() {
        unsubscribeAuth = subscribeToAuth(newUserData => this.userAuth = newUserData);

        try {
            this.loadingUser = true;
            this.loadingMessages = true;

            this.userChat = await getUserProfileByPK(this.$route.params.id);
            this.loadingUser = false;

            this.messages = await getLastPrivateChatMessages(this.userAuth.id, this.$route.params.id);
            this.loadingMessages = false;
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;

            subscribeToPrivateChatMessages(this.userAuth.id, this.userChat.id, async newMessage => {
                this.messages.push(newMessage);
                this.loadingMessages = false;
                await nextTick();
                this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
            });
        } catch (error) {
            // TODO...
        }
    },
    unmounted() {
        unsubscribeAuth();
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