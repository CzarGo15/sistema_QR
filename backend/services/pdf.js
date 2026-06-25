const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bwipjs = require('bwip-js');

/*
====================================================
CONFIGURACIÓN EXELARIS PDF v2.0
====================================================
*/

const PAGE = {

    width: 420,

    height: 980

};

const COLORS = {

    background: "#F4F6F9",

    white: "#FFFFFF",

    black: "#111827",

    gray: "#6B7280",

    lightGray: "#E5E7EB",

    blue: "#2563EB",

    indigo: "#4338CA",

    purple: "#7C3AED",

    gold: "#FACC15",

    red: "#DC2626",

    success: "#16A34A"

};

/*
====================================================
DESCARGAR IMAGEN
====================================================
*/

async function descargarImagen(url){

    try{

        if(!url){

            return null;

        }

        const response = await axios.get(

            url,

            {

                responseType:'arraybuffer',

                timeout:15000

            }

        );

        return Buffer.from(response.data);

    }

    catch(error){

        console.log("Flyer no disponible");

        return null;

    }

}

/*
====================================================
GENERAR CODE128
====================================================
*/

async function generarBarcode(texto){

    return await bwipjs.toBuffer({

        bcid:'code128',

        text:texto,

        scale:3,

        height:14,

        includetext:false

    });

}

/*
====================================================
FORMATEAR FECHA
====================================================
*/

function fechaMX(fecha){

    if(!fecha){

        return "";

    }

    try{

        return new Date(fecha)

        .toLocaleDateString(

            'es-MX',

            {

                day:'2-digit',

                month:'long',

                year:'numeric'

            }

        );

    }

    catch{

        return fecha;

    }

}

/*
====================================================
FORMATEAR PRECIO
====================================================
*/

function precio(tipo){

    return tipo==="VIP"

        ? "$350 MXN"

        : "$250 MXN";

}

/*
====================================================
GENERAR PDF
====================================================
*/

