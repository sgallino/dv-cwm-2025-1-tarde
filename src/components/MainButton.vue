<template>
    <!-- TODO: Resolver :D
        Prueben de permitir que el botón acepte una propiedad "color" (ej: blue, green, red) o "type" 
        (primary, success, error), y que los colores del botón se ajusten dependiendo del valor de la propiedad. 
    -->
    <button
        type="submit"
        class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 text-white"
    >
        <slot />
    </button>
</template>