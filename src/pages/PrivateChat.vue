<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';
import { subscribeToAuth } from '../services/auth';
import { getUserProfileByPK } from '../services/user-profile';
import { sendPrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chats';

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
        subscribeToAuth(newUserData => this.userAuth = newUserData);

        try {
            this.loadingUser = true;
            this.loadingMessages = true;

            this.userChat = await getUserProfileByPK(this.$route.params.id);
            this.loadingUser = false;   

            subscribeToPrivateChatMessages(this.userAuth.id, this.userChat.id, newMessage => {
                this.messages.push(newMessage);
                this.loadingMessages = false;
            });
        } catch (error) {
            // TODO...
        }
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

            <ul
                v-if="!loadingMessages"
            >
                <li 
                    v-for="message in messages"
                    class="flex flex-col gap-1 mb-4"
                >
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