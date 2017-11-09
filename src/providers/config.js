/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export const DEV_MODE = false;

// Produccion:
//
export const URL_BASE = DEV_MODE    ? "http://192.168.2.73/"                       : "https://fluzfluz.co/" ;
export const WS_BASE  = DEV_MODE    ? "http://192.168.2.73/override/app/services/" : "https://fluzfluz.co/override/app/services/";
export const WS_BASE_IMG = DEV_MODE ? "http://192.168.2.73/img/profile-images/"    : "https://fluzfluz.co/img/profile-images/" ;

// Faber PC:
//
//export let URL_BASE = "http://192.168.2.72/";
//export let WS_BASE = "http://192.168.2.72/override/app/services/";


// Localhost:
//
//export let URL_BASE = "http://fluzfluzweb.localhost/";
//export let WS_BASE = "http://fluzfluzweb.localhost/override/app/services/";


// Desarrollo:
//
//export const URL_BASE = "http://fluzfluzdev.com/";
//export const WS_BASE = "http://fluzfluzdev.com/override/app/services/";


// Produccion:
//
//export const URL_BASE = "https://fluzfluz.co/";
//export const WS_BASE = "https://fluzfluz.co/override/app/services/";





// REST de los los indicativos telefónicos.

export const URL_BASE_COUNTRY_CODE = "https://restcountries.eu/rest/v2";


// Variables de configuración: 
// 
//  Valor de cada Fluz
    export const FLUZ_VALUE = 25;


// 
// Mostrar los ahorros en toda la tienda.
export const SHOW_SAVINGS = false;

// Mostrar las categorias: 
//   1 - Mostar 1 por fila apaisado.
//   2 - Mostar 2 por fila mosaico.
export const SHOW_HOME_CATEGORY = 1;


// Mostrar las opciones de usuario en la vista Más
export const SHOW_MORE_OPTIONS = false;


// Mostrar los botones refinar:
export const SHOW_REFINE_BUTTONS = false;


// Mostar Fluz últimos 30 días.
export const SHOW_LASTED_FLUZ = false;


//  Mapas: 
// 
//  Ubicación de desarrollo:
    export const DEV_UBICATION = DEV_MODE ? true : false;
//    export const DEV_UBICATION = true;
    
//  
//  
//  Product Page:
    export const SHOW_MAP_PRODUCT_PAGE = false;
    
//  Google Analytics
    export const TRACKER_ID = 'UA-79675815-4';
    export const TRACKER_INTERVAL = 10;


//  Redemption Value:
    export const REDEMPTION_MIN_VALUE = 100000;

// Login
    export const URL_RECOVER_PASSWORD = URL_BASE+'es/recuperacion-contrasena';


//// Facebook
//    const provider = new Facebook({
//      clientId: 143791919684903,
//      appScope: ["email"],
//      redirectUri: string,
//      responseType: string,
//      authType: string
//    });

// Google Plus