<script>
// Dentro de la etiqueta <script> de los componentes de Vue, si usamos la Option API, necesitamos siempre exportar un
// objeto con la configuración del componente.

// Si queremos usar otros componentes, primero necesitamos importarlos.
// Si estamos usando la Options API, necesitamos además de importar el componente, declararlo en el objeto exportado.
// Los componentes importados correctamente, se pueden utilizar como etiquetas en el <template>.
import Home from './pages/Home.vue';

export default {
    // name permite configurar el nombre del componente. Es opcional.
    name: 'App',
    // components lleva un objeto con los componentes que se van a utilizar en este componente.
    components: { Home },
}
</script>

<template>
    <!-- 
    Hay varias convenciones comunes en las clases de Tailwind:
    - Hay ciertas clases que solo llevan como nombre el valor del estilo. Por ejemplo, las clases para "display".
        Si queremos un:
            display: flex           => flex
            display: block          => block
            display: inline-block   => inline-block
    - La mayoría de las clases se componen de al menos 2 partes: nombre-valor
        Por ejemplo: margin, padding, background, gap, color (text-), etc.
        Si queremos un:
            margin: 1rem            => m-4
            padding-top: .5rem      => pt-2
            background-color: #fff  => bg-white
    - Hay ciertos estilos que tienen una lista default de posibles valores aceptados.
        Por ejemplo: font-size (text-), justify-contents (justify-), etc.
        Si queremos un:
            margin: 1rem            => m-4
            padding-top: .5rem      => pt-2
            background-color: #fff  => bg-white
    -->
    <nav class="flex gap-8 p-4 bg-slate-300">
        <a class="text-lg" href="#">DV Social</a>
        <ul class="flex gap-4">
            <li>
                <!-- <RouterLink to="/">Home</RouterLink> -->
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/chat-global">Chat Global</router-link>
            </li>
            <li>
                <router-link to="/ingresar">Iniciar Sesión</router-link>
            </li>
            <li>
                <router-link to="/registro">Registrarse</router-link>
            </li>
        </ul>
    </nav>
    <div class="container mx-auto p-4">
        <router-view />
        <!-- <RouterView /> -->
    </div>
    <footer class="flex justify-center items-center h-25 bg-slate-800 text-white">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>