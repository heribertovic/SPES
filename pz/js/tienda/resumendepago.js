// pz/js/tienda/resumendepago.js

// Asegúrate de que tienda.js se cargue ANTES de este archivo para que formatCurrency y calcularCostoFinalItem estén disponibles.

window.actualizarVistaResumenPago = function() {
    const detallesFacturaContainer = document.getElementById('detallesfactura');
    const detallespagosContainer = document.getElementById('detallespagos');
    const vistaResumenDePago = document.getElementById('vista-resumendepago-pz');

    // Salir si los contenedores principales no existen
    if (!detallesFacturaContainer || !detallespagosContainer || !vistaResumenDePago) {
        return;
    }

    // Limpiar el contenido de los contenedores principales antes de añadir elementos.
    // Esto asegura que cada vez que se llame la función, los elementos se rendericen de cero
    // y no se dupliquen si ya existen.
    detallesFacturaContainer.innerHTML = ''; 
    detallespagosContainer.innerHTML = '';

    let itemsFacturaUl;
    let mensajeFacturaVacia;

    // Inyecta la estructura HTML de la factura.
    const htmlEstructuraFactura = `
            <ul class="ulfacturacabeza">
                <li class="lifacturacabeza boderblanco anchocantidad">Cnt.</li>
                <li class="lifacturacabeza boderblanco anchodescripcion">Descripción</li>
                <li class="lifacturacabeza boderblanco anchopreciounitario">P.Unitario</li>
                <li class="lifacturacabeza anchoprecioporcantidad">Total</li>
            </ul>
            <div id="itemsFactura" class="items-factura">
                <p class="textoredess" id="mensajeFacturaVacia">No hay servicios en tu pedido.</p>
            </div>

        <div class="contenedornotasypreciosfactura">
            <ul class="ulnotasimportantes" id="notasImportantesList"> <p class="titulonotasimportantes">NOTAS IMPORTANTES:</p>
                
</ul>

            <ul class="ulpreciosfactura">
                <li class="costoscarritofactura"><abbr title="Subtotal">Subtotal:</abbr> <span id="subtotalFactura">0.00</span></li>
                <li class="costoscarritofactura"><abbr title="Impuesto sobre el Valor Añadido">IVA</abbr> 18%: <span id="impuestoFactura">0.00</span></li>
                <li class="costoscarritofactura"><abbr title="Descuento">Descuento:</abbr> <span id="descuentoFactura">0.00</span></li>
                <li class="costoscarritofactura"><abbr title="Total">Total:</abbr> <span id="totalFactura">0.00</span></li>
                <li class="costoscarritofactura totalapagarfactura"><abbr title="TOTAL A PAGAR">TOTAL A PAGAR:</abbr> <span id="totalaPagarFactura">0.00</span></li>
            </ul>
        </div>
        `;
    detallesFacturaContainer.insertAdjacentHTML('beforeend', htmlEstructuraFactura);
    
    // Mover la obtención de estos elementos aquí, después de la posible inyección del HTML
    // Ahora, podemos estar seguros de que existen en el DOM
    itemsFacturaUl = document.getElementById('itemsFactura');
    mensajeFacturaVacia = document.getElementById('mensajeFacturaVacia');

    // Esta verificación adicional se vuelve menos crítica pero puede permanecer por seguridad
    if (!itemsFacturaUl || !mensajeFacturaVacia) {
        console.error("Error: Todavía no se encontraron los elementos 'itemsFactura' o 'mensajeFacturaVacia' después de la inyección HTML.");
        return; 
    }

    // Inyectar el botón de "Volver a editar el carrito" si no existe
    let btnVolverCarritoDiv = vistaResumenDePago.querySelector('.limimppago');
    if (!btnVolverCarritoDiv) {
        btnVolverCarritoDiv = document.createElement('div');
        btnVolverCarritoDiv.className = 'limimppago';
        btnVolverCarritoDiv.innerHTML = '<button class="vaciar-carrito volveralcarro" id="btn-volver-carrito">Volver a editar el carrito</button>';
        detallesFacturaContainer.insertAdjacentElement('afterend', btnVolverCarritoDiv);
    }

    // Asegurarse de que actualizarCarrito de tienda.js esté disponible y se ejecute
    if (typeof actualizarCarrito === 'function') {
        actualizarCarrito();
    } else {
        console.warn("La función 'actualizarCarrito' de tienda.js no está accesible. Los totales pueden no ser precisos.");
    }

    itemsFacturaUl.innerHTML = ''; // Limpiar el contenido existente de la lista de ítems

    if (window.carrito && window.carrito.length > 0) {
        // Asegurarse de que el mensaje de vacío se oculte si hay ítems
        mensajeFacturaVacia.style.display = 'none';

        // Obtener el estado de las redes sociales para el cálculo (aunque no se usará aquí directamente para el total del ítem)
        let redesSeleccionadasCount = 0;
        const estadoRedesGuardado = localStorage.getItem('publizoomEstadoRedes');
        if (estadoRedesGuardado) {
            const estadoRedes = JSON.parse(estadoRedesGuardado);
            redesSeleccionadasCount = Object.keys(estadoRedes).filter(key => estadoRedes[key]).length;
        }


        window.carrito.forEach(item => {
            const li = document.createElement('li');
            li.className = 'liarticulofactura';

            let tituloCompleto = item.nombre;
            let descripcion = 'Sin descripción disponible.';

            // Obtener descripción y título del servicio original si existe
            const servicioOriginalDiv = document.querySelector(`.sectservicio[data-nombre="${item.nombre}"]`);
            if (servicioOriginalDiv) {
                const tituloElement = servicioOriginalDiv.querySelector('.h3titservtienda');
                const descElement = servicioOriginalDiv.querySelector('.parrservicio');
                if (tituloElement) {
                    tituloCompleto = tituloElement.textContent;
                }
                if (descElement) {
                    descripcion = descElement.textContent;
                }
            }

            let unidadMedida = ' Und.';
            if (item.nombre === 'Voz Comercial.') {
                unidadMedida = ' Seg.';
            }

            let redesSocialesParaServicio = '';
            const SERVICIOS_PUBLICACION_LOCAL = window.SERVICIOS_PUBLICACION || [
                "Publicación de Imagen.",
                "Publicación Video.",
                "Crear Redes Sociales."
            ];
            const esServicioDePublicacionLocal = (nombreServicio) => SERVICIOS_PUBLICACION_LOCAL.includes(nombreServicio);


            if (esServicioDePublicacionLocal(item.nombre)) {
                if (estadoRedesGuardado) {
                    const estadoRedes = JSON.parse(estadoRedesGuardado);
                    const redesSeleccionadasArr = Object.keys(estadoRedes).filter(key => estadoRedes[key]);

                    if (redesSeleccionadasArr.length > 0) {
                        redesSocialesParaServicio = `
                            <p class="redes-asociadas">Incluye en redes:
                                ${redesSeleccionadasArr.map(id => {
                                    const nombreRed = id.replace('fa-', '').replace('-twitter', ' X (Twitter)');
                                    return nombreRed.charAt(0).toUpperCase() + nombreRed.slice(1);
                                }).join(', ')}
                            </p>
                        `;
                    }
                }
            }

            // Aquí se muestra el total del ítem sin aplicar los descuentos específicos del cálculo.
            // Para eso, usamos el item.precio * item.cantidad
            let costoBrutoDelItem = item.precio * item.cantidad;
            // Si es un servicio de publicación sin redes seleccionadas, su costo bruto es 0.
            if (esServicioDePublicacionLocal(item.nombre) && redesSeleccionadasCount === 0) {
                costoBrutoDelItem = 0;
            } else if (esServicioDePublicacionLocal(item.nombre) && redesSeleccionadasCount > 0) {
                // Si es un servicio de publicación y hay redes, su costo bruto es precio * cantidad * num_redes
                costoBrutoDelItem = item.precio * item.cantidad * redesSeleccionadasCount;
            }


            li.innerHTML = `
                <p class="licardatosfactura anchocantidad">${item.cantidad}${unidadMedida}</p>
                <div class="tituloydescripcionserviciofactura anchodescripcion">
                    <p class="tituloserviciofactura">${tituloCompleto}</p>
                    <p class="descripcionserviciofactura">${descripcion}</p>
                    ${redesSocialesParaServicio}
                </div>
                <p class="licardatosfactura anchopreciounitario">${formatCurrency(item.precio)}</p>
                <p class="licardatosfactura anchoprecioporcantidad">${formatCurrency(costoBrutoDelItem)}</p>
            `;
            itemsFacturaUl.appendChild(li);
        });
    } else {
        // Asegurarse de que el mensaje de vacío se muestre si no hay ítems
        mensajeFacturaVacia.style.display = 'block';
    }

    // Sincronizar los valores de los totales con los del carrito principal
    document.getElementById('subtotalFactura').textContent = document.getElementById('subtotalCarrito').textContent;
    document.getElementById('impuestoFactura').textContent = document.getElementById('impuestoCarrito').textContent;
    document.getElementById('descuentoFactura').textContent = document.getElementById('descuentoCarrito').textContent;
    document.getElementById('totalFactura').textContent = document.getElementById('totalCarrito').textContent;
    document.getElementById('totalaPagarFactura').textContent = document.getElementById('totalaPagarCarrito').textContent;

    // --- LÓGICA PARA NOTAS IMPORTANTES CONDICIONALES ---
    const notasImportantesList = document.getElementById('notasImportantesList');
    if (notasImportantesList) {
        let notasHtml = [];

        // Condición 1: Nota de Redes Sociales (Por cada red social agregada...)
        const SERVICIOS_PUBLICACION_LOCAL = window.SERVICIOS_PUBLICACION || [
            "Publicación de Imagen.",
            "Publicación Video.",
            "Crear Redes Sociales."
        ];
        const tieneServicioPublicacion = window.carrito && window.carrito.some(item => SERVICIOS_PUBLICACION_LOCAL.includes(item.nombre));
        let redesSeleccionadasCount = 0;
        const estadoRedesGuardado = localStorage.getItem('publizoomEstadoRedes');
        if (estadoRedesGuardado) {
            const estadoRedes = JSON.parse(estadoRedesGuardado);
            redesSeleccionadasCount = Object.keys(estadoRedes).filter(key => estadoRedes[key]).length;
        }

        if (tieneServicioPublicacion && redesSeleccionadasCount > 0) {
            notasHtml.push('<li class="contenidonotasimportantes">Por cada red social agregada disfrutas de un ahorro del 20% en cascada.</li>');
        }

        // Condición 2: Nota de Descuento por Cantidad (Al aumentar cada unidad a la cantidad...)
        // Esta nota solo debe aparecer si hay AL MENOS UN ARTÍCULO (que NO sea Voz Comercial) con cantidad MAYOR a 1.
        const algunOtroItemConCantidadMayorAUno = window.carrito && window.carrito.some(item => 
            item.cantidad > 1 && item.nombre !== 'Voz Comercial.'
        );

        if (algunOtroItemConCantidadMayorAUno) {
            notasHtml.push('<li class="contenidonotasimportantes">Al aumentar cada unidad a la cantidad se aplica un ahorro del 5% en cascada.</li>');
        }

        // Condición 3: Nota de Voz Comercial (30 segundos es la cantidad mínima...)
        const tieneVozComercial = window.carrito && window.carrito.some(item => item.nombre === 'Voz Comercial.');
        if (tieneVozComercial) {
            notasHtml.push('<li class="contenidonotasimportantes">30 segundos es la cantidad mínima para los servicios de Voz Comercial.</li>');
        }

        // Condición 4: Nota de Cantidades Cubiertas Durante Un Mes (Estos pedidos indican las cantidades...)
        // Aplica solo para: Publicación de Imagen, Publicación Video, Fotografía de Producto, Grabación de Audiovisuales.
        const serviciosMensuales = [
            "Publicación de Imagen.",
            "Publicación Video.",
            "Fotografía de Producto.",
            "Grabación de Audiovisuales."
        ];
        const tieneServicioMensual = window.carrito && window.carrito.some(item => serviciosMensuales.includes(item.nombre));

        if (tieneServicioMensual) {
            notasHtml.push('<li class="contenidonotasimportantes">Estos pedidos indican las cantidades que serán cubiertas durante un mes.</li>');
        }

        // Notas estáticas (siempre aparecen, sin condiciones específicas del carrito)
        notasHtml.push('<li class="contenidonotasimportantes">Lo que no aparece en este documento debe ser contratados como adicional.</li>');
        notasHtml.push('<li class="contenidonotasimportantes">Al empezar el proyecto lo presentaré en mis portafolios.</li>');
        notasHtml.push('<li class="contenidonotasimportantes">50% a la orden y 50% contra entrega.</li>');

        // Insertar todas las notas
        notasImportantesList.insertAdjacentHTML('beforeend', notasHtml.join(''));
    }
    // --- FIN DE LÓGICA PARA NOTAS IMPORTANTES CONDICIONALES ---

    // Inyecta las opciones de pago. También limpiamos el contenedor al inicio.
    const htmlOpcionesPago = `
            <p class="tituloentradas">Selecciona tu Método de Pago</p>
            <div class="opciones-pago">
                <label class="labelopcionespago">
                    <input class="inputmetodosdepago" type="radio" name="metodo_pago" value="paypal" checked>Pago Digital.
                    <img class="imgmetodosdepago" src="img/metodosdepago/paypal.png" alt="PayPal" class="icono-pago">
                </label>
                <label class="labelopcionespago">
                    <input class="inputmetodosdepago" type="radio" name="metodo_pago" value="transferencia">Copia Datos Bancarios.
                    <img class="imgmetodosdepago" src="img/metodosdepago/bancos.png" alt="Bancos" class="icono-pago">
                </label>
            </div>
            <div id="detalles-pago-adicionales">
            </div>
            <button class="gestpago" id="btn-confirmar-pago">Confirmar y Pagar</button>
        `;
    detallespagosContainer.insertAdjacentHTML('beforeend', htmlOpcionesPago);


    const opcionesPagoRadios = detallespagosContainer.querySelectorAll('input[name="metodo_pago"]');
    const detallesPagoAdicionales = document.getElementById('detalles-pago-adicionales');
    const btnConfirmarPago = document.getElementById('btn-confirmar-pago');
    
    // El totalAPagarDisplay debe obtenerse justo antes de usarse, ya que puede cambiar
    // Obtener el valor sin el símbolo de moneda para el cálculo en los enlaces
    const totalAPagarDisplayStr = document.getElementById('totalaPagarFactura').textContent;
    // Eliminar el símbolo de moneda y el espacio para parsear a float
    const totalAPagarDisplay = parseFloat(totalAPagarDisplayStr.replace(/[^0-9.,]+/g, "").replace(",", "."));

    // Volver a adjuntar event listeners para asegurar que funcionen después de la inyección
    opcionesPagoRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            detallesPagoAdicionales.innerHTML = ''; // Limpiar contenido previo
            const metodoSeleccionado = event.target.value;

            if (metodoSeleccionado === 'transferencia') {
                detallesPagoAdicionales.innerHTML = `
                    <div class="datos-bancarios">

                        <p><b>DATOS DE CUENTAS BANCARIAS</b></p>
                        <p>Titular: Heriberto Leonidas Victoria Ramírez</p>
                        <p>Correo: HeribertoVic@gmail.com</p>
                        <p>Tipos de cuenta: Ahorros.</p>

                        <p>BANCO DE RESERVAS</p>
                        <p>Número de cuenta: 9606378670</p>
                        
                        <p>BANCO POPULAR</p>
                        <p>Número de cuenta: 840077416</p>

                        <button id="btn-copiar-datos">Copiar Datos</button>
                        <p style="margin-top: 10px;">
                            Por favor, envía el comprobante de pago a:
                            <a href="mailto:pagos@publizoom.com?subject=Comprobante%20de%20Pago%20-%20Mi%20Pedido&body=Adjunto%20comprobante%20de%20pago%20para%20el%20pedido%20con%20total%20de%20RD$${totalAPagarDisplay.toFixed(2)}.">Correo Electrónico</a> o 
                            <a href="https://wa.me/+18292220043?text=Hola,%20adjunto%20comprobante%20de%20pago%20de%20mi%20pedido%20de%20RD$${totalAPagarDisplay.toFixed(2)}." target="_blank">WhatsApp</a>
                        </p>
                    </div>
                `;
                // Listener para el botón de copiar datos bancarios
                document.getElementById('btn-copiar-datos').addEventListener('click', () => {
                    const datosParaCopiar = `*DATOS DE CUENTAS BANCARIAS*\nTitular: Heriberto Leonidas Victoria Ramírez\nCorreo: heribertovic@gmail.com\nRNC / Cédula: 223-0040042-5\nTipos de cuenta: Ahorros\n\nBANCO DE RESERVAS\nNúmero de cuenta: 9606378670\n\nBANCO POPULAR\nNúmero de cuenta: 840077416`;
                    navigator.clipboard.writeText(datosParaCopiar).then(() => {
                        alert('¡Datos bancarios copiados al portapapeles!');
                    }).catch(err => {
                        console.error('Error al copiar: ', err);
                        alert('Hubo un error al copiar los datos. Por favor, cópialos manualmente.');
                    });
                });
            } else if (metodoSeleccionado === 'paypal') {
                detallesPagoAdicionales.innerHTML = `<p>Al confirmar, serás redirigido a PayPal para completar tu pago de manera segura.</p>`;
            }
        });
    });

    const checkedRadio = detallespagosContainer.querySelector('input[name="metodo_pago"]:checked');
    if (checkedRadio) {
        checkedRadio.dispatchEvent(new Event('change')); // Dispara el evento para mostrar los detalles iniciales del método seleccionado
    }

    // Reemplazar y volver a adjuntar event listener para el botón de confirmar pago
    if (btnConfirmarPago) {
        btnConfirmarPago.addEventListener('click', () => {
            const metodoSeleccionado = document.querySelector('input[name="metodo_pago"]:checked').value;
            // Obtener el valor numérico del total a pagar para la validación
            const totalAPagarActualStr = document.getElementById('totalaPagarFactura').textContent;
            const totalAPagarActual = parseFloat(totalAPagarActualStr.replace(/[^0-9.,]+/g, "").replace(",", "."));


            if (isNaN(totalAPagarActual) || totalAPagarActual <= 0) {
                alert('El total a pagar debe ser mayor a cero para proceder con el pago.');
                return;
            }

            switch (metodoSeleccionado) {
                case 'paypal':
                    alert('Serás redirigido a PayPal para completar tu pago.');
                    window.location.href = "https://www.paypal.com/ncp/payment/5RQQPGGS9J46S"; 
                    console.log(`Redirigiendo a PayPal para un total de RD$${totalAPagarActual.toFixed(2)}.`);
                    break;
                case 'transferencia':
                    alert('¡Gracias por tu compra! Por favor, realiza la transferencia bancaria y envía el comprobante por Correo Electrónico o WhatsApp.');
                    break;
                default:
                    alert('Por favor, selecciona un método de pago para continuar.');
                    break;
            }
        });
    }

    // Reemplazar y volver a adjuntar event listener para el botón de volver al carrito
    const btnVolverCarrito = document.getElementById('btn-volver-carrito');
    if (btnVolverCarrito) {
        btnVolverCarrito.addEventListener('click', () => {
            if (typeof mostrarVistaSPA === 'function') {
                mostrarVistaSPA('vista-tienda-pz'); // Asume que tienes una función para navegar entre vistas
            } else {
                console.error("La función 'mostrarVistaSPA' no está disponible.");
                window.location.hash = 'vista-tienda-pz'; 
            }
        });
    }
};