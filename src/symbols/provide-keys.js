/*
# Symbol
JavaScript tiene un tipo de dato llamado "Symbol".
Un Symbol representa un valor único e irrepetible en la ejecución del programa.

Se crean usando la función Symbol().
Cuando creamos un Symbol, vamos a querer siempre guardarlo en una variable para poder usarlo en distintos lugares.
De lo contrario, nunca más vamos a poder referenciar al Symbol creado.

Opcionalmente, se le puede pasar un parámetro a Symbol() con una descripción que queramos asociar.
Esto es solo para fines de depuración. No tiene impacto en cómo funciona el Symbol().
*/
export const PROVIDE_GLOBAL_FEEDBACK_KEY = Symbol('global-feedback'); // Noten que no es una instanciación. No hay "new".
export const PROVIDE_AUTH_USER_KEY = Symbol('auth-user');