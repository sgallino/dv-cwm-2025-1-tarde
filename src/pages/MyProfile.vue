<script>
import MainH1 from '../components/MainH1.vue';
import { subscribeToAuth } from '../services/auth';

export default {
    name: 'MyProfile',
    components: { MainH1 },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    mounted() {
        subscribeToAuth(newUserData => this.user = newUserData);
    }
}
</script>

<template>
    <MainH1>Mi perfil</MainH1>
    <div class="mb-4 italic">Acá tu mini-biografía.</div>

    <dl>
        <dt><b>Email</b></dt>
        <dd>{{ user.email }}</dd>
        <dt><b>Nombre</b></dt>
        <dd><i>Acá va el nombre</i></dd>
        <dt><b>Carrera</b></dt>
        <dd><i>Acá va la carrera</i></dd>
    </dl>
</template>