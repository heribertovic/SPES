// TIENDA articulos y carro
window.carrito = [];
let exchangeRateUSDToDOP = 0;

let esMonedaDOP = false; 

let estaEnModoMovil = window.innerWidth <= 1000;
let carritoEstaAbiertoEnMovil = false; 

const SERVICIOS_PUBLICACION = [
    "Publicación de Imagen.",
    "Publicación Video.",
    "Crear Redes Sociales."
];

const SERVICIOS_CON_DESCUENTO_POR_CANTIDAD = [
    "Publicación de Imagen.",
    "Publicación Video.",
    "Fotografía de Producto.",
    "Grabación de Audiovisuales.",
    "Asesorias presenciales."
];

// *NUEVA* lista de servicios a los que aplica la nota de "cubiertas durante un mes"
const SERVICIOS_CUBIERTOS_POR_MES = [
    "Publicación de Imagen.",
    "Publicación Video.",
    "Fotografía de Producto.",
    "Grabación de Audiovisuales."
];


const SERVICIOS_CANTIDAD_FIJA_UNO = [
    "Crear Redes Sociales.",
    "Desarrollo de Marca."
];

const IVATasa = 0.18; 
const DEFAULT_EXCHANGE_RATE = 59.20; 

function esServicioDePublicacion(nombreServicio) {
    return SERVICIOS_PUBLICACION.includes(nombreServicio);
}

function aplicaDescuentoPorCantidad(nombreServicio) {
    // Excluir "Voz Comercial." de los servicios que aplican descuento por cantidad
    return SERVICIOS_CON_DESCUENTO_POR_CANTIDAD.includes(nombreServicio) && nombreServicio !== 'Voz Comercial.';
}

function esServicioCantidadFijaUno(nombreServicio) {
    return SERVICIOS_CANTIDAD_FIJA_UNO.includes(nombreServicio);
}

function calcularCostoFinalItem(item, redesSeleccionadasCount) {
    const precioUnitarioBaseDOP = item.precio; 
    const costoBasePorItemYCantidad = precioUnitarioBaseDOP * item.cantidad; // Costo original del ítem (precio unitario * cantidad)

    let costoParaMostrar = costoBasePorItemYCantidad; // Valor por defecto para preciototal-car

    let descuentoRedesSocialesAplicado = 0;
    let descuentoAplicadoPorCantidad = 0;
    let costoFinalCalculado = costoBasePorItemYCantidad; // Partimos del costo base para el cálculo final

    // 1. Ajuste del precio base si es un servicio de publicación
    if (esServicioDePublicacion(item.nombre)) {
        if (redesSeleccionadasCount > 0) {
            // El costo total del ítem (precio unitario * cantidad) se multiplica por la cantidad de redes
            costoParaMostrar = costoBasePorItemYCantidad * redesSeleccionadasCount;
            costoFinalCalculado = costoParaMostrar; // El costo final también parte de este valor
            
            // Si hay más de una red social, aplicar descuento en cascada del 20%
            if (redesSeleccionadasCount > 1) {
                let costoParaAplicarDescuentoRedes = costoBasePorItemYCantidad; // Para calcular el descuento acumulativo
                
                for (let i = 2; i <= redesSeleccionadasCount; i++) {
                    let descuentoActualPorRed = costoParaAplicarDescuentoRedes * 0.20; // 20% del valor actual
                    descuentoRedesSocialesAplicado += descuentoActualPorRed;
                    costoParaAplicarDescuentoRedes -= descuentoActualPorRed; // Aplicar descuento para la siguiente iteración
                }
            }
            // Si no hay redes seleccionadas para un servicio de publicación, el costo es 0
        } else {
            costoParaMostrar = 0;
            costoFinalCalculado = 0;
            // El descuento de redes sociales será igual al costo base, porque el precio se reduce a 0.
            // Opcional: descuentoRedesSocialesAplicado = costoBasePorItemYCantidad; // Depende si esto se considera "descuento" o "precio es 0"
        }
    }

    // Ahora, aplicar los descuentos al costoFinalCalculado
    costoFinalCalculado -= descuentoRedesSocialesAplicado;

    // 2. Cálculo del Descuento en Cascada por Cantidad (si aplica)
    // Se verifica que el servicio aplica descuento por cantidad (excluyendo 'Voz Comercial.')
    if (aplicaDescuentoPorCantidad(item.nombre)) { 
        if (item.cantidad >= 2) {
            let descuentoPrimerNivel = costoFinalCalculado * 0.05;
            costoFinalCalculado -= descuentoPrimerNivel;
            descuentoAplicadoPorCantidad += descuentoPrimerNivel;
        }
        if (item.cantidad >= 3) {
            let descuentoSegundoNivel = costoFinalCalculado * 0.05;
            costoFinalCalculado -= descuentoSegundoNivel;
            descuentoAplicadoPorCantidad += descuentoSegundoNivel;
        }
    }
    
    return {
        costoParaMostrar: costoParaMostrar, // Refleja precio * cantidad * redes sociales
        costoFinalConDescuentos: costoFinalCalculado, // Costo con ambos descuentos aplicados
        descuentoPorCantidad: descuentoAplicadoPorCantidad,
        descuentoPorRedesSociales: descuentoRedesSocialesAplicado
    };
}


