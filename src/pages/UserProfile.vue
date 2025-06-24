<script setup>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { useRoute } from 'vue-router';
import useUserProfile from '../composables/useUserProfile';
import ProfileData from '../components/profile/ProfileData.vue';
import useAuthUserState from '../composables/useAuthStateUser';

const route = useRoute();
const { user, loading } = useUserProfile(route.params.id);
const { user: authUser } = useAuthUserState();
</script>

<template>
    <div v-if="!loading">
        <div class="flex gap-4 items-end">
            <MainH1>Perfil de {{ user.email }}</MainH1>
        </div>
        
        <ProfileData :user="user" />

        <template v-if="user.id !== authUser.id">
            <hr class="my-4">

            <RouterLink 
                :to="`/usuario/${user.id}/chat`"
                class="text-blue-700"
            >Iniciar una conversación privada con {{ user.email }}</RouterLink>
        </template>
    </div>
    <MainLoader v-else />
</template>