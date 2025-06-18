let carrito = [];
let exchangeRateUSDToDOP = 0;

const SERVICIOS_PUBLICACION = [
  "Publicación de Imagen.",
  "Publicación Video.",
  "Crear Redes Sociales." // ¡AGREGADO AQUÍ para aplicar la lógica de redes sociales!
];

const SERVICIOS_CON_DESCUENTO_POR_CANTIDAD = [
  "Publicación de Imagen.",
  "Publicación Video.",
  "Fotografía de Producto.",
  "Grabación de Audiovisuales.",
  "Asesorias presenciales."
];

function esServicioDePublicacion(nombreServicio) {
  return SERVICIOS_PUBLICACION.includes(nombreServicio);
}

function aplicaDescuentoPorCantidad(nombreServicio) {
  return SERVICIOS_CON_DESCUENTO_POR_CANTIDAD.includes(nombreServicio);
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
    } else {
      exchangeRateUSDToDOP = 59.20;
    }
  } catch (error) {
    exchangeRateUSDToDOP = 59.20;
  }
  actualizarCarrito();
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('publizoomCarrito', JSON.stringify(carrito));
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
  }
  const estadoRedesGuardado = localStorage.getItem('publizoomEstadoRedes');
  if (estadoRedesGuardado) {
    const estadoRedes = JSON.parse(estadoRedesGuardado);
    const checkboxesRedes = document.querySelectorAll('#listaRedesSociales input[type="checkbox"]');
    checkboxesRedes.forEach(checkbox => {
      if (estadoRedes[checkbox.id] !== undefined) {
        checkbox.checked = estadoRedes[checkbox.id];
      }
    });
  }
  actualizarCarrito();
}

function agregarAlCarrito(boton) {
  const servicioDiv = boton.closest('.sectservicio');
  const nombre = servicioDiv.dataset.nombre;
  const precio = parseFloat(servicioDiv.dataset.precio) || 0;
  const minimo = parseInt(servicioDiv.dataset.minimo) || 1;

  const servicioExistente = carrito.find(item => item.nombre === nombre);

  if (servicioExistente) {
    if (nombre !== "Crear Redes Sociales.") {
        servicioExistente.cantidad++;
    } else {
        alert("El servicio 'Crear Redes Sociales' solo se puede agregar una vez.");
        return;
    }
  } else {
    const cantidadInicial = (nombre === "Crear Redes Sociales.") ? 1 : minimo;
    const servicio = { nombre, precio, cantidad: cantidadInicial, minimo: minimo };
    carrito.push(servicio);
  }
  guardarCarritoEnLocalStorage();
  actualizarCarrito();
}

