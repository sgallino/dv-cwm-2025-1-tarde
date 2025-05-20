<!-- <script>
export default {
    name: 'MainButton',
    props: {
        type: {
            type: String,
            default: 'primary',
        },
    },
    // Las propiedades computadas son valores que se generan a partir de otros valores.
    // Son similares, conceptualmente, a una función, pero con el beneficio de que el resultado se cachea automáticamente,
    // y la función solo se reejecuta cuando alguna de las dependencias cambia.
    computed: {
        colorClasses() {
            switch(this.type) {
                case 'error':
                    return 'bg-red-600 hover:bg-red-500 focus:bg-red-500';

                case 'success':
                    return 'bg-green-600 hover:bg-green-500 focus:bg-green-500';
                
                default:
                    return 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500';
            }
        }
    }
}
</script> -->
<script setup>
import { computed } from 'vue';

// Para declarar y recibir las propiedades que un componente acepta, tenemos que usar la "macro" defineProps().
const props = defineProps({
    type: {
        type: String,
        default: 'primary',
    }
});

// Para las propiedadas computadas, usamos la función del core de Vue "computed()", que recibe un callback con la
// lógica que le corresponde.
const colorClasses = computed(() => {
    // Noten que las "props" no son "refs", por lo que no llevan el ".value".
    switch(props.type) {
        case 'error':
            return 'bg-red-600 hover:bg-red-500 focus:bg-red-500';

        case 'success':
            return 'bg-green-600 hover:bg-green-500 focus:bg-green-500';
        
        default:
            return 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500';
    }
});
</script>

<template>
    <!-- 
    Por cómo funciona internamente el motor de Tailwind, solo detecta clases que estén escritas en su totalidad en el
    código.
    Es decir, clases como: bg-blue-600

    Pero no puede detectar clases que generemos dinámicamente.
    Por ejemplo, Tailwind es incapaz de detectar esta clase:
        const color = 'blue';
        const className = 'bg-' + color + '-600'; // Esto genera la misma clase que arriba, pero Tailwind no lo entiende.

    Si tratamos de armar, entonces, clases de manera dinámica, puede suceder que no las veamos en la página reflejada.
    Tailwind genera el CSS a medida de lo que usemos. Es decir, solo agrega las clases que ve que estamos usando.

    Para poder usar clase dinámicas, tenemos que asegurarnos que figuren escritas en su totalidad. O, en su defecto,
    dejar indicado en Tailwind que la clase se agreguen se necesiten o no.
    -->
    <button
        type="submit"
        :class="`transition px-4 py-2 rounded ${colorClasses} text-white`"
    >
        <slot />
    </button>
</template>