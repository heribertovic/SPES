// PIE DE PAGINA
window.addEventListener('load', function () {

const contactosPie = document.getElementById('footer')

    const piefooter = document.createElement('footer');
        piefooter.className = "piefooter";
        contactosPie.insertAdjacentElement('afterbegin',piefooter);

        const addressFooter = document.getElementById('addresssuperior').cloneNode(true);
            addressFooter.className = "addresfooter";
            piefooter.insertAdjacentElement('afterbegin',addressFooter);

            const addressA = Array.from(addressFooter.querySelectorAll('.addresssuperiora'));
                addressA.map( el => el.classList.add('afooter') );
                addressA.map( el => el.classList.remove('addresssuperiora') );

            const addressAP = Array.from(addressFooter.querySelectorAll('p'));
                addressAP.map( el => el.style.display = 'none');

}) ; 