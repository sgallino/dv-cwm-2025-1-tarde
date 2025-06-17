import supabase from "./supabase";

/**
 * Sube el [file] con el [name] al [bucket].
 * 
 * @param {string} name 
 * @param {File} file 
 * @param {string} bucket Default: 'avatars'
 */
export async function uploadFile(name, file, bucket = 'avatars') {
    const { data, error } = await supabase.storage.from(bucket).upload(name, file);

    if(error) {
        console.error('[storage.js uploadFile] Error al subir el archivo: ', error);
        throw error;
    }

    console.log("🗄 Archivo subido con éxito: ", data);
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 */
export async function deleteFile(filename, bucket = 'avatars') {
    const { data, error } = await supabase.storage.from(bucket).remove([filename]);
    // console.log("Data: ", data, filename)

    if(error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string} HTML pública del [filename].
 */
export function getFileURL(filename, bucket = 'avatars') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return data.publicUrl;
}