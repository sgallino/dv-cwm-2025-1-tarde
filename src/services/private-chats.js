import supabase from "./supabase";

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<number>}
 */
async function getPrivateChat(sender_id, receiver_id) {
    // Buscamos el chat privado.
    let chat_id = await fetchPrivateChat(sender_id, receiver_id);

    // Si no existe, entonces lo creamos.
    if(!chat_id) {
        chat_id = await createPrivateChat(sender_id, receiver_id);
    }

    return chat_id;
}

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns 
 */
async function fetchPrivateChat(sender_id, receiver_id) {
    // Nos aseguramos de que los ids queden ordenados de menor a mayor.
    const userIds = [sender_id, receiver_id].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .select('id')
        .eq('user_id1', userIds[0])
        .eq('user_id2', userIds[1]);

    if(error) {
        console.error('[private-chats.js getPrivateChat] Error al traer el chat privado: ', error);
        throw error;
    }

    // Noten que hacemos un encadenamiento opcional, ya que data[0] puede ser undefined.
    return data[0]?.id;
}

/**
 * Crea una conversación privada entre los usuarios.
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<number>}
 */
async function createPrivateChat(sender_id, receiver_id) {
    // Nos aseguramos de que los ids queden ordenados de menor a mayor.
    const userIds = [sender_id, receiver_id].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: userIds[0],
            user_id2: userIds[1],
        })
        // Haciendo el select() después del insert() nos trae el registro que se haya insertado.
        // En este caso, lo necesitamos para el id que haya generado.
        .select();
    
    if(error) {
        console.error('[private-chats.js createPrivateChat] Error al crear el chat privado: ', error);
        throw error;
    }
    
    // Retornamos el id del chat.
    return data[0].id;
}

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @param {string} body 
 */
export async function sendPrivateChatMessage(sender_id, receiver_id, body) {
    const chat_id = await getPrivateChat(sender_id, receiver_id);

    const { error } = await supabase
        .from('private_messages')
        .insert({
            chat_id,
            sender_id, 
            body,
        });
}

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @param {() => {}} callback 
 */
export async function subscribeToPrivateChatMessages(sender_id, receiver_id, callback) {
    const chat_id = await getPrivateChat(sender_id, receiver_id);

    const privateChannel = supabase.channel('private_chats');

    privateChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages',
            // Filtramos para solo recibir mensajes del chat privado en el que estamos participando.
            filter: 'chat_id=eq.' + chat_id,
        },
        payload => {
            callback(payload.new);
        }
    );
    privateChannel.subscribe();

    // TODO: Cargar los mensajes iniciales del chat. Estilizar el chat. Optimizar para no buscar el id del chat una y 
    // otra vez. Unsubscribe y limpieza de recursos.
}