async function fetchExchangeRate() {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.usd && data.usd.dop) {
            exchangeRateUSDToDOP = data.usd.dop;
            // console.log(`Tasa de cambio USD a DOP obtenida: ${exchangeRateUSDToDOP}`); // Línea comentada/eliminada
        } else {
            exchangeRateUSDToDOP = DEFAULT_EXCHANGE_RATE;
            console.warn("No se pudo obtener la tasa de cambio de la API, usando valor por defecto: " + DEFAULT_EXCHANGE_RATE);
        }
    } catch (error) {
        exchangeRateUSDToDOP = DEFAULT_EXCHANGE_RATE;
        console.error("Error al obtener la tasa de cambio, usando valor por defecto: " + DEFAULT_EXCHANGE_RATE, error);
    }
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('publizoomCarrito', JSON.stringify(carrito));
    localStorage.setItem('publizoomMonedaActual', esMonedaDOP ? 'DOP' : 'USD'); 

    const checkboxesRedes = document.querySelectorAll('#listaRedesSociales input[type="checkbox"]');
    const estadoRedes = {};
    checkboxesRedes.forEach(checkbox => {
        estadoRedes[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('publizoomEstadoRedes', JSON.stringify(estadoRedes));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('publizoomCarrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        carrito.forEach(item => {
            if (esServicioCantidadFijaUno(item.nombre)) {
                item.cantidad = 1;
                item.minimo = 1;
            }
        });
    }

    const monedaGuardada = localStorage.getItem('publizoomMonedaActual');
    esMonedaDOP = (monedaGuardada === 'DOP'); 
}

// --- NUEVA FUNCIÓN PARA CARGAR EL ESTADO DE LAS REDES SOCIALES ---
// Se hace global para que pzspamain.js pueda llamarla.
window.cargarEstadoRedesDesdeLocalStorage = function() {
    const estadoRedesGuardado = localStorage.getItem('publizoomEstadoRedes');
    if (estadoRedesGuardado) {
        try {
            const estadoRedes = JSON.parse(estadoRedesGuardado);
            const checkboxesRedes = document.querySelectorAll('#listaRedesSociales input[type="checkbox"]');
            checkboxesRedes.forEach(checkbox => {
                if (estadoRedes.hasOwnProperty(checkbox.id)) {
                    checkbox.checked = estadoRedes[checkbox.id];
                }
            });
        } catch (e) {
            console.error("Error al parsear el estado de redes del localStorage:", e);
            // Si los datos están corruptos, podrías considerar eliminarlos para evitar problemas futuros
            // localStorage.removeItem('publizoomEstadoRedes'); 
        }
    }
};
// --- FIN NUEVA FUNCIÓN ---


