// VIDEO SLIDER
// https://www.youtube.com/watch?v=jXfSkhnvyJk

window.addEventListener('load', function () {

// EXTENSION IMAGENES
var imgExt = [
    {jpg: ".jpg"},
    {png: ".png"}
]

// RUTA IMAGENES
var rutaImgCamisetas = [
    {tshirts: "../../img/muestras/tshirts/"},
    {poloshirts: "../../img/muestras/poloshirts/"},
    {tanktop: "../../img/muestras/tanktop/"}
]

// CAMBIAR COLOR
var colorpieza = [
    { color: "blanco", precio: 0 },
    { color: "amarillo", precio: 15 },
    { color: "azulcielo", precio: 15 },
    { color: "azulmarino", precio: 15 },
    { color: "azulroyal", precio: 15 },
    { color: "azulturquesa", precio: 15 },
    { color: "fucsia", precio: 15 },
    { color: "grisjaspeado", precio: 15 },
    { color: "khaki", precio: 15 },
    { color: "morado", precio: 15 },
    { color: "naranja", precio: 15 },
    { color: "negro", precio: 15 },
    { color: "rojo", precio: 15 },
    { color: "verdekelly", precio: 15 },
    { color: "verdemanzana", precio: 15 },
    { color: "verdeoscuro", precio: 15 }
 ];
var divSelectPColor = document.querySelector(".divcolores");

// selectPporClass = document.getElementsByClassName('.pcolores')
// console.log(selectPporClass)


for ( var varColorPieza = 0;varColorPieza<colorpieza.length;varColorPieza++){
    if (varColorPieza>=16){ break; }
    var createPColor = document.createElement("p");
        divSelectPColor.appendChild(createPColor);
        createPColor.className = "pcolores " + colorpieza[varColorPieza].color; }

// CAPTURAR CLICK EN SELECT
// var selectPporClass = document.querySelectorAll('.pcolores')
//     selectPporClass.addEventListener('click', function selectColor() {
//         selectPporClass.pcolores = 
//         console.log(selectPporClass)

//     } )

var selectPporClass = document.querySelectorAll('.pcolores')
 
        console.log(selectPporClass)









var imgLado = [
    {lado: "blanco" + "1"},
    {lado: "blanco" + "2"},
    {lado: "blanco" + "3"}
]

var tresimg = document.querySelectorAll('.tresimg')
var muestraprinciapl = document.querySelector('.princiapl')
    muestraprinciapl.src = rutaImgCamisetas[0].tshirts + colorpieza[4].color + "1" + imgExt[0].jpg ;
    
for (var imgRotar = 0;imgRotar<imgLado.length;imgRotar++){
    if (imgRotar>=4){ break; }

    tresimg[imgRotar].src = rutaImgCamisetas[0].tshirts + imgLado[imgRotar].lado + imgExt[0].jpg;

 }


tresimg[0].addEventListener('click', function change1() {
    muestraprinciapl.src = rutaImgCamisetas[0].tshirts + colorpieza[4].color + "1" + imgExt[0].jpg ; } )

tresimg[1].addEventListener('click', function change2() {
    muestraprinciapl.src = rutaImgCamisetas[0].tshirts + colorpieza[4].color + "2" + imgExt[0].jpg ; } )

tresimg[2].addEventListener('click', function change3() {
    muestraprinciapl.src = rutaImgCamisetas[0].tshirts + colorpieza[4].color + "3" + imgExt[0].jpg ; } )





        
        
        // PRECIO FINAL CAMISETAS
        var pprecio = document.createElement("p");
        var contprecio = document.createTextNode("RD$");
        pprecio.appendChild(contprecio);
        // pprecio.setAttribute();
        document.getElementById("preciodentro").appendChild(pprecio);
        
        var precioCamisetas = 500;
        
        // TIPO DE CAMISETA
            // arreglo
        var tipodeCamisetas = [
            { tipo: "Cuello Redondo", precio: 95 },
            { tipo: "D' Cuello", precio: 250 },
            { tipo: "Cuello V", precio: 105 },
            { tipo: "Sin Mangas", precio: 90 } ];
            // ciclo
        for (var varCamisetas = 0;varCamisetas<tipodeCamisetas.length;varCamisetas++){
            // if evita que la variable cuente mas alla de 4 y bloquea un ciclo infinito con un break
            if (varCamisetas>=4){ break; }
            // código (crea un Opcion - captura un Select - coloca el Opcion dentro del Select - coloca el contenido de las variables en el Opcion - repite el ciclo con el For)
            var createOpcion = document.createElement("option");
            var capturarSelect = document.getElementsByTagName("select")[0];
                capturarSelect.appendChild(createOpcion);
                createOpcion.textContent = (tipodeCamisetas[varCamisetas].tipo);}
        
        // LADO DE LA IMPRESION
        var ladodelaImpresión = [
            { lado: "Frentre", material: 1 },
            { lado: "Frentre y Manga", material: 1.25 },
            { lado: "Frentre y Atrás", material: 1.75 },
            { lado: "Frentre, Manga y Atrás", material: 2 } ];
        for ( var varImpresion = 0;varImpresion<ladodelaImpresión.length;varImpresion++){
            if (varImpresion>=4){ break; }
            var createOpcion = document.createElement("option");
            var capturarSelect = document.getElementsByTagName("select")[1];
                capturarSelect.appendChild(createOpcion);
                createOpcion.textContent = (ladodelaImpresión[varImpresion].lado);}
        
        // TIPO DE TELA
        var tipodeTela = [
            { tipo: "Algodón", precio: 95 },
            { tipo: "Poliéster", precio: 125 },
            { tipo: "50% Alg - 50% Pol", precio: 160 },
            { tipo: "Drifit", precio: 148 },
            { tipo: "Licra", precio: 180 }, ];
        for ( var varTela = 0;varTela<tipodeTela.length;varTela++){
            if (varTela>=5){ break; }
            var createOpcion = document.createElement("option");
            var capturarSelect = document.getElementsByTagName("select")[2];
                capturarSelect.appendChild(createOpcion);
                createOpcion.textContent = (tipodeTela[varTela].tipo);}
        
        // TALLAS
        var tallas = [
            { talla: 2, precio: 0 },
            { talla: 4, precio: 0 },
            { talla: 6, precio: 0 },
            { talla: 8, precio: 0 },
            { talla: 10, precio: 0 },
            { talla: 12, precio: 0 },
            { talla: 14, precio: 0 },
            { talla: 16, precio: 15 },
            { talla: "S", precio: 15 },
            { talla: "M", precio: 15 },
            { talla: "L", precio: 15 },
            { talla: "XL", precio: 15 },
            { talla: "XXL", precio: 15 } ];
        for ( var varTalla = 0;varTalla<tallas.length;varTalla++){
            if (varTalla>=13){ break; }
            var createOpcion = document.createElement("option");
            var capturarSelect = document.getElementsByTagName("select")[3];
                capturarSelect.appendChild(createOpcion);
                createOpcion.textContent = (tallas[varTalla].talla);}
        
        // CANTIDAD
        // esta function no me serve por ser local, necesito este resultado de manera global
        function getCant (){
            var cantUnds = document.getElementById("cantidad").value;
            console.log(cantUnds); }
        





            // ELEMENTOS COLORES
        
                // var clasesPColor = colorpieza[varColorPieza].color;
                // clasesPColor.id = "idPColores";
        
                // console.log(clasesPColor);
        
                // var clickPColor = document.getElementById("idPColores");
                // console.log(clickPColor);
        
        
        
        
        //     for ( var varClickPColor = 0;varClickPColor<clickPColor.length;varClickPColor++){
        //         if (varClickPColor>=16){ break; }
                
        //     }
        
        //         clickPColor.addEventListener('click', function (event) {
        //                 event.preventDefault();
        //                 console.log(event.type);
        //         })
        
        //         console.log(clickPColor);
        
            
        
        //     clickPColor.DOCUMENT_POSITION_CONTAINED_BY = clickPColor[varClickPColor];
        
        
        
        // https://www.google.com/search?ei=2ZCbXJaABfGE_Qa9tpCwDw&q=click+console+log+javascript&oq=click+console+log+java&gs_l=psy-ab.1.2.33i22i29i30l10.811410.820493..825496...2.0..0.334.1775.0j2j3j2......0....1..gws-wiz.......0i71j0i22i30j0i8i13i10i30.dLV6U7qtVFw
        
        
        
        
         
        
        
            // https://www.google.com/search?ei=cF-aXMqLMsXy5gL69aSIDg&q=onclick+y+this+javascript+elementos+dinamicos&oq=onclick+y+this+javascript+elementos+dinamicos&gs_l=psy-ab.3...9985.19711..19837...2.0..0.156.2469.1j19......0....1..gws-wiz.......0i71j0i22i30j33i21j33i22i29i30.CEVk0rj96Ts
        
        
        
        
        
            // var elementsPColor = document.querySelectorAll(".pcolores").onclick = function() {functlickPColor()};
        
            // function functlickPColor(this) {
            //     document.querySelectorAll(".pcolores").onclick = "this";
            // }
        
        
            //     console.log(elementsPColor);
        
            // }
        
        
        
        
        
        
        
        // PRECIO POLO-SHIRT
        
        // PRECIO TANKTOP
        
        // SALARIO Y SUS CALCULOS
        var diasMes = 23.83;
        var horasxDia = 8;
        
        var sueldoMinimo1 = 15447.60;
        var precioDia = sueldoMinimo1 / diasMes;
        var precioxHora1 = precioDia / horasxDia;
        
        var sueldoMinimo2 = 10620.00;
        var precioDia = sueldoMinimo2 / diasMes;
        var precioxHora2 = precioDia / horasxDia;
        
        var sueldoMinimo3 = 9411.60;
        var precioDia = sueldoMinimo3 / diasMes;
        var precioxHora3 = precioDia / horasxDia;
        
        // VINILES
        var costoVinilTextilCorte15pul = 370;
        var costoVinilImpresion20pul = 350;
        
        var cantNino15pul/*(8x7)*/ = 8;
        var costoVinilNino = costoVinilTextilCorte15pul / cantNino15pul;
        
        var cantAdolesc15Pul/*8.5x11*/ = 4;
        var costoVinilAdoles = costoVinilTextilCorte15pul / cantAdolesc15Pul;
        
        var cantAdulto15pul/*11x14*/ = 3;
        var costoVinilAulto = costoVinilTextilCorte15pul / cantAdulto15pul;
        
        
        
        
        
        
        
        
        
        
        
        
        
        // var capturarOption = document.getElementsByTagName("option")[1];
        //     capturarOption.textContent = (tipodeCamisetas[0].tipo);
        
        
        
        
        
        
        
        
       


}) ;