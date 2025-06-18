window.addEventListener('load', function () {

// DATOS SERVICIOS
const datosServicios = [
    { vinculo: ".html", icono: "fas fa-share-alt", h2tituloservicio: "Community Manager", h3contenidoservicio: "Administramos y potenciamos tu comunidad online dependiendo de tus metas y el posicionamiento que busca alcanzar tu marca, gestionamos publicaciones diarias, semanales o mensuales para aumentar la comunidad y detectar a tus potenciales socios comerciales." },

    { vinculo: ".html", icono: "fas fa-pencil-alt", h2tituloservicio: "Desarrollo de Marca", h3contenidoservicio: "Creamos conceptos partiendo de las necesidades de tu empresa o imagen personal, utilizando colores y tipografía que identificarán tu marca." },

    { vinculo: ".html", icono: "fas fa-mail-bulk", h2tituloservicio: "Documentos Institucionales", h3contenidoservicio: "Gestionamos la presentación física de tu empresa con: angendas, libretas, uniformes, gorras, distintivos, carné, volantes, brochure, afiches, hojas timbradas, sobres, tarjetas de presentación, calendarios, recibos, facturas y sellos pretintados." },

    { vinculo: ".html", icono: "fas fa-pen-nib", h2tituloservicio: "Arte Digital", h3contenidoservicio: "Confeccionamos piezas visuales con gran valor estético para disversos medios de reproducción y todo público." },

    { vinculo: ".html", icono: "fab fa-chrome", h2tituloservicio: "Desarrollo Web", h3contenidoservicio: "Realizamos algunos procesos para la creación de páginas web tales como: diseño UI/UX, diseño web (maquetación) y programación web." },

    { vinculo: ".html", icono: "fas fa-camera", h2tituloservicio: "Fotografía", h3contenidoservicio: "Ofrecemos servicios fotográficos: eventos, bodas, cumpleaños y fotografía de producto" },

    { vinculo: ".html", icono: "fas fa-medal", h2tituloservicio: "Placas, Medallas y Reconocimientos", h3contenidoservicio: "Realizamos placas, medallas y reconomientos en soportes como acrílico, madera y metal, solo contáctanos." },

    { vinculo: ".html", icono: "fas fa-tshirt", h2tituloservicio: "Textiles", h3contenidoservicio: "Estampamos imágenes de todo tipo sobre cualquier tela, usando métodos como la serigrafía para grandes cantidades y el bordado, la sublimación y los viniles para pequeñas cantidades." },

    { vinculo: ".html", icono: "fas fa-beer", h2tituloservicio: "Artículos Personalizados", h3contenidoservicio: "Personalizamos artículos de baja cantidades tales como: jarras cerveceras, tazas, platos, botellas de agua, gorras, camisetas, llaveros." },

    // { vinculo: ".html", icono: "fas fa-chalkboard-teacher", h2tituloservicio: "Formación Especializada", h3contenidoservicio: "Impartimos formación en: Presentaciones en la DGII, liquidación de presupuesto, Photoshop, Illustrator, InDesign." },
    
    // { vinculo: ".html", icono: "fas fa-paperclip", h2tituloservicio: "Materiales de Oficina", h3contenidoservicio: "Algunos de los materiales de oficina: Papel, Lápiz, Bolígrafos, Clip, Folder, Foami, Cinta Pegante, Otros." },

    // { vinculo: ".html", icono: "fas fa-laptop", h2tituloservicio: "Equipos de Oficina", h3contenidoservicio: "Equipos para la venta: Mouse, teclado, CPU, UPS, monitores, otros." },

    ];

const divServicio = document.getElementById('servicio')

    const articuloservicio = document.createElement('article');
        articuloservicio.className = "articuloservicio";
    divServicio.insertAdjacentElement('beforeend',articuloservicio)
    // const articuloServicioFragment = document.createDocumentFragment()

        const sectionServicioFragment = document.createDocumentFragment()

        const cicloFragment = document.createDocumentFragment();

    for ( let cicloServicio = 0;cicloServicio<datosServicios.length;cicloServicio++){
        if (cicloServicio>=12){ break; }

        const sectionservicio = document.createElement('section');
            sectionservicio.className = "sectionservicio";

            // const aclicservicio = document.createElement('a');
            //     aclicservicio.className = "aclicservicio";
            //     sectionservicio.insertAdjacentElement('afterbegin',aclicservicio)

                const iconoservicio = document.createElement('i');
                    iconoservicio.className = datosServicios[cicloServicio].icono + " " + "iconoservicio";
                    sectionservicio.insertAdjacentElement('afterbegin',iconoservicio)

                const tituloservicio = document.createElement('h2');
                    tituloservicio.className = "tituloservicio";
                    tituloservicio.textContent = datosServicios[cicloServicio].h2tituloservicio
                    iconoservicio.insertAdjacentElement('afterend',tituloservicio)

                const contenidoservicio = document.createElement('h3');
                    contenidoservicio.className = "contenidoservicio";
                    contenidoservicio.textContent = datosServicios[cicloServicio].h3contenidoservicio
                    tituloservicio.insertAdjacentElement('afterend',contenidoservicio)

        sectionServicioFragment.appendChild(sectionservicio)

    }
    articuloservicio.appendChild(sectionServicioFragment)

}) ;