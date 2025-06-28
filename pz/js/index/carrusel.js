// VIDEO SLIDER
// https://www.youtube.com/watch?v=jXfSkhnvyJk

window.addEventListener('load', function () {

// CARRUSEL
        var imagenescarrusel = [];
        
        imagenescarrusel [0] = 'mochila';
        imagenescarrusel [1] = 'carne';
        imagenescarrusel [2] = 'agenda';
        imagenescarrusel [3] = 'botella';
        imagenescarrusel [4] = 'tazas';

        var indiceImagenes = 0;
        var tiempo = 3000;

        function cambiarImagenes() {

                document.slider.src = "img/carrusel/screenbig/" + imagenescarrusel [indiceImagenes] + ".jpg";
                if (indiceImagenes < 4 ) {
                        indiceImagenes++;
                        } else {
                                indiceImagenes = 0; } }
        this.setInterval(cambiarImagenes, tiempo);

        var divcero = document.querySelector('.cero')
                divcero.addEventListener('click', function cero() {
                        document.slider.src = "img/carrusel/screenbig/" + imagenescarrusel [0] + ".jpg"; })
        
        var divuno = document.querySelector('.uno')
                divuno.addEventListener('click', function uno() {
                        document.slider.src = "img/carrusel/screenbig/" + imagenescarrusel [1] + ".jpg"; })
        
        var divdos = document.querySelector('.dos')
                divdos.addEventListener('click', function dos() {
                        document.slider.src = "img/carrusel/screenbig/" + imagenescarrusel [2] + ".jpg"; })
        
        var divtres = document.querySelector('.tres')
                divtres.addEventListener('click', function tres() {
                        document.slider.src = "img/carrusel/screenbig/" + imagenescarrusel [3] + ".jpg"; })
        
        var divcuatro = document.querySelector('.cuatro')
                divcuatro.addEventListener('click', function cuatro() {
                        document.slider.src = "img/carrusel/screenbig/" + imagenescarrusel [4] + ".jpg"; })



// LOGOTIPOS CLIENTES
var logotiposclientes = [ ];

        logotiposclientes [0] = 'aitor';
        logotiposclientes [1] = 'arcoiris';
        logotiposclientes [2] = 'veneranda';
        logotiposclientes [3] = 'century';
        logotiposclientes [4] = 'clayme';
        logotiposclientes [5] = 'vjconsultas';
        logotiposclientes [6] = 'inverelectric';
        logotiposclientes [7] = 'djkorny';
        logotiposclientes [8] = 'cem';
        logotiposclientes [9] = 'herrero';
        logotiposclientes [10] = 'coopetra';
        logotiposclientes [11] = 'tbeo';
        logotiposclientes [12] = 'shogar';
        logotiposclientes [13] = 'qualitygb';
        logotiposclientes [14] = 'fac';
        logotiposclientes [15] = 'cma';

                var divlogotiposclientes = document.querySelector('.divlogotiposclientes');

        for (var varLogosClientes = 0; varLogosClientes <= logotiposclientes.length - 1; varLogosClientes++ ){

                var createImg = document.createElement("img");
                        createImg.className = "imglogotipoclientes";

                var imgDentroDiv = divlogotiposclientes.appendChild(createImg);


                imgDentroDiv.src = "img/clientes/" + logotiposclientes[varLogosClientes] + ".png";

        }


}) ;