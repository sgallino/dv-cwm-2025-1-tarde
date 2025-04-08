// La carpeta "services" para a contener todos los servicios que vamos a crear para el proyecto.
// Los servicios son bibliotecas que ofrecen alguna funcionalidad.
// Esta, por ejemplo, va a definir simplemente la conexión con Supabase para que otros servicios la puedan consumir.
import { createClient } from '@supabase/supabase-js';

// Reemplacen con las claves de su proyecto :)
const SUPABASE_PROJECT = "https://gpnfhvwrhphkcxhsdqaz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbmZodndyaHBoa2N4aHNkcWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDI4NjYsImV4cCI6MjA1OTcxODg2Nn0.njLRkjK9-tFHEqzfQTF-aFxTcK559lBNVsGHrweSWA8";
const supabase = createClient(SUPABASE_PROJECT, SUPABASE_KEY);

// Exportamos la conexión al cliente de Supabase.
export default supabase;