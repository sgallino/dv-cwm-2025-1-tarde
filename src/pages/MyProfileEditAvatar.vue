<script setup>
import { onUnmounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import { updateAuthAvatar } from '../services/auth';

const { data, updating, handleFileChange, handleSubmit } = useAvatarUploadForm();

function useAvatarUploadForm() {
    const data = ref({
        file: null, // El objeto File en sí.
        objectURL: null, // El ObjectURL para el preview de la imagen.
    });
    const updating = ref(false);

    async function handleSubmit() {
        try {
            // Si no hay un archivo, o ya se está subiendo, no hacemos nada.
            // TODO: Manejar cada caso por separado, para mostrar un mensaje de feedback en el primer escenario.
            if(!data.value.file || updating.value) return;

            updating.value = true;
            await updateAuthAvatar(data.value.file);
        } catch (error) {
            // TODO...
        }
        updating.value = false;
    }

    /**
     * Lee el valor del campo de texto.
     * Guarda el archivo seleccionado, si existe, en data.file, y su previsualización en data.objectURL.
     */
    async function handleFileChange(event) {
        // ¿Cómo leemos el contenido de un input file?
        // Los inputs file tienen una propiedad llamada "files" que contiene un "FileList". En esencia, un array de
        // objetos File.
        // File es una clase nativa de JS que representa un archivo.
        // Como nuestro input file no tiene el atributo "multiple", solo permite elegir un único archivo, así que podemos
        // hard-codear que queremos la posición 0.
        const selectedFile = event.target.files[0];

        // Verificamos que haya un archivo.
        if(!selectedFile) return;

        // Si hay un archivo previo previsualizado, entonces primero limpiamos ("revocamos") el anterior.
        // Esto es muy importante.
        if(data.value.objectURL) {
            URL.revokeObjectURL(data.value.objectURL);
        }

        // Guardamos el objeto File en data.
        data.value.file = selectedFile;
        // Generamos un "ObjectURL" para la previsualización del archivo.
        // Un "ObjectURL" es una clase de JS que hace un referencia a un recurso en la memoria que contiene el archivo 
        // de la PC del usuario.
        // Esta referencia incluye una URL local en el browser que permite "ver" o "acceder" al contenido del archivo.
        // Por ejemplo, se puede usar para asignarlo al "src" de una etiqueta <img>.
        data.value.objectURL = URL.createObjectURL(data.value.file);
    }

    // Al desmontar el componente, limpiamos el ObjectURL del archivo previsualizado, si existe.
    // Como dijimos antes, esto es muy importante.
    // Los ObjectURLs mantienen cargada en la memoria el recurso que están referenciado. Por ejemplo, la imagen
    // seleccionada.
    // Cada ObjectURL se asocia al "document" de la página. Es decir, que hasta que no refresquemos la página o nos
    // vayamos, JS no podría recolectar la basura (garbage collect) de este ObjectURL. Y por lo tanto, no puede liberar
    // la memoria.
    // En aplicaciones SPAs, donde no refrescamos normalmente la pantalla, si no revocamos manualmente los ObjectURLs,
    // vamos a tener una "memory leak".
    // Para revocar el ObjectURL, usamos la función URL.revokeObjectURL().
    onUnmounted(() => {
        if(data.value.objectURL) {
            URL.revokeObjectURL(data.value.objectURL);
        }
    });

    return {
        data,
        updating,
        handleFileChange,
        handleSubmit,
    }
}
</script>

<template>
    <MainH1>Editar mi imagen de perfil</MainH1>

    <form 
        action="#"
        class="flex gap-4"
        @submit.prevent="handleSubmit"
    >
        <div class="w-1/2">
            <div class="mb-2">
                <MainLabel for="avatar">Nueva imagen</MainLabel>
                <!-- 
                En un input de tipo "file" no podemos usar v-model.
                La razón es que v-model genera, por definición, un "two-way data binding". Esto es, que la "única fuente
                de verdad" del valor del campo sería una referencia de Vue.
                El framework se encarga de asignar al input el valor que tenga la referencia, así como actualizar la
                referencia cuando el valor del input cambia.
                Los inputs de tipo "file" son de solo lectura. Es decir, *no podemos* asignarle valores al campo, ni
                por HTML ni por JS.

                En su lugar, necesitamos manejarlo más "manualmente", utilizando el evento change del input.
                -->
                <input
                    @change="handleFileChange"
                    type="file"
                    id="avatar"
                    class="w-full px-4 py-2 border border-gray-400 rounded"
                >
            </div>
            <MainButton>Cambiar imagen</MainButton>
        </div>
        <div class="w-1/2">
            <img
                v-if="data.objectURL"
                :src="data.objectURL"
                alt=""
            >
        </div>
    </form>
</template>