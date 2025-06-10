import supabase from './supabase';

// Versión definitiva: Usando Postgres
/**
 * Retorna los últimos mensajes del chat, ordenados de manera descendente.
 */
export async function getLastMessages() {
    const { data, error } = await supabase
        .from('global_chat')
        // Pedimos traer todos los campos de la tabla.
        .select('*')
        .order('created_at', {ascending: false})
        .limit(10); // Limitamos a los últimos 10.

    if(error) {
        console.error('[global-chat.js getLastMessages] Error al traer los mensajes: ', error);
        throw error;
    }

    // console.log("[global-chat.js getLastMessages] Data de los mensajes: ", data);
    data.reverse();
    return data;
}

/**
 * Se suscribe para recibir los nuevos mensajes.
 * 
 * @param {(object) => void} callback 
 */
export async function subscribeToGlobalChatNewMessages(callback) {
    // Acá como canal podemos poner lo que queramos, en nuestro caso, usamos el nombre de la *tabla*.
    const chatChannel = supabase.channel('global_chat');
    // Configuramos el listener con el método "on()".
    chatChannel.on(
        'postgres_changes',
        {
            schema: 'public', // Aclaramos a qué schema pertenece la tabla.
            table: 'global_chat', // Aclaramos la tabla.
            // En la API "postgres_changes" los eventos están prestablecidos. Pueden ser:
            // *    Todos
            // INSERT
            // UPDATE
            // DELETE
            event: 'INSERT', // Escuchamos los nuevos mensajes que se inserten.
        },
        // La propiedad con los datos del nuevo mensaje es "new".
        data => {
            // console.log("¡Nuevo mensaje! Data: ", data);
            
            callback(data.new);
        },
    );
    // Nos suscribimos al canal.
    chatChannel.subscribe();
}

/**
 * Graba un mensaje de chat público en nuestra base de datos.
 * 
 * @param {{email: string, body: string}} data 
 */
export async function saveGlobalChatMessage(data) {
    const { error } = await supabase
        // El método 'from' permite interactuar con una tabla de la base de datos.
        // Es necesario que la tabla tenga debidamente configurado el RLS para que esto funcione.
        .from('global_chat')
        .insert({
            ...data,
        });

    // Las peticiones a la base de datos retornan una Promise que se resuelve con un objeto que contiene una propiedad
    // "error", que indica si ocurrió algún error.
    if(error) {
        throw new Error(error);
    }
}
/*
// Versión con la API de "Broadcast" de Realtime de Supabase.
// La API de Broadcast trabaja comunicando mensajes a todos los usuarios que estén conectados a un determinado canal.
// Podemos crear cualquier "canal" (channel), usando el nombre que queramos, con la excepción de "realtime".
const globalChatChannel = supabase.channel('global-chat', {
    // Podemos agregar esta opción para que nosotros podamos recibir nuestras propias emisiones.
    config: {
        broadcast: { 
            self: true,
        },
    },
});

export async function subscribeToGlobalChatNewMessages(callback) {
    // Para poder ser notificados de nuevos mensajes, Broadcast trabaja con un modelo de eventos, que es una 
    // implementación del patrón de diseño "Observer".
    // Al igual que sucede con los eventos de JS, tenemos que pasar a "escuchar" el evento que es emitido en un canal.
    // El método on(), que sirve para este fin, recibe 3 parámetros:
    // 1. String. El tipo del evento.
    // 2. Object. Los detalles del evento que queremos escuchar.
    // 3. Function. Un callback a ejecutar cada vez que llegue un nuevo evento. Esta función va a recibir un objeto con
    //  los datos.
    globalChatChannel.on(
        'broadcast',
        // El nombre del evento, en la API de Broadcast, puede ser el que queramos. Debe coincidir con el nombre del
        // evento donde mandemos el mensaje.
        { event: 'new-message' },
        // Ejecutamos el callback que recibimos por parámetro pasándole la "carga" (payload) que contiene los datos
        // del nuevo mensaje.
        data => callback(data.payload),
    );
    // El "on()" es un método de configuración. Nos falta suscribirnos ahora al canal, con el método "subscribe()".
    globalChatChannel.subscribe();
}

export async function saveGlobalChatMessage(data) {
    // send(), que emite un mensaje en el canal, recibe un objeto como parámetro.
    // Retorna una Promise.
    globalChatChannel.send({
        // El tipo de API de Realtime que queremos usar.
        type: 'broadcast',
        // En el tipo "broadcast", el evento puede ser el que quieran.
        event: 'new-message',
        // Pasamos algunos datos asociados al mensaje emitido.
        payload: {
            ...data,
        }
    });
}*/