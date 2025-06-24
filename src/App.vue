<script setup>
import { provide, ref } from 'vue';
import MainNav from './components/MainNav.vue';
import NotificationBox from './components/NotificationBox.vue';
import { PROVIDE_GLOBAL_FEEDBACK_KEY } from './symbols/provide-keys';

/*
# Alternativas para definir un sistema de notificaciones global
Podemos hablar de diferentes estrategias para lograr este objetivo:

1. Usando emisión de eventos. El componente que quiere modificar el contenido del mensaje de feedback emite un
    evento, que el contenedor del mensaje de feedback recibe.
    Pros:
        - Puede adaptarse a cualquier estructura de componentes.
        - No requiere ningún patrón de diseño específico para funcionar.
    Contras:
        - Es bastante "boilerplatey". Puede requerir bastante código adicional para funcionar.
        - Es especialmente tedioso si tenemos varios componentes en el medio del contenedor del mensaje de 
            feedback y de quién quiere cambiar ese contenido.
        - Queda un poco "sucio" asociar un evento a RouterView que solo algunas vistas utilizan.

2. Usando la API de provide / inject de Vue.
    Pros:
        - Es muy sencilla de implementar.
        - No tiene ningún problema con la cantidad de componentes que necesiten usar esta data, ni tampoco importa
        dónde estén.
        - Es una interfaz bien conocida por desarrolladores de Vue.
    Contras:
        - No son lo más fácil que hay para "descubrir".
        - No hay algo que fácilmente indique qué providers tengo disponibles para incluir en un componente.
        - Limita la posibilidad de reutilizar componentes que requieran un determinado provider.

3. Usar un observer o un "store" para compartir la data.
*/

const feedback = ref({
    message: null,
    title: null,
    type: 'success',
    icon: 'success',
});

// # Versión con provide / inject.
// La función "provide" nos permite definir un dato (típicamente, un objeto) asociado a una "key", que puede
//  ser inyectada en cualquier componente descendiente, sea descendiente directo o no.
// Podemos, como vemos, pasar referencias reactivas de Vue directamente, que van a poder ser accedidas por
//  los componentes que inyecten esta dependencia.
// Esto es cómodo, pero muy problemático. Una cosa es que un hijo directo pueda leer este valor, lo cual no
//  no generaría un inconveniente. 
// Pero otra cosa muy distinta es que un descendiente *modifique* este valor. Si dejamos que los componentes
//  descendientes puedan modificar el valor, esto se vuelve muy propenso a que se comentan errores, 
//  introduciendo bugs, que luego van a ser un dolor de cabeza rastrear.
// En su lugar, se suele preferir que si mandamos un dato, se mande como "solo lectura" (que podemos usar
//  la función readonly() de Vue).
// Si necesitamos que los componentes descendientes puedan modificar la data, entonces lo recomendable es
//  compartir funciones que sirvan como intermediarios para hacer estos cambios. El concepto es muy similar
//  a la idea de setters y getters en programación orientada a objetos.
function setFeedback(newFeedback) {
    feedback.value = {
        // ...newFeedback,
        message: newFeedback.message,
        title: newFeedback.title,
        type: newFeedback.type,
        icon: newFeedback.icon,
    }
}

// En vez de usar un string como key, siempre es más recomendable usar un Symbol.
// provide('globalFeedback', {
provide(PROVIDE_GLOBAL_FEEDBACK_KEY, {
    // feedback,
    setFeedback,
});

// # Versión del feedback usando emisión de eventos.
// function changeFeedback(newFeedback) {
//     feedback.value = {
//         ...newFeedback,
//     }
// }

// Podríamos usar provide / inject para compartir entre todos los componentes de la aplicación el estado del usuario
// autenticado.
// const { user } = useAuthUserState();

// provide(PROVIDE_AUTH_USER_KEY, {
//     user: readonly(user),
// });
</script>

<template>
    <MainNav />
    <div class="container mx-auto p-4">
        <NotificationBox
            v-if="feedback.message"
            :content="feedback"
            @close="() => feedback.message = null"
        >
            <template v-slot:header>
                <h2 class="pb-2 mb-4 border-b text-2xl">{{ feedback.title }}</h2>
            </template>
        </NotificationBox>

        <!-- # Versión del feedback usando emisión de eventos. -->
        <!-- <router-view 
            @changeFeedback="changeFeedback"
        /> -->

        <router-view />
    </div>
    <footer class="flex justify-center items-center h-25 bg-slate-800 text-white">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>