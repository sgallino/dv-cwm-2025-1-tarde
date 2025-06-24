<script setup>
defineProps({
    user: {
        type: Object,
        required: true,
    }
});
</script>

<template>
    <div class="flex gap-4">
        <div class="w-2/6 p-4 bg-slate-200">
            <div class="mb-4" v-if="user.photo">
                <img :src="user.photo" alt="" class="rounded-[50%]">
            </div>
            <div class="mb-4 italic">{{ user.bio || 'Acá va tu mini-biografía...' }}</div>
        </div>
        <div class="w-4/6">
            <dl>
                <dt><b>Email</b></dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt><b>Nombre</b></dt>
                <dd class="mb-2">{{ user.display_name || 'No especificado' }}</dd>
                <dt><b>Carrera</b></dt>
                <dd class="mb-2">{{ user.career || 'No especificada' }}</dd>
            </dl>
        </div>
    </div>
</template>