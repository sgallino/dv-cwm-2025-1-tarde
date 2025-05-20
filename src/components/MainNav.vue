<!-- <script>
import { logout, subscribeToAuth } from '../services/auth';

export default {
    name: 'MainNav',
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    methods: {
        handleLogout() {
            logout();
            // Redireccionamos a la pantalla del login.
            // Para redireccionar programáticamente podemos usar el método "push" del router, que podemos acceder con
            // this.$router.
            this.$router.push('/ingresar');
        }
    },
    mounted() {
        subscribeToAuth(newUserData => this.user = newUserData);
    },
}
</script> -->
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, subscribeToAuth } from '../services/auth';

/*
Como en la Composition API *no tenemos* acceso a "this" (porque se ejecuta antes de la instanciación del componente),
no tenemos las propiedades especiales como $router o $route.
En su lugar, tenemos que obtener el router o la route usando los "composables" (funciones que empiezan con "use")
useRouter() y useRoute(), respectivamente.
*/
const router = useRouter();

/*
Para declarar valores del "state" del componente (lo que hacíamos con la propiedad "data" en la Options API), la forma
principal de hacerlo es a través de la función ref() de Vue.
ref() (reactive reference) recibe como argumento el valor que quiero asignarle, y retorna la referencia.
Cada propiedad que definimos en el objeto del "data" de la Options API la podemos transformar a una variable que
recibe el valor de un ref().
Todas las variables reactivas que definamos con la Composition API están automáticamente disponibles en el <template>,
como siempre.

Con las variables que creamos con ref(), tenemos que usarlas con su propiedad ".value".
Es decir, que si tengo:
    const texto = ref('hola');

Para ver el valor 'hola' tendríamos que hacer:
    console.log(texto.value);

Esto es porque ref(), internamente, envuelve al valor en un objeto que tiene esa propiedad value.
Pueden pensarlo como el equivalente al "this." en la Options API.
*/
const user = ref({
    id: null,
    email: null,
});

/*
Lo que serían las funciones que definimos en "methods", pasan a ser funciones comunes y corrientes.
*/
function handleLogout() {
    logout();
    router.push('/ingresar');
}

/*
Lo que son las funciones del ciclo de vida de un componente (como mounted o unmounted) se transforman en funciones
con el prefijo "on" que reciben un callback con lo que queremos ejecutar.

Noten que para asignar el valor a user, usamos su propiedad ".value".
*/
onMounted(() => subscribeToAuth(newUserData => user.value = newUserData));
</script>

<template>
    <nav class="flex gap-8 p-4 bg-slate-300">
        <router-link class="text-lg" to="/">DV Social</router-link>
        <ul class="flex gap-4">
            <li>
                <!-- <RouterLink to="/">Home</RouterLink> -->
                <router-link to="/">Home</router-link>
            </li>
            <template v-if="user.id === null">
                <li>
                    <router-link to="/ingresar">Iniciar sesión</router-link>
                </li>
                <li>
                    <router-link to="/registro">Registrarse</router-link>
                </li>
            </template>
            <template v-else>
                <li>
                    <router-link to="/chat-global">Chat global</router-link>
                </li>
                <li>
                    <router-link to="/mi-perfil">Mi perfil</router-link>
                </li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit">{{ user.email }} (Cerrar sesión)</button>
                    </form>
                </li>
            </template>
        </ul>
    </nav>
</template>