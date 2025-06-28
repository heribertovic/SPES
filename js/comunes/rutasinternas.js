// RUTAS INTERNAS

// js/comunes/rutasinternas.js

window.addEventListener('load', function () {

// hermano anterior - beforebegin
// hermano siguiente - afterend

// primer hjo - afterbegin
// ultimo hijo - beforeend

// SELECT HEAD
const head = document.head; 

    function updateOrCreateLink(selector, attributes, parentElement = document.head) {
        let element = document.querySelector(selector);
        
        if (element) {
            for (const key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
        } else {
            element = document.createElement('link');
            for (const key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
            parentElement.appendChild(element);
        }
        return element;
    }

// RUTA CSS
const currentPath = window.location.pathname;
const pageTitle = document.querySelector('head title');
const currentTitle = pageTitle ? pageTitle.textContent : '';

let cssHref;
let faviconHref; 
let logotipoSrc;

const isTiendaPage = currentPath.endsWith('/pz/html/tienda.html');
const isPzPage = currentPath.endsWith('/pz/pz.html');
const isIndexPage = currentPath.endsWith('/index.html');

if (isTiendaPage) {
    cssHref = "../css/tienda.css";          
    logotipoSrc = "../img/pz_imagotipo.svg"; 
} else if (isPzPage) {
    cssHref = "css/pzspa.css";              
    logotipoSrc = "img/pz_imagotipo.svg";   
} else if (isIndexPage) {
    cssHref = "css/index.css";              
    logotipoSrc = "img/SPES_Imagotipo.svg"; 
} else {
    cssHref = "css/index.css";
    logotipoSrc = "img/SPES_Imagotipo.svg";
}

if (currentTitle === 'PubliZoom') {
    if (isTiendaPage) {
        faviconHref = "../img/pz_favicon.ico"; 
    } else if (isPzPage) {
        faviconHref = "img/pz_favicon.ico"; 
    }
    else {
        faviconHref = "pz/img/pz_favicon.ico"; 
    }
} else if (currentTitle === 'SPES') {
    if (isTiendaPage) {
        faviconHref = "../../img/SPES_favicon.ico"; 
    } else if (isPzPage) {
        faviconHref = "../img/SPES_favicon.ico"; 
    } else {
        faviconHref = "img/SPES_favicon.ico"; 
    }
} else {
    if (isTiendaPage) {
        faviconHref = "../../img/SPES_favicon.ico"; 
    } else if (isPzPage) {
        faviconHref = "../img/SPES_favicon.ico"; 
    } else {
        faviconHref = "img/SPES_favicon.ico"; 
    }
}

// Este selector buscará específicamente un link rel="stylesheet" que contenga 'index.css' o 'tienda.css' en su href.
// Esto es para asegurar que solo tu CSS principal sea modificado por este script,
// sin tocar el link de Font Awesome que tienes en tu HTML estático.
updateOrCreateLink('link[rel="stylesheet"][href*="index.css"], link[rel="stylesheet"][href*="tienda.css"]', {
    rel: "stylesheet",
    type: "text/css",
    href: cssHref
});

// RUTA FAVICON
updateOrCreateLink('link[rel="icon"]', {
    rel: "icon",
    href: faviconHref
});

const logotipoElement = document.querySelector('.headerlogotipoah1img');
if (logotipoElement && logotipoSrc) {
    logotipoElement.src = logotipoSrc;
}


});