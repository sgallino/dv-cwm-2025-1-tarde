<script setup>
import { onMounted, ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getUserProfileByPK } from '../services/user-profile';
import { useRoute } from 'vue-router';

const route = useRoute();
const { user, loading } = useUserProfile(route.params.id);

function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });
    const loading = ref(false);

    onMounted(async () => {
        try {
            loading.value = true;
            user.value = await getUserProfileByPK(id);
            loading.value = false;
        } catch (error) {
            // TODO...
        }
    });

    return {
        user,
        loading,
    }
}
</script>

<template>
    <div v-if="!loading">
        <div class="flex gap-4 items-end">
            <MainH1>Perfil de {{ user.email }}</MainH1>
        </div>
        
        <div class="mb-4 italic">{{ user.bio || 'Acá va tu mini-biografía...' }}</div>

        <dl class="mb-4">
            <dt><b>Email</b></dt>
            <dd class="mb-2">{{ user.email }}</dd>
            <dt><b>Nombre</b></dt>
            <dd class="mb-2">{{ user.display_name || 'No especificado' }}</dd>
            <dt><b>Carrera</b></dt>
            <dd class="mb-2">{{ user.career || 'No especificada' }}</dd>
        </dl>

        <hr class="mb-4">

        <RouterLink 
            :to="`/usuario/${user.id}/chat`"
            class="text-blue-700"
        >Iniciar una conversación privada con {{ user.email }}</RouterLink>
    </div>
    <MainLoader v-else />
</template>