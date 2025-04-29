/*
Archivo del router de nuestra aplicación.
*/
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import GlobalChat from '../pages/GlobalChat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import { subscribeToAuth } from '../services/auth';
import MyProfile from '../pages/MyProfile.vue';

// Definimos las rutas de nuestra aplicación.
// Los campos "meta" de las rutas aceptan un objeto con cualquier dato. Ese dato va a quedar asociado a la ruta.
// No hay ningún dato preexistente en "meta", los inventan a voluntad.
const routes = [
    { path: '/',                component: Home, },
    { path: '/ingresar',        component: Login, },
    { path: '/registro',        component: Register, },
    { path: '/chat-global',     component: GlobalChat,      meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',       component: MyProfile,       meta: { requiresAuth: true, }, },
];

// Creamos el router.
// Para crear el router, necesitamos pasarle 2 cosas:
// 1. La propiedad "routes" con el array de rutas.
// 2. La propiedad "history". Puede ser una instancia de createWebHistory o createWebHashHistory.
//  createWebHistory() funciona con URLs "limpias". Es decir, URLs que no tienen el "#".
//  createWebHashHistory() arma el historia y las rutas como "anclas" de la página. Es decir, agrega adelante de la
//      ruta un "#". Por ejemplo, "https://sara.za/#/chat-global".
const router = createRouter({
    routes, // routes: routes,
    history: createWebHistory(),
});

// Nos suscribimos a la autenticación.
let user = {
    id: null,
    email: null,
}
subscribeToAuth(newUserData => user = newUserData);

// Agregamos un "guard" global para nuestro router.
router.beforeEach((to, from) => {
    // El parámetro "to" que definimos va a tener el objeto de la ruta a la que se está tratando de ingresar.
    // Mientras que "from" contiene la data del objeto de la ruta de la que provenimos.
    // console.log("From: ", from);
    // console.log("To: ", to);

    // Si la ruta requiere que el usuario esté autenticado, y no lo está, entonces lo "pateamos" al login.
    if(to.meta.requiresAuth && user.id === null) {
        // Retornamos la URL a donde lo queremos mandar.
        return '/ingresar';
    }
});

// Finalmente, exportamos el router.
export default router;