function actualizarCarrito() {
  const itemsCarritoUl = document.getElementById('itemsCarrito');
  const subtotalCarritoRDSpan = document.getElementById('subtotalCarrito');
  const impuestoCarritoRDSpan = document.getElementById('impuestoCarrito');
  const descuentoCarritoRDSpan = document.getElementById('descuentoCarrito');
  const totalCarritoRDSpan = document.getElementById('totalCarrito');
  const totalaPagarCarritoRDSpan = document.getElementById('totalaPagarCarrito');
  const totalCarritoUSDSpan = document.getElementById('totaldolorCarritoUSD');

  const mensajeCarritoVacio = document.getElementById('mensajeCarritoVacio');
  const alertaRedesSociales = document.getElementById('alertaRedesSociales');
  const botonComprar = document.getElementById('botonComprar');

  let subtotalBruto = 0;
  let subtotalConAjustesYDescuentos = 0;
  let totalDescuentoRealAplicado = 0;

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
    botonComprar.classList.remove('disabled');
    botonComprar.style.pointerEvents = 'auto';
    checkboxesRedes.forEach(checkbox => {
      checkbox.checked = false;
    });
    subtotalCarritoRDSpan.textContent = '0.00';
    impuestoCarritoRDSpan.textContent = '0.00';
    descuentoCarritoRDSpan.textContent = '0.00';
    totalCarritoRDSpan.textContent = '0.00';
    totalaPagarCarritoRDSpan.textContent = '0.00';
    if (totalCarritoUSDSpan) {
      totalCarritoUSDSpan.textContent = '0.00';
    }
    guardarCarritoEnLocalStorage();
  } else {
    mensajeCarritoVacio.style.display = 'none';

    carrito.forEach((item, index) => {
      const precioItemBruto = item.precio * item.cantidad;
      subtotalBruto += precioItemBruto;

      let costoItemSoloRedesAplicadas = precioItemBruto;
      let descuentoSoloRedes = 0;
      
      if (esServicioDePublicacion(item.nombre)) {
        hayServiciosDePublicacionEnCarrito = true;
        if (redesSeleccionadasCount > 0) {
            let costoAcumuladoPorRedesParaUnServicio = 0;
            let precioUnitarioBaseRed = item.precio;
            
            const costoBrutoPorRedesSiNoHubieraDescuento = precioUnitarioBaseRed * redesSeleccionadasCount;

            let costoConDescuentoCascadaRedes = 0;
            let precioTemporalPorRed = precioUnitarioBaseRed;
            for (let i = 0; i < redesSeleccionadasCount; i++) {
                costoConDescuentoCascadaRedes += precioTemporalPorRed;
                precioTemporalPorRed *= 0.80;
            }

            costoItemSoloRedesAplicadas = costoConDescuentoCascadaRedes * item.cantidad;
            descuentoSoloRedes = (costoBrutoPorRedesSiNoHubieraDescuento - costoConDescuentoCascadaRedes) * item.cantidad;

        } else {
            costoItemSoloRedesAplicadas = 0;
            descuentoSoloRedes = precioItemBruto;
        }
      }

      let costoFinalDelItemConTodosLosAjustes = costoItemSoloRedesAplicadas;
      let descuentoSoloCantidad = 0;
      
      if (aplicaDescuentoPorCantidad(item.nombre) && item.cantidad > 0) {
          let precioUnitarioParaCantidad = costoItemSoloRedesAplicadas / item.cantidad;
          costoFinalDelItemConTodosLosAjustes = 0;
          for (let i = 0; i < item.cantidad; i++) {
              costoFinalDelItemConTodosLosAjustes += precioUnitarioParaCantidad * Math.pow(0.95, i);
          }
          descuentoSoloCantidad = costoItemSoloRedesAplicadas - costoFinalDelItemConTodosLosAjustes;
      }
      
      subtotalConAjustesYDescuentos += costoFinalDelItemConTodosLosAjustes;
      totalDescuentoRealAplicado += (descuentoSoloRedes + descuentoSoloCantidad);

      const li = document.createElement('li');
      li.className = 'licaritem';

      const disableQuantityInput = (item.nombre === "Crear Redes Sociales.") ? 'disabled' : '';

      li.innerHTML = `
        <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${index})">X</button>
        <input type="number" min="${item.minimo || 1}" value="${item.cantidad}"
               onchange="actualizarCantidad(${index}, this.value)" ${disableQuantityInput}>
        <span>${item.nombre}</span>
        <span class="preciototal-car">RD$${precioItemBruto.toFixed(2)}</span>
      `;
      itemsCarritoUl.appendChild(li);
    });

    let shouldDisableBuyButton = false;
    if (hayServiciosDePublicacionEnCarrito && redesSeleccionadasCount === 0) {
      alertaRedesSociales.style.display = 'block';
      shouldDisableBuyButton = true;
    } else {
      alertaRedesSociales.style.display = 'none';
    }

    if (shouldDisableBuyButton) {
      botonComprar.classList.add('disabled');
      botonComprar.style.pointerEvents = 'none';
    } else {
      botonComprar.classList.remove('disabled');
      botonComprar.style.pointerEvents = 'auto';
    }
  }

  const IVATasa = 0.18;
  const impuestoCalculado = subtotalBruto * IVATasa;

  const totalFinalaPagar = subtotalConAjustesYDescuentos + impuestoCalculado;

  subtotalCarritoRDSpan.textContent = subtotalBruto.toFixed(2);
  descuentoCarritoRDSpan.textContent = Math.abs(totalDescuentoRealAplicado).toFixed(2);
  impuestoCarritoRDSpan.textContent = impuestoCalculado.toFixed(2);
  totalCarritoRDSpan.textContent = subtotalConAjustesYDescuentos.toFixed(2);
  totalaPagarCarritoRDSpan.textContent = totalFinalaPagar.toFixed(2);

  if (totalCarritoUSDSpan) {
    if (exchangeRateUSDToDOP > 0) {
      const totalUSD = totalFinalaPagar / exchangeRateUSDToDOP; // Usar exchangeRateUSDToDOP
      totalCarritoUSDSpan.textContent = totalUSD.toFixed(2);
    } else {
      totalCarritoUSDSpan.textContent = 'Cargando...';
    }
  }
}

function actualizarCantidad(index, nuevaCantidad) {
  nuevaCantidad = parseInt(nuevaCantidad);
  const item = carrito[index];
  const minimo = item.minimo || 1;

  if (item.nombre === "Crear Redes Sociales.") {
      item.cantidad = 1;
      alert("La cantidad para 'Crear Redes Sociales' no se puede modificar.");
  } else if (isNaN(nuevaCantidad) || nuevaCantidad < minimo) {
    alert(`La cantidad mínima para "${item.nombre}" es ${minimo}.`);
    item.cantidad = minimo;
  } else {
    item.cantidad = nuevaCantidad;
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
  guardarCarritoEnLocalStorage();
  actualizarCarrito();
}

function imprimirCarrito() {
    window.print();
}

window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidad = actualizarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.imprimirCarrito = imprimirCarrito;

document.addEventListener('DOMContentLoaded', () => {
  cargarCarritoDesdeLocalStorage();
  fetchExchangeRate();

  const checkboxesRedes = document.querySelectorAll('#listaRedesSociales input[type="checkbox"]');
  checkboxesRedes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      guardarCarritoEnLocalStorage();
      actualizarCarrito();
    });
  });
});