import supabase from './supabase';

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

// TODO: Traer los mensajes que hay grabados para mostrarlos en pantalla, y agregar la "escucha" en tiempo real de los
// mismos.