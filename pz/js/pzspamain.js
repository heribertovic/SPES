// js/comunes/pzspamain.js

/**
 * Cambia la vista activa de la Single Page Application (SPA).
 * Oculta todas las vistas con la clase 'spa-view' y muestra la vista especificada.
 *
 * @param {string} viewId - El ID de la vista que se desea activar (ej: 'vista-inicio-pz', 'vista-tienda-pz', 'vista-resumendepago-pz').
 */
function mostrarVistaSPA(viewId) {
    const vistas = document.querySelectorAll('.spa-view');
    let vistaEncontrada = false;

    vistas.forEach(vista => {
        if (vista.id === viewId) {
            vista.classList.add('active-spa-view');
            vista.scrollIntoView({ behavior: 'smooth', block: 'start' });
            vistaEncontrada = true;

            // Llama a la función para actualizar el contenido del resumen de pago
            if (viewId === 'vista-resumendepago-pz') {
                if (typeof actualizarVistaResumenPago === 'function') {
                    actualizarVistaResumenPago();
                } else {
                    console.warn("La función 'actualizarVistaResumenPago' no está definida.");
                }
            }

        } else {
            vista.classList.remove('active-spa-view');
        }
    });

    if (!vistaEncontrada) {
        // Opcional: Manejar el caso de una vista no encontrada, por ejemplo, redirigir a inicio
        console.warn(`Vista con ID "${viewId}" no encontrada. Redirigiendo a la vista de inicio.`);
        // Si la vista no se encuentra y viewId no es ya 'vista-inicio-pz', redirigimos.
        if (viewId !== 'vista-inicio-pz') {
            mostrarVistaSPA('vista-inicio-pz');
        }
        return; // Salir para evitar actualizar el hash a una vista inexistente
    }

    // --- IMPORTANTE: Actualizar el hash de la URL para la persistencia ---
    // Asegurarse de que el hash tenga el formato '#vista-ID'
    if (window.location.hash !== `#${viewId}`) {
        history.pushState(null, '', `#${viewId}`);
    }
}