function agregarAlCarrito(boton) {
    const servicioDiv = boton.closest('.sectservicio');
    const nombre = servicioDiv.dataset.nombre;
    const precio = parseFloat(servicioDiv.dataset.precio) || 0; 

    const servicioExistente = carrito.find(item => item.nombre === nombre);

    if (esServicioCantidadFijaUno(nombre)) {
        if (servicioExistente) {
            alert(`El servicio '${nombre}' ya está en tu carrito y solo se puede agregar una vez.`);
            return;
        } else {
            const servicio = { nombre, precio, cantidad: 1, minimo: 1 };
            carrito.push(servicio);
        }
    } else {
        if (servicioExistente) {
            servicioExistente.cantidad++;
        } else {
            const minimo = parseInt(servicioDiv.dataset.minimo) || 1;
            const servicio = { nombre, precio, cantidad: minimo, minimo: minimo };
            carrito.push(servicio);
        }
    }

    guardarCarritoEnLocalStorage();
    actualizarCarrito(); 
}

function formatCurrency(value) {
    if (esMonedaDOP) {
        return `RD$${value.toFixed(2)}`;
    } else {
        const finalExchangeRate = exchangeRateUSDToDOP === 0 ? DEFAULT_EXCHANGE_RATE : exchangeRateUSDToDOP;
        const valueUSD = value / finalExchangeRate;
        return `US$${valueUSD.toFixed(2)}`;
    }
}

function actualizarPreciosServiciosIniciales() {
    const servicios = document.querySelectorAll('.sectservicio');
    servicios.forEach(servicioDiv => {
        const precioParrafo = servicioDiv.querySelector('.precioservicio');
        if (precioParrafo) {
            const precioBaseDOP = parseFloat(servicioDiv.dataset.precio) || 0;
            precioParrafo.innerHTML = `<b>Precio: ${formatCurrency(precioBaseDOP)}</b>`;
        }
    });
}


