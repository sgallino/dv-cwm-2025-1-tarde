import supabase from "./supabase";

/**
 * 
 * @param {{id: string, email: string|null, bio: string|null, career: string|null}} data 
 */
export async function addUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert({
            ...data
        });
    
    if(error) {
        console.error('[user-profile.js addUserProfile] No se pudo crear el perfi: ', error);
        
        throw new Error('No se pudo crear el perfil:' + error);
    }
}

/**
 * 
 * @param {string} id 
 * @param {{career: string|null, bio: string|null, display_name: string|null}} data 
 */
export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update({...data})
        .eq('id', id);
    
    if(error) {
        console.error('[user-profile.js updateUserProfile] No se pudo editar el perfil: ', error);
        
        throw new Error('No se pudo editar el perfil:' + error);
    }
}

/**
 * 
 * @param {string} id El UUID del usuario del que se quiere pedir.
 * @returns {Promise<{id: string|null, email: string|null}>}
 */
export async function getUserProfileByPK(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id);

    if(error) {
        console.error('[user-profile.js getUserProfileByPK] No se pudo traer el perfil, ya que hay uno o más errores en el valor recibido.', error);
        
        throw new Error('No se pudo traer el perfil, ya que hay uno o más errores en el valor recibido.' + error);
    }

    // Siempre que hacemos un select de Supabase se nos retorna un array como resultado, indistintamente de si hay
    // uno o más resultados.
    // Si sabemos, como en este caso, que solo puede llegar un único resultado como respuesta, entonces podemos
    // hard-codear la posición 0 del array.
    return data[0];
}