// Función para adjuntar el listener a un botón específico
// 'type': 'spa' para vistas SPA, 'scroll' para desplazamiento interno
// 'targetId': El ID de la vista SPA o de la sección a la que se hará scroll
function attachButtonListener(buttonId, type, targetId) {
    const buttonElement = document.getElementById(buttonId);
    if (buttonElement && !buttonElement.hasAttribute('data-listener-attached')) {
        buttonElement.addEventListener('click', (event) => {
            event.preventDefault(); // ¡Crucial para evitar la navegación por href!

            if (type === 'spa') {
                mostrarVistaSPA(targetId);
            } else if (type === 'scroll') {
                // Determina a qué vista pertenece la sección de scroll
                let parentViewId;
                if (targetId === 'divsomos' || targetId === 'servicio' || targetId === 'footer') {
                    parentViewId = 'vista-inicio-pz'; // Estas secciones están en la vista de inicio
                }
                // Si agregas más secciones de scroll en otras vistas, añade más condiciones aquí.
                // else if (targetId === 'otra-seccion-en-otra-vista') {
                //     parentViewId = 'otra-vista-spa';
                // }

                if (parentViewId) {
                    // Primero, asegúrate de que la vista principal esté activa
                    mostrarVistaSPA(parentViewId);

                    // Luego, con un pequeño retraso, haz scroll a la sección.
                    // El retraso es importante para permitir que la vista se muestre completamente.
                    setTimeout(() => {
                        const targetSection = document.getElementById(targetId);
                        if (targetSection) {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            // Opcional: Actualizar el hash de la URL para que el navegador recuerde la posición
                            if (window.location.hash !== `#${targetId}`) {
                                history.pushState(null, '', `#${targetId}`);
                            }
                        } else {
                            console.warn(`Sección de scroll con ID "${targetId}" no encontrada.`);
                        }
                    }, 100); // Pequeño retraso para que la vista se cargue
                } else {
                    // Si no se puede determinar la vista padre, se intenta el scroll directo (comportamiento original)
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        if (window.location.hash !== `#${targetId}`) {
                            history.pushState(null, '', `#${targetId}`);
                        }
                    } else {
                        console.warn(`Sección de scroll con ID "${targetId}" no encontrada o no asociada a una vista SPA conocida.`);
                    }
                }

            } else {
                console.warn(`Tipo de listener desconocido para el botón "${buttonId}": ${type}`);
            }
        });
        buttonElement.setAttribute('data-listener-attached', 'true'); // Marca el botón para evitar duplicados
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. --- Cargar datos del localStorage ANTES de determinar la vista ---
    // Es crucial que el carrito y otros datos estén disponibles antes de que se intente renderizar cualquier vista.
    if (typeof cargarCarritoDesdeLocalStorage === 'function') {
        cargarCarritoDesdeLocalStorage();
    } else {
        console.warn("La función 'cargarCarritoDesdeLocalStorage' no está disponible. Asegúrate de que tienda.js se cargue antes.");
    }
    if (typeof cargarEstadoRedesDesdeLocalStorage === 'function') { // Asegúrate de tener esta función en tienda.js
        cargarEstadoRedesDesdeLocalStorage();
    } else {
        console.warn("La función 'cargarEstadoRedesDesdeLocalStorage' no está disponible.");
    }

    // 2. --- Determinar la vista inicial basándose en el hash de la URL ---
    const initialHash = window.location.hash.substring(1); // Elimina el '#' inicial
    if (initialHash) {
        // Pequeño retraso para asegurar que todos los elementos HTML estén completamente cargados
        // (Aunque DOMContentLoaded ya debería manejar esto, un tiny delay puede ayudar con contenido muy dinámico)
        setTimeout(() => {
            if (initialHash.startsWith('vista-')) { // Convención: Vistas SPA empiezan con 'vista-'
                mostrarVistaSPA(initialHash);
            } else { // Si no es una vista SPA, es una sección de scroll
                const targetSection = document.getElementById(initialHash);
                if (targetSection) {
                    // Mostrar la vista principal si no es una SPA pero queremos el scroll
                    mostrarVistaSPA('vista-inicio-pz'); // O la vista que contenga esta sección
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Si el hash no corresponde a una vista válida ni a una sección, ir a la vista por defecto
                    mostrarVistaSPA('vista-inicio-pz');
                }
            }
        }, 50); // Reducido el tiempo de espera
    } else {
        // Si no hay hash en la URL, muestra la vista de inicio por defecto
        mostrarVistaSPA('vista-inicio-pz');
    }


    // --- Lógica para Observar y Adjuntar Listeners a Botones Dinámicos ---
    const setupListeners = () => {
        // === BOTONES QUE ACTIVAN VISTAS SPA ===
        attachButtonListener('headerlogotipoa', 'spa', 'vista-inicio-pz'); // Logotipo siempre va a inicio SPA
        attachButtonListener('btninicio', 'spa', 'vista-inicio-pz');       // Botón "Inicio" del menú va a inicio SPA
        attachButtonListener('btntienda', 'spa', 'vista-tienda-pz');       // Botón "Tienda" del menú va a Tienda SPA
        attachButtonListener('botonComprar', 'spa', 'vista-resumendepago-pz'); // Botón "Comprar" va a Resumen de Pago SPA

        // === BOTONES QUE HACEN SCROLL A SECCIONES INTERNAS ===
        attachButtonListener('btnsomos', 'scroll', 'divsomos');            // Botón "¿Quiénes somos?" hace scroll a #divsomos
        attachButtonListener('btnservicios', 'scroll', 'servicio');        // Botón "Servicios" hace scroll a #servicio
        attachButtonListener('btncontactos', 'scroll', 'footer');          // Botón "Contactos" ahora hace scroll a #footer
    };

    // Observador para detectar cuando los elementos del menú son inyectados en el DOM
    const observer = new MutationObserver((mutationsList) => {
        setupListeners();
        // Lógica para enlaces con 'data-target-view'
        document.querySelectorAll('[data-target-view]:not([data-listener-attached])').forEach(enlace => {
            enlace.addEventListener('click', (event) => {
                event.preventDefault();
                const targetViewId = enlace.getAttribute('data-target-view');
                if (targetViewId) {
                    mostrarVistaSPA(targetViewId);
                } else {
                    console.warn(`El enlace con data-target-view no tiene un valor válido:`, enlace);
                }
            });
            enlace.setAttribute('data-listener-attached', 'true');
        });
    });

    // Empezar a observar el <body> para cambios en sus hijos y sub-árboles
    observer.observe(document.body, { childList: true, subtree: true });

    // Intentar configurar los listeners una vez al inicio también, por si los elementos ya están presentes
    setupListeners();


    // --- Lógica para el manejo del hash en la URL (al cambiar manualmente el hash o usar atrás/adelante) ---
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1); // Elimina el '#' inicial
        if (hash) {
            if (hash.startsWith('vista-')) {
                mostrarVistaSPA(hash);
            } else {
                const targetSection = document.getElementById(hash);
                if (targetSection) {
                    // Si se cambia el hash a una sección, nos aseguramos de que la vista principal sea la de inicio
                    // o la vista que contenga esa sección si es una SPA más compleja
                    // Para tu caso, si navegas a #footer, es probable que quieras la vista de inicio visible.
                    mostrarVistaSPA('vista-inicio-pz'); 
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn(`Hash inválido o sección no encontrada en la URL: #${hash}`);
                    mostrarVistaSPA('vista-inicio-pz'); // Volver a inicio si el hash es inválido
                }
            }
        } else {
            // Si el hash se elimina (ej. volviendo a la raíz), vuelve a la vista de inicio SPA
            mostrarVistaSPA('vista-inicio-pz');
        }
    });

    // Nota: La lógica para manejar la vista inicial al cargar la página ya se movió al inicio del DOMContentLoaded.
});