function actualizarCarrito() {
    const itemsCarritoUl = document.getElementById('itemsCarrito');
    const subtotalBrutoOriginalSpan = document.getElementById('subtotalCarrito'); 
    const impuestoCarritoRDSpan = document.getElementById('impuestoCarrito');
    const descuentoCarritoRDSpan = document.getElementById('descuentoCarrito');
    const totalConDescuentoSpan = document.getElementById('totalCarrito'); 
    const totalaPagarCarritoRDSpan = document.getElementById('totalaPagarCarrito');

    const mensajeCarritoVacio = document.getElementById('mensajeCarritoVacio');
    const alertaRedesSociales = document.getElementById('alertaRedesSociales');
    const botonComprar = document.getElementById('botonComprar');
    const divRedesCarrito = document.getElementById('divRedesCarrito');

    let subtotalParaMostrar = 0; // Suma de costoParaMostrar para 'subtotalCarrito'
    let subtotalDespuesDeDescuentosEIVA = 0; // Suma de costoFinalConDescuentos para 'totalConDescuento'
    let totalDescuentoAplicado = 0; // Suma de todos los descuentos (cantidad + redes)

    let hayServiciosDePublicacionEnCarrito = false;
    let redesSeleccionadasCount = 0;
    const checkboxesRedes = document.querySelectorAll('#listaRedesSociales input[type="checkbox"]');

    checkboxesRedes.forEach(checkbox => {
        if (checkbox.checked) {
            redesSeleccionadasCount++;
        }
    });

    itemsCarritoUl.innerHTML = '';

    if (carrito.length === 0) {
        mensajeCarritoVacio.style.display = 'block';
        alertaRedesSociales.style.display = 'none';
        
        // --- INICIO DE CAMBIO ---
        // Aquí es donde necesitamos apagar el botón.
        botonComprar.classList.add('disabled'); // Añade la clase 'disabled'
        botonComprar.style.pointerEvents = 'none'; // Deshabilita los eventos de clic
        // --- FIN DE CAMBIO ---

        subtotalBrutoOriginalSpan.textContent = formatCurrency(0); 
        impuestoCarritoRDSpan.textContent = formatCurrency(0);
        descuentoCarritoRDSpan.textContent = formatCurrency(0);
        totalConDescuentoSpan.textContent = formatCurrency(0);
        totalaPagarCarritoRDSpan.textContent = formatCurrency(0);
        guardarCarritoEnLocalStorage();

        if (divRedesCarrito) {
            divRedesCarrito.style.display = 'none';
        }

    } else {
        mensajeCarritoVacio.style.display = 'none';

        carrito.forEach((item, index) => {
            if (esServicioDePublicacion(item.nombre)) {
                hayServiciosDePublicacionEnCarrito = true;
            }

            const calculoItem = calcularCostoFinalItem(item, redesSeleccionadasCount);
            
            subtotalParaMostrar += calculoItem.costoParaMostrar; 
            subtotalDespuesDeDescuentosEIVA += calculoItem.costoFinalConDescuentos; 
            totalDescuentoAplicado += calculoItem.descuentoPorCantidad + calculoItem.descuentoPorRedesSociales; 

            const li = document.createElement('li');
            li.className = 'licaritem';

            const disableQuantityInput = esServicioCantidadFijaUno(item.nombre) ? 'disabled' : '';
            const inputMinValue = esServicioCantidadFijaUno(item.nombre) ? 1 : (item.minimo || 1);
            const inputValue = esServicioCantidadFijaUno(item.nombre) ? 1 : item.cantidad;

            li.innerHTML = `
                <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${index})">X</button>
                <input type="number" min="${inputMinValue}" value="${inputValue}"
                             onchange="actualizarCantidad(${index}, this.value)" ${disableQuantityInput}>
                <span>${item.nombre}</span>
                <span class="preciototal-car">${formatCurrency(calculoItem.costoParaMostrar)}</span>
            `;
            itemsCarritoUl.appendChild(li);
        });

        let shouldDisableBuyButton = false;
        if (hayServiciosDePublicacionEnCarrito) {
            if (divRedesCarrito) {
                divRedesCarrito.style.display = 'block';
            }

            if (redesSeleccionadasCount === 0) {
                alertaRedesSociales.style.display = 'block';
                shouldDisableBuyButton = true;
            } else {
                alertaRedesSociales.style.display = 'none';
            }
        } else {
            if (divRedesCarrito) {
                divRedesCarrito.style.display = 'none';
            }
            alertaRedesSociales.style.display = 'none';
        }

        // Esta sección ya estaba correcta para habilitar/deshabilitar según redes sociales
        if (shouldDisableBuyButton) {
            botonComprar.classList.add('disabled');
            botonComprar.style.pointerEvents = 'none';
        } else {
            botonComprar.classList.remove('disabled');
            botonComprar.style.pointerEvents = 'auto';
        }
    }

    subtotalBrutoOriginalSpan.textContent = formatCurrency(subtotalParaMostrar); 
    
    const impuestoCalculado = subtotalDespuesDeDescuentosEIVA * IVATasa; 
    const totalFinalaPagar = subtotalDespuesDeDescuentosEIVA + impuestoCalculado; 

    descuentoCarritoRDSpan.textContent = formatCurrency(Math.abs(totalDescuentoAplicado)); 
    impuestoCarritoRDSpan.textContent = formatCurrency(impuestoCalculado);
    totalConDescuentoSpan.textContent = formatCurrency(subtotalDespuesDeDescuentosEIVA); 
    totalaPagarCarritoRDSpan.textContent = formatCurrency(totalFinalaPagar);

    actualizarPreciosServiciosIniciales();
}

