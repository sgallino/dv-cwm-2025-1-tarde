import { getFileURL, uploadFile } from "./storage";
import supabase from "./supabase";
import { addUserProfile, getUserProfileByPK, updateUserProfile } from "./user-profile";

/*
    # Patrón de diseño: Observer
    El patrón Observer define una relación de uno a muchos, donde muchos elementos del sistema (ej: clases, funciones,
    módulos, etc) necesitan saber de los cambios ocurridos en otro elemento (ej: clases, funciones, variables, etc).

    Esos muchos elementos que "observan" al otro se conocen como "observers", y al elemento que es observado se
    lo llama "subject".

    En este contexto, el subject suele necesitar llevar una lista de los observers que están interesados en los
    cambios que pueda tener. De manera tal que cada vez que ocurra un cambio, el subject puede notificar a todos
    sus observers.
    Por su parte, cada observer debe indicar su deseo de enterarse de los cambios del subject. Esto se hace a través
    de un proceso que llamamos "suscripción" (subscribe), aunque también lo pueden ver mencionado como "escuchar" 
    (listen) u "observer" (watch).

    Un observer suele ser o una instancia de una clase (si trabajamos con OOP) o puede ser una función.
    Como no estamos usando OOP, en nuestro los observers van a ser callbacks (funciones).


    Vamos a implementar el patrón Observer para permitir a todos los componentes o módulos de nuestro sistema que 
    se enteren de los cambios del estado de autenticación, sin que necesiten comunicarse entre ellos o preguntarle
    a Supabase directamente.
*/

// Definimos una variable para los datos del usuario, que serían nuestro "subject".
let user = {
    id: null,
    email: null,
    bio: null,
    display_name: null,
    career: null,
}
// Definimos un array para la lista de observers.
let observers = [];

// Invocamos la carga del usuario actual inmediatamente.
loadCurrentUser();

// Preguntamos si hay un usuario autenticado en nuestras credenciales locales. Si lo hay, lo marcamos como autenticado.
// Esto no reemplaza la verificación posterior que hace Supabase, sino que es simplemente para facilitar el reload de
// la web.
if(localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
}

/**
 * 
 */
async function loadCurrentUser() {
    const { data } = await supabase.auth.getUser();

    // Si no hay un usuario, retornamos null.
    if(!data?.user) return null;

    // Actualizamos los datos del usuario, y notificamos a los observers.
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

    // Cargamos el perfil del usuario. Esto lo dejamos corriendo en paralelo (noten que no está el await).
    loadCurrentUserProfile();
}

/**
 * Carga el perfil extendido del usuario autenticado.
 */
async function loadCurrentUserProfile() {
    try {
        const profile = await getUserProfileByPK(user.id);
        
        updateUser({
            ...profile,
        });
    } catch (error) {
        console.error('[auth.js loadCurrentUserProfile] Error al obtener el perfil del usuario: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
export async function register(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email, 
        password,
    });

    if(error) {
        console.error('[auth.js register] Error al registrarse: ', error);
        throw error;
    }

    // Creamos el perfil del usuario.
    try {
        await addUserProfile({
            // Al perfil del usuario le pasamos el id del usuario que se acaba de crear.
            id: data.user.id,
            email,
        });
    } catch (error) {
        console.error('[auth.js register] Error al crear el perfil del usuario: ', error);
        
    }

    // Actualizamos los datos del usuario, y notificamos a los observers.
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

    return data.user;
}

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw error;
    }

    // Actualizamos los datos del usuario, y notificamos a los observers.
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

    // Cargamos el resto del perfil.
    loadCurrentUserProfile();

    return data.user;
}

export async function logout() {
    supabase.auth.signOut();

    // Vaciamos el usuario.
    updateUser({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });
    // user = {
    //     id: null,
    //     email: null,
    // }
    // notifyAll();
}

/**
 * Actualiza el perfil del usuario autenticado.
 * 
 * @param {{bio: string|null, career: string|null, display_name: string|null}} data 
 */
export async function updateAuthProfile(data) {
    try {
        await updateUserProfile(user.id, { ...data });
        updateUser(data);
    } catch (error) {
        console.error('[auth.js updateAuthProfile] Error al actualizar el perfil del usuario autenticado: ', error);
        throw error;
    }
}

export async function updateAuthAvatar(file) {    
    try {
        // Generamos un nombre para la foto.
        // Queremos que tenga el formato de:
        //      {userId}/{fileName}
        // Para el fileName vamos a querer crear un nombre único. Por ejemplo, usando la función crypt.randomUUID();
        const name = `${user.id}/${crypto.randomUUID()}.jpg`; // TODO: Contemplar otras extensiones.
        await uploadFile(name, file);
        // Obtenemos la URL pública del archivo y la guardamos en el perfil del usuario.
        await updateAuthProfile({
            photo: getFileURL(name),
        });
        // TODO: Eliminar la foto vieja, si corresponde.
    } catch (error) {
        console.error('[auth.js updateAuthAvatar] Error al actualizar la imagen de perfil del usuario autenticado: ', error);
        throw error;
    }
}

/*--------------------------------------------------------------------
| Métodos del observer
+---------------------------------------------------------------------*/
/**
 * Registra un "observer" que será notificado con los datos del usuario cada vez que el estado de autenticación, o los
 * datos del usuario, cambien.
 * Retorna una función para cancelar la suscripción.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToAuth(callback) {
    // Guardamos el observer en el array.
    observers.push(callback);

    // console.log('[auth.js subscribeToAuth] Observer agregado. El stack actual es: ', observers);

    // Notificamos al observer de los datos actuales.
    notify(callback);

    return () => {
        // Para limpiar el observer, nos quedamos con la lista de observers removiendo el que acabamos de pushear.
        observers = observers.filter(obs => obs !== callback);
        
        // console.log('[auth.js unsubscribe] Removiendo un observer del stack. El stack actual queda: ', observers);
    }
}

/**
 * Ejecuta un "observer" para notificarle el estado del usuario actual.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */
function notify(callback) {
    // Invocamos el observer, y le pasamos una copia de los datos del objeto "user".
    callback({...user});
}

/**
 * Notifica a todos los observers del estado actual del "user".
 * La idea es que cada vez que "user" cambie, se notifique a todos los observers.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/**
 * Actualiza la data del usuario con la info provista, y notifica a todos los observers.
 * 
 * @param {{id: string|null, email: string|null}} data 
 */
function updateUser(data) {
    user = {
        ...user,
        ...data,
    }
    if(user.id !== null) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
    notifyAll();
}