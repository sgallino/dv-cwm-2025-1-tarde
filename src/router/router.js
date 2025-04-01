/*
Archivo del router de nuestra aplicación.
*/
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import GlobalChat from '../pages/GlobalChat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

// Definimos las rutas de nuestra aplicación.
const routes = [
    { path: '/',                component: Home, },
    { path: '/chat-global',     component: GlobalChat, },
    { path: '/ingresar',        component: Login, },
    { path: '/registro',        component: Register, },
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

// Finalmente, exportamos el router.
export default router;