async function generarPDF(datos){

    return new Promise(

        async(resolve,reject)=>{

            try{

                const carpeta = path.join(

                    __dirname,

                    "../pdfs"

                );

                if(

                    !fs.existsSync(carpeta)

                ){

                    fs.mkdirSync(

                        carpeta,

                        {

                            recursive:true

                        }

                    );

                }

                const rutaPDF = path.join(

                    carpeta,

                    `boleto-${datos.folio}.pdf`

                );

                const doc = new PDFDocument({

                    size:[

                        PAGE.width,

                        PAGE.height

                    ],

                    margin:0,

                    info:{

                        Title:datos.eventoNombre,

                        Author:"EXELARIS",

                        Creator:"EXELARIS",

                        Subject:"Boleto Digital"

                    }

                });

                const stream =

                fs.createWriteStream(

                    rutaPDF

                );

                doc.pipe(stream);

                /*
                ====================================
                FONDO
                ====================================
                */

                doc

                .rect(

                    0,

                    0,

                    PAGE.width,

                    PAGE.height

                )

                .fill(

                    COLORS.background

                );

                /*
                ====================================
                DESCARGAR FLYER
                ====================================
                */

                const flyer =

                await descargarImagen(

                    datos.eventoFlyer

                );

                /*
                ====================================
                CONTINÚA PARTE 2
                ====================================
                */
                /*
====================================================
HEADER PREMIUM
====================================================
*/

const HEADER_HEIGHT = 250;

if (flyer) {

    doc.image(
        flyer,
        0,
        0,
        {
            width: PAGE.width,
            height: HEADER_HEIGHT
        }
    );

} else {

    doc.rect(
        0,
        0,
        PAGE.width,
        HEADER_HEIGHT
    )
    .fill(COLORS.indigo);

}

/*
====================================================
DEGRADADO SUPERIOR
====================================================
*/

doc.save();

doc.rect(
    0,
    0,
    PAGE.width,
    HEADER_HEIGHT
)
.fillOpacity(0.28)
.fill("#000000");

doc.restore();

/*
====================================================
DEGRADADO INFERIOR
====================================================
*/

doc.save();

doc.rect(
    0,
    165,
    PAGE.width,
    85
)
.fillOpacity(0.72)
.fill("#000000");

doc.restore();

/*
====================================================
LOGO EXELARIS
====================================================
*/

doc.circle(
    35,
    35,
    15
)
.fill(COLORS.white);

doc.fillColor(COLORS.indigo)
.font("Helvetica-Bold")
.fontSize(13)
.text(
    "E",
    30,
    28
);

doc.fillColor(COLORS.white)
.font("Helvetica-Bold")
.fontSize(18)
.text(
    "EXELARIS",
    58,
    23
);

doc.font("Helvetica")
.fontSize(9)
.text(
    "EVENT MANAGEMENT",
    58,
    45
);

/*
====================================================
BADGE VIP / GENERAL
====================================================
*/

const badgeColor =
    datos.tipo === "VIP"
        ? COLORS.gold
        : COLORS.blue;

const badgeTextColor =
    datos.tipo === "VIP"
        ? COLORS.black
        : COLORS.white;

doc.roundedRect(
    305,
    24,
    90,
    28,
    8
)
.fill(badgeColor);

doc.fillColor(badgeTextColor)
.font("Helvetica-Bold")
.fontSize(12)
.text(
    datos.tipo,
    330,
    33
);

/*
====================================================
NOMBRE DEL EVENTO
====================================================
*/

doc.fillColor(COLORS.white)
.font("Helvetica-Bold")
.fontSize(28)
.text(
    datos.eventoNombre || "EVENTO",
    25,
    170,
    {
        width: 370
    }
);

/*
====================================================
FECHA DEL EVENTO
====================================================
*/

doc.fillColor(COLORS.white)
.font("Helvetica")
.fontSize(12)
.text(
    fechaMX(datos.eventoFecha),
    25,
    208
);

/*
====================================================
LÍNEA DECORATIVA
====================================================
*/

doc.moveTo(
    25,
    238
)
.lineTo(
    395,
    238
)
.lineWidth(1)
.strokeColor("rgba(255,255,255,0.45)")
.stroke();

/*
====================================================
CONTINÚA PARTE 3
====================================================
*/
/*
====================================================
TARJETA INFORMACIÓN DEL EVENTO
====================================================
*/

const cardX = 20;
const cardY = 260;
const cardWidth = 380;
const cardHeight = 170;

doc.roundedRect(
    cardX,
    cardY,
    cardWidth,
    cardHeight,
    14
)
.fill(COLORS.white);

doc.fillColor(COLORS.indigo)
.font("Helvetica-Bold")
.fontSize(15)
.text(
    "INFORMACIÓN DEL EVENTO",
    cardX + 18,
    cardY + 16
);

doc.moveTo(
    cardX + 18,
    cardY + 42
)
.lineTo(
    cardX + cardWidth - 18,
    cardY + 42
)
.lineWidth(.5)
.strokeColor(COLORS.lightGray)
.stroke();

/*
====================================================
FILA 1
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(9)
.text(
    "FECHA",
    cardX + 18,
    cardY + 58
);

doc.fillColor(COLORS.black)
.font("Helvetica-Bold")
.fontSize(11)
.text(
    fechaMX(datos.eventoFecha),
    cardX + 105,
    cardY + 58
);

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(9)
.text(
    "HORA",
    cardX + 18,
    cardY + 80
);

doc.fillColor(COLORS.black)
.font("Helvetica-Bold")
.fontSize(11)
.text(
    datos.eventoHora || "",
    cardX + 105,
    cardY + 80
);

/*
====================================================
FILA 2
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(9)
.text(
    "LUGAR",
    cardX + 18,
    cardY + 104
);

doc.fillColor(COLORS.black)
.font("Helvetica-Bold")
.fontSize(11)
.text(
    datos.eventoLugar || "",
    cardX + 105,
    cardY + 104,
    {
        width:250
    }
);

/*
====================================================
FILA 3
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(9)
.text(
    "DIRECCIÓN",
    cardX + 18,
    cardY + 126
);

doc.fillColor(COLORS.black)
.font("Helvetica")
.fontSize(10)
.text(
    datos.eventoDireccion || "",
    cardX + 105,
    cardY + 126,
    {
        width:250
    }
);

/*
====================================================
FILA 4
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(9)
.text(
    "CIUDAD",
    cardX + 18,
    cardY + 148
);

doc.fillColor(COLORS.black)
.font("Helvetica")
.fontSize(10)
.text(
    datos.eventoCiudad || "",
    cardX + 105,
    cardY + 148
);

/*
====================================================
CONTINÚA PARTE 4
====================================================
*/
                
 /*
====================================================
TARJETA TITULAR
====================================================
*/

const buyerX = 20;
const buyerY = 450;
const buyerWidth = 380;
const buyerHeight = 145;

doc.roundedRect(

    buyerX,

    buyerY,

    buyerWidth,

    buyerHeight,

    14

)
.fill("#EEF4FF");

/*
====================================================
TÍTULO
====================================================
*/

doc.fillColor(COLORS.purple)
.font("Helvetica-Bold")
.fontSize(15)
.text(

    "TITULAR DEL BOLETO",

    buyerX + 18,

    buyerY + 16

);

doc.moveTo(

    buyerX + 18,

    buyerY + 42

)

.lineTo(

    buyerX + buyerWidth - 18,

    buyerY + 42

)

.lineWidth(.5)

.strokeColor(COLORS.lightGray)

.stroke();

/*
====================================================
NOMBRE
====================================================
*/

doc.fillColor(COLORS.black)
.font("Helvetica-Bold")
.fontSize(18)
.text(

    datos.nombre || "",

    buyerX + 18,

    buyerY + 55,

    {

        width:330

    }

);

/*
====================================================
CORREO
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(11)
.text(

    datos.correo || "",

    buyerX + 18,

    buyerY + 84,

    {

        width:330

    }

);

/*
====================================================
TELÉFONO
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(11)
.text(

    datos.telefono || "",

    buyerX + 18,

    buyerY + 106

);

/*
====================================================
FOLIO
====================================================
*/

const boxY = 615;

doc.roundedRect(

    20,

    boxY,

    175,

    88,

    12

)

.fill(COLORS.black);

doc.fillColor(COLORS.white)
.font("Helvetica")
.fontSize(10)
.text(

    "FOLIO",

    35,

    boxY + 16

);

doc.fillColor(COLORS.gold)
.font("Helvetica-Bold")
.fontSize(20)
.text(

    datos.folio,

    35,

    boxY + 38

);

/*
====================================================
PRECIO
====================================================
*/

doc.roundedRect(

    225,

    boxY,

    175,

    88,

    12

)

.fill(COLORS.blue);

doc.fillColor(COLORS.white)
.font("Helvetica")
.fontSize(10)
.text(

    "PRECIO",

    240,

    boxY + 16

);

doc.font("Helvetica-Bold")
.fontSize(22)
.text(

    precio(datos.tipo),

    240,

    boxY + 38

);

/*
====================================================
CONTINÚA PARTE 5
====================================================
*/

            /*
====================================================
TARJETA DE ACCESO
====================================================
*/

const qrY = 725;

doc.roundedRect(

    20,

    qrY,

    380,

    150,

    14

)

.fill(COLORS.white);

/*
====================================================
TÍTULO
====================================================
*/

doc.fillColor(COLORS.indigo)
.font("Helvetica-Bold")
.fontSize(15)
.text(

    "ACCESO AL EVENTO",

    35,

    qrY + 15

);

doc.moveTo(

    35,

    qrY + 40

)

.lineTo(

    385,

    qrY + 40

)

.lineWidth(.5)

.strokeColor(COLORS.lightGray)

.stroke();

/*
====================================================
QR
====================================================
*/

const qrBase64 =

datos.qr.replace(

    /^data:image\/png;base64,/,

    ""

);

const qrBuffer =

Buffer.from(

    qrBase64,

    "base64"

);

doc.image(

    qrBuffer,

    35,

    qrY + 55,

    {

        width:90,

        height:90

    }

);

/*
====================================================
UUID
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(8)
.text(

    "ID ÚNICO",

    145,

    qrY + 58

);

doc.fillColor(COLORS.black)
.font("Helvetica-Bold")
.fontSize(9)
.text(

    datos.uuid,

    145,

    qrY + 74,

    {

        width:220

    }

);

/*
====================================================
ESTADO
====================================================
*/

doc.fillColor(COLORS.success)
.font("Helvetica-Bold")
.fontSize(11)
.text(

    "BOLETO OFICIAL",

    145,

    qrY + 104

);

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(9)
.text(

    "Presenta este código QR al ingresar al evento.",

    145,

    qrY + 122,

    {

        width:210

    }

);

/*
====================================================
CONTINÚA PARTE 6
====================================================
*/

            /*
====================================================
GENERAR CODE128
====================================================
*/

const barcodeBuffer =
await generarBarcode(
    datos.uuid
);

/*
====================================================
CÓDIGO DE BARRAS
====================================================
*/

doc.image(

    barcodeBuffer,

    35,

    845,

    {

        width:330,

        height:42

    }

);

/*
====================================================
UUID DEBAJO DEL CÓDIGO
====================================================
*/

doc.fillColor(COLORS.gray)
.font("Helvetica")
.fontSize(8)
.text(

    datos.uuid,

    35,

    890,

    {

        width:330,

        align:"center"

    }

);

/*
====================================================
SELLO OFICIAL
====================================================
*/

doc.roundedRect(

    320,

    842,

    65,

    22,

    8

)

.fill(COLORS.success);

doc.fillColor(COLORS.white)
.font("Helvetica-Bold")
.fontSize(8)
.text(

    "VÁLIDO",

    334,

    849

);

/*
====================================================
LÍNEA DECORATIVA
====================================================
*/

doc.moveTo(

    20,

    915

)

.lineTo(

    400,

    915

)

.lineWidth(.5)

.strokeColor(COLORS.lightGray)

.stroke();

/*
====================================================
CONTINÚA PARTE 7
====================================================
*/

/*
====================================================
FOOTER
====================================================
*/

const footerY = 930;

doc.rect(
    0,
    footerY,
    PAGE.width,
    50
)
.fill(COLORS.black);

/*
====================================================
LOGO EXELARIS
====================================================
*/

doc.fillColor(COLORS.white)
.font("Helvetica-Bold")
.fontSize(12)
.text(
    "EXELARIS",
    25,
    footerY + 10
);

doc.font("Helvetica")
.fontSize(8)
.fillColor("#D1D5DB")
.text(
    "EVENT MANAGEMENT",
    25,
    footerY + 26
);

/*
====================================================
MENSAJE DE SEGURIDAD
====================================================
*/

doc.fillColor(COLORS.white)
.font("Helvetica")
.fontSize(8)
.text(
    "Este boleto es único e intransferible. El código QR solo puede ser utilizado una vez para ingresar al evento.",
    120,
    footerY + 10,
    {
        width: 270,
        align: "right"
    }
);

/*
====================================================
POWERED BY
====================================================
*/

doc.fillColor("#9CA3AF")
.font("Helvetica")
.fontSize(7)
.text(
    "Powered by EXELARIS®",
    25,
    footerY + 40
);

doc.text(
    new Date().getFullYear().toString(),
    360,
    footerY + 40,
    {
        width: 35,
        align: "right"
    }
);

/*
====================================================
CONTINÚA PARTE 8
====================================================
*/

            /*
====================================================
FINALIZAR PDF
====================================================
*/

doc.end();

/*
====================================================
ESPERAR A QUE TERMINE DE ESCRIBIR
====================================================
*/

stream.on(

    "finish",

    ()=>{

        console.log(

            `PDF generado: ${rutaPDF}`

        );

        resolve(

            rutaPDF

        );

    }

);

stream.on(

    "error",

    (error)=>{

        console.error(

            "Error al generar PDF:",

            error

        );

        reject(

            error

        );

    }

);

}catch(error){

    console.error(

        "ERROR PDF:",

        error

    );

    reject(

        error

    );

}

}

);

}

/*
====================================================
EXPORTAR
====================================================
*/

module.exports = generarPDF;
