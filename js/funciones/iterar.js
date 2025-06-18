// PASO 1 - AGREGAR CADENA DE DATOS.
            // Este paso se agrega de manera externa.

// PASO 2 - ELEGIR NOMBRE DE LA FUNCION Y BUSCAR EL CONTENEDOR PRIMERO CON UN ID EN EL DOCUMENTO (DINÁMICO).
function crearEInsertarElementoDinamico(configuracionElemento, datosParaIterar) {

    const selectContenedorPrimero = document.getElementById(configuracionElemento.idContenedorPrincipal);

    if (!selectContenedorPrimero) {
        console.error(`Error: El contenedor principal con ID '${configuracionElemento.idContenedorPrincipal}' no fue encontrado.`);
        return;
    }

// PASO 3 - CREAR CONTENEDOR SEGUNDO DE LOS ELEMENTOS INTERNOS (ÚNICO).
    const contenedorSegundo = document.createElement('div');
    contenedorSegundo.className = "contendorsegundo";
    selectContenedorPrimero.appendChild(contenedorSegundo);

    const fragmentoDeElementos = document.createDocumentFragment();

// PASO 4 - ITERAR SOBRE LOS DATOS QUE RECIBIÓ LA FUNCIÓN Y CREAR CONTENEDOR TERCERO (REPETIBLE).
    datosParaIterar.forEach(itemDeDatos => {
        const contenedorTercero = document.createElement(itemDeDatos.etiqueta);

        // Aplica la clase o ID al nuevo elemento.
        if (itemDeDatos.selector.startsWith('.')) {
            contenedorTercero.className = itemDeDatos.selector.substring(1);
        } else if (itemDeDatos.selector.startsWith('#')) {
            contenedorTercero.id = itemDeDatos.selector.substring(1);
        } else {
            contenedorTercero.className = itemDeDatos.selector; // En caso de que sea solo un nombre sin prefijo
        }

        // Configura el contenido y atributos según el tipo de etiqueta.
        if (itemDeDatos.etiqueta === 'a') {
            contenedorTercero.href = itemDeDatos.vinculo;
            contenedorTercero.textContent = itemDeDatos.texto;
            contenedorTercero.target = "_blank";
        } else if (itemDeDatos.etiqueta === 'img') {
            contenedorTercero.src = itemDeDatos.vinculo;
            contenedorTercero.alt = itemDeDatos.texto;
        } else if (itemDeDatos.etiqueta === 'p') {
            contenedorTercero.textContent = itemDeDatos.texto;
        }

        fragmentoDeElementos.appendChild(contenedorTercero);
    });

    contenedorSegundo.appendChild(fragmentoDeElementos);
}