function actualizarCantidad(index, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    const item = carrito[index];

    if (esServicioCantidadFijaUno(item.nombre)) {
        item.cantidad = 1;
        alert(`La cantidad para '${item.nombre}' no se puede modificar y siempre es 1.`);
    } else {
        const minimo = item.minimo || 1;
        if (isNaN(nuevaCantidad) || nuevaCantidad < minimo) {
            alert(`La cantidad mínima para "${item.nombre}" es ${minimo}.`);
            item.cantidad = minimo;
        } else {
            item.cantidad = nuevaCantidad;
        }
    }
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    document.querySelectorAll('#listaRedesSociales input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    localStorage.removeItem('publizoomEstadoRedes'); // También limpia el estado de las redes en localStorage
    guardarCarritoEnLocalStorage(); // Esto guardará un carrito vacío y el estado de moneda actual
    actualizarCarrito();
}

function imprimirCarrito() {
    alert("La función de impresión ha sido pospuesta para este proyecto o requiere la configuración CSS adicional.");
    console.warn("Función imprimirCarrito: La implementación actual requiere configuración CSS para imprimir solo el carrito.");
}

function alternarMonedaDesdeInput() {
    const inputMoneda = document.getElementById('inputDeMoneda');
    if (inputMoneda) {
        esMonedaDOP = !inputMoneda.checked; 
        guardarCarritoEnLocalStorage();
        actualizarCarrito(); 
    }
}

function actualizarEstadoInputMoneda() {
    const inputMoneda = document.getElementById('inputDeMoneda');
    if (inputMoneda) {
        inputMoneda.checked = !esMonedaDOP; 
    }
}

window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidad = actualizarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.imprimirCarrito = imprimirCarrito;

document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage();
    window.cargarEstadoRedesDesdeLocalStorage();

    fetchExchangeRate().then(() => {
        actualizarCarrito(); 
        actualizarEstadoInputMoneda();
    });

    const checkboxesRedes = document.querySelectorAll('#listaRedesSociales input[type="checkbox"]');
    checkboxesRedes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            guardarCarritoEnLocalStorage();
            actualizarCarrito();
        });
    });

    const divcar = document.getElementById('divcar'); 
    const abrirCarritoBtn = document.getElementById('abrir'); 
    const cerrarCarritoBtn = document.getElementById('cerrarcar'); 

    function toggleCarritoEnMovil() {
        if (divcar) {
            if (carritoEstaAbiertoEnMovil) {
                divcar.classList.remove('carrito-abierto-movil');
                carritoEstaAbiertoEnMovil = false;
            } else {
                divcar.classList.add('carrito-abierto-movil');
                carritoEstaAbiertoEnMovil = true;
            }
        }
    }

    if (abrirCarritoBtn) {
        abrirCarritoBtn.addEventListener('click', (event) => {
            if (estaEnModoMovil) {
                toggleCarritoEnMovil();
            }
        });
    }

    if (cerrarCarritoBtn) {
        cerrarCarritoBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (estaEnModoMovil) {
                toggleCarritoEnMovil();
            }
        });
    }

    function manejarVisibilidadCarrito() {
        estaEnModoMovil = window.innerWidth <= 1000;

        if (divcar) {
            if (estaEnModoMovil) {
                if (!carritoEstaAbiertoEnMovil) {
                    divcar.classList.remove('carrito-abierto-movil');
                } else {
                    divcar.classList.add('carrito-abierto-movil');
                }
            } else {
                divcar.classList.remove('carrito-abierto-movil');
                carritoEstaAbiertoEnMovil = false;
            }
        }
    }

    manejarVisibilidadCarrito();
    window.addEventListener('resize', manejarVisibilidadCarrito);

    const inputMoneda = document.getElementById('inputDeMoneda');
    if (inputMoneda) {
        inputMoneda.addEventListener('change', alternarMonedaDesdeInput);
    }
});