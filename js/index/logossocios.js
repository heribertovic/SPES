// PASO 1 - AGREGAR CADENA DE DATOS.
const cadenaDeDatos = [
    { texto: "", vinculo: "pz/pz.html", etiqueta: "a", selector: "#enlacePZ", rutacarpeta: "ruta1", otro: "extra1" },
    { texto: "", vinculo: "amas/amas.html", etiqueta: "a", selector: "#enlaceAMAS", rutacarpeta: "ruta2", otro: "extra2" }
];

// LOGOS SOCIOS
var logossocios = [ ];
logossocios [0] = 'publizoom';
logossocios [1] = 'aprendemas';

window.addEventListener('DOMContentLoaded',function() {
    const miConfiguracionParaIterar = { idContenedorPrincipal: 'logossociosid' };

    crearEInsertarElementoDinamico(miConfiguracionParaIterar, cadenaDeDatos);

    const enlacePZ = document.getElementById('enlacePZ');
    const enlaceAMAS = document.getElementById('enlaceAMAS');

    if (enlacePZ && logossocios[0]) {
        const imgPZ = document.createElement("img");
        imgPZ.className = "imglogossocios";
        imgPZ.src = "img/socios/" + logossocios[0] + ".png";
        enlacePZ.appendChild(imgPZ);
    }

    if (enlaceAMAS && logossocios[1]) {
        const imgAMAS = document.createElement("img");
        imgAMAS.className = "imglogossocios";
        imgAMAS.src = "img/socios/" + logossocios[1] + ".png";
        enlaceAMAS.appendChild(imgAMAS);
    }

})