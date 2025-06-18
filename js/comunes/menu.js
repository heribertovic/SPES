window.addEventListener('load', function () {

    const pageTitle = document.querySelector('head title');
    const currentTitle = pageTitle ? pageTitle.textContent : '';

    let tiAddressSuperior;
    let tiMenu;

    if (currentTitle === 'PubliZoom') {
        tiAddressSuperior = [
            { texto: "829-222-0043", icono: "fa-brands fa-whatsapp", vinculo: "https://api.whatsapp.com/send?phone=18292220043" },
            { texto: "enfocandotuimagen@gmail.com", icono: "fas fa-envelope", vinculo: "mailto:enfocandotuimagen@gmail.com" },
            { texto: "Instagram", icono: "fab fa-instagram", vinculo: "https://www.instagram.com/publizoom" },
            { texto: "Facebook", icono: "fab fa-facebook", vinculo: "https://www.facebook.com/PubliZoomInternacional/reviews/?ref=page_internal" },
            { texto: "Tiktok", icono: "fa-brands fa-tiktok", vinculo: "https://www.facebook.com/PubliZoomInternacional/reviews/?ref=page_internal" },
            { texto: "Twitter", icono: "fab fa-twitter-square", vinculo: "https://twitter.com/PubliZoom" }
        ];

        tiMenu = [
            { ida: "btninicio", texto: "Inicio", icono: "fa fa-home", vinculo: "#bodyinicio" },
            { ida: "btnsomos", texto: "¿Quiénes somos?", icono: "fa fa-users", vinculo: "#divsomos" },
            // { ida: "btnvaloracion", texto: "Valoración", icono: "far fa-star", vinculo: "https://www.facebook.com/pg/PubliZoomInternacional/reviews/?ref=page_internal" },
            { ida: "btnservicios", texto: "Servicios", icono: "fas fa-cogs", vinculo: "#servicio" },
            // { ida: "btnblog", texto: "Blog", icono: "fas fa-blog", vinculo: "html/blog.html" },
            { ida: "btntienda", texto: "Tienda", icono: "fas fa-store", vinculo: "tienda.html" },
            // { ida: "btncotizar", texto: "Cotizar", icono: "fas fa-coins", vinculo: "html/cotizar.html" },
            // { ida: "btnregistro", texto: "Registro",  icono: "fas fa-user-plus", vinculo: "registro.html" },
            // { ida: "btningresar", texto: "Ingresar", icono: "fas fa-sign-in-alt", vinculo: "ingresar.html" },
            // { ida: "btncuenta", texto: "Cuenta", icono: "fas fa-sign-in-alt", vinculo: "cuenta.html" },
            // { ida: "btnsalir", texto: "Salir", icono: "fas fa-sign-in-alt", vinculo: "ingresar.html" },
            // { ida: "btncarro", texto: "Carro", icono: "fa fa-shopping-cart", vinculo: "#carro" },
            { ida: "btncontactos", texto: "Contactos", icono: "fa fa-phone", vinculo: "#footer" }
            ];


    } else {
        tiAddressSuperior = [
            // { texto: "829-222-0043", icono: "fab fa-whatsapp", vinculo: "https://api.whatsapp.com/send?phone=18292220043" },
            { texto: "spesrd@gmail.com", icono: "fas fa-envelope", vinculo: "mailto:enfocandotuimagen@gmail.com" },
            // { texto: "Instagram", icono: "fab fa-instagram", vinculo: "https://www.instagram.com/publizoom" },
            // { texto: "Facebook", icono: "fab fa-facebook-square", vinculo: "https://facebook.com/PubliZoomInternacional" },
            // { texto: "Twitter", icono: "fab fa-twitter-square", vinculo: "https://twitter.com/PubliZoom" }
        ];

        tiMenu = [
            { ida: "btninicio", texto: "Inicio", icono: "fa fa-home", vinculo: "#bodyinicio" },
            { ida: "btnsomos", texto: "¿Quiénes somos?", icono: "fa fa-users", vinculo: "#divsomos" },
            { ida: "btncontactos", texto: "Contactos", icono: "fa fa-phone", vinculo: "#footer" },
        ];
    }

    // DIVTOP
    const divtop = document.getElementById('divtop');
    // ADDRESS
    const address = document.createElement('address');
    address.className = "addresssuperior";
    address.id = "addresssuperior";

    // ADDRESS TEXTOS E ICONOS
    const addressFragment = document.createDocumentFragment();

    // CLICO ADDRESS
    for (let cicloAddress = 0; cicloAddress < tiAddressSuperior.length; cicloAddress++) {
        if (cicloAddress >= 5) {
            break; }

        // CLICLO APLICADO
        const addressA = document.createElement('a');
        addressFragment.appendChild(addressA);

        addressA.className = "addresssuperiora";
        addressA.href = (tiAddressSuperior[cicloAddress].vinculo);
        addressA.target = "blank";
        addressA.innerHTML = '<i class="' + (tiAddressSuperior[cicloAddress].icono) + '"></i>' + '<p class="addresssuperiorap"> ' + (tiAddressSuperior[cicloAddress].texto) + '</P>'; 
    }
    address.appendChild(addressFragment);


    // HEADER LOGOTIPO
    const header = document.getElementById('headerlogotipo');
    // COLOCAR ADDRESS ANTES DEL HEADER
    divtop.insertBefore(address, header);

    // ELEMENTOS MENU
    const divmenu = document.createElement('div');
    divmenu.className = "divmenu";
    // insertar como hermano siguiente
    header.insertAdjacentElement('afterend', divmenu);

    const letramenuP = document.createElement('p');
    letramenuP.className = "letramenu";
    letramenuP.textContent = "MENU";
    // insertar como primer hjo
    divmenu.insertAdjacentElement('afterbegin', letramenuP);

    const inputmenu = document.createElement('input');
    inputmenu.type = "checkbox";
    inputmenu.id = "btn-menu";
    letramenuP.insertAdjacentElement('afterend', inputmenu);

    const labelmenu = document.createElement('label');
    labelmenu.className = "labelmenu";
    labelmenu.setAttribute("for", "btn-menu");
    inputmenu.insertAdjacentElement('afterend', labelmenu);
    labelmenu.innerHTML = '<i class="fa fa-bars"></i>';

    const menunav = document.createElement('nav');
    menunav.className = "menunav";
    labelmenu.insertAdjacentElement('afterend', menunav);

    const menunavul = document.createElement('ul');
    menunavul.className = "menunavul";
    menunavul.id = "menunavul";
    menunav.insertAdjacentElement('afterbegin', menunavul);

    // MENU TEXTOS E ICONOS
    const menuUlFragment = document.createDocumentFragment();

    // CICLO DEL MENU
    for (let cicloMenu = 0; cicloMenu < tiMenu.length; cicloMenu++) {
        if (cicloMenu >= 6) {
            break;
        }
        const navulli = document.createElement('li');
        navulli.className = "navulli";

        const ullia = document.createElement('a');
        ullia.id = (tiMenu[cicloMenu].ida);
        ullia.className = "ullia";
        ullia.innerHTML = '<i class="' + (tiMenu[cicloMenu].icono) + '"></i> ' + (tiMenu[cicloMenu].texto);
        ullia.href =  (tiMenu[cicloMenu].vinculo);

        // Corrección aplicada aquí: adjuntamos directamente el 'a' al 'li'
        navulli.appendChild(ullia); 
        menuUlFragment.appendChild(navulli); 
    }

    menunavul.appendChild(menuUlFragment);

    // TIENDA
    const btnTienda = document.getElementById('btntienda')
    if (btnTienda) {
        btnTienda.href = "html/tienda.html"
    }
       
});