const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bwipjs = require('bwip-js');

/*
=====================================
COLORES EXELARIS
=====================================
*/

const COLORS={

    fondo:"#F5F7FA",

    negro:"#111827",

    gris:"#6B7280",

    grisClaro:"#E5E7EB",

    azul:"#2563EB",

    morado:"#7C3AED",

    dorado:"#FACC15",

    blanco:"#FFFFFF"

};

/*
=====================================
DESCARGAR IMAGEN
=====================================
*/

async function descargarImagen(url){

    try{

        const response=
        await axios.get(

            url,

            {

                responseType:"arraybuffer"

            }

        );

        return Buffer.from(response.data);

    }

    catch(error){

        return null;

    }

}

/*
=====================================
GENERAR PDF
=====================================
*/

async function generarPDF(datos){

    return new Promise(

        async(resolve,reject)=>{

            try{

                const carpeta=

                path.join(

                    __dirname,

                    "../pdfs"

                );

                if(!fs.existsSync(carpeta)){

                    fs.mkdirSync(

                        carpeta,

                        {

                            recursive:true

                        }

                    );

                }

                const ruta=

                path.join(

                    carpeta,

                    `boleto-${datos.folio}.pdf`

                );

                const doc=

                new PDFDocument({

                    size:[420,900],

                    margin:0

                });

                const stream=

                fs.createWriteStream(

                    ruta

                );

                doc.pipe(stream);

         /*
=====================================
FONDO
=====================================
*/

doc

.rect(

0,

0,

420,

900

)

.fill(

COLORS.fondo

);

     /*
=====================================
FLYER
=====================================
*/

const flyer=

await descargarImagen(

    datos.eventoFlyer

);

if(flyer){

    doc.image(

        flyer,

        0,

        0,

        {

            width:420,

            height:270

        }

    );

}

          /*
=====================================
DEGRADADO
=====================================
*/

doc.save();

doc

.rect(

0,

180,

420,

90

)

.fillOpacity(.72)

.fill(

"#000000"

);

doc.restore();

          /*
=====================================
LOGO EXELARIS
=====================================
*/

doc

.fillColor(

COLORS.blanco

)

.fontSize(

13

)

.text(

"EXELARIS EVENTOS",

20,

190

);

            /*
=====================================
EVENTO
=====================================
*/

doc

.fillColor(

COLORS.blanco

)

.fontSize(

28

)

.text(

datos.eventoNombre,

20,

210,

{

width:380

}

);

    /*
=====================================
TIPO DE BOLETO
=====================================
*/

const badge=

datos.tipo==="VIP"

?COLORS.dorado

:COLORS.azul;

doc

.roundedRect(

20,

245,

95,

28,

8

)

.fill(

badge

);

doc

.fillColor(

"#000000"

)

.fontSize(

14

)

.text(

datos.tipo,

48,

253

);

            /*
=====================================
CONTINÚA EN MÓDULO 2
=====================================
*/

  /*
=====================================
TARJETA DEL EVENTO
=====================================
*/

doc.roundedRect(
    20,
    300,
    380,
    175,
    18
)
.fill(COLORS.blanco);

doc.fillColor(COLORS.azul)
.fontSize(18)
.text(
    "INFORMACIÓN DEL EVENTO",
    35,
    320
);

doc.strokeColor(COLORS.grisClaro)
.moveTo(35,350)
.lineTo(385,350)
.stroke();

/*
=====================================
FECHA
=====================================
*/

doc.fillColor(COLORS.gris)
.fontSize(10)
.text(
    "FECHA",
    35,
    365
);

doc.fillColor(COLORS.negro)
.fontSize(13)
.text(
    datos.eventoFecha || "",
    130,
    365
);

/*
=====================================
HORA
=====================================
*/

doc.fillColor(COLORS.gris)
.fontSize(10)
.text(
    "HORA",
    35,
    390
);

doc.fillColor(COLORS.negro)
.fontSize(13)
.text(
    datos.eventoHora || "",
    130,
    390
);

/*
=====================================
LUGAR
=====================================
*/

doc.fillColor(COLORS.gris)
.fontSize(10)
.text(
    "LUGAR",
    35,
    415
);

doc.fillColor(COLORS.negro)
.fontSize(13)
.text(
    datos.eventoLugar || "",
    130,
    415,
    {
        width:230
    }
);

/*
=====================================
DIRECCIÓN
=====================================
*/

doc.fillColor(COLORS.gris)
.fontSize(10)
.text(
    "DIRECCIÓN",
    35,
    445
);

doc.fillColor(COLORS.negro)
.fontSize(12)
.text(
    datos.eventoDireccion || "",
    130,
    445,
    {
        width:230
    }
);

doc.fillColor(COLORS.gris)
.fontSize(10)
.text(
    "CIUDAD",
    35,
    470
);

doc.fillColor(COLORS.negro)
.fontSize(12)
.text(
    datos.eventoCiudad || "",
    130,
    470
);

/*
=====================================
COMPRADOR
=====================================
*/

doc.roundedRect(
    20,
    500,
    380,
    130,
    18
)
.fill("#EEF4FF");

doc.fillColor(COLORS.morado)
.fontSize(18)
.text(
    "TITULAR DEL BOLETO",
    35,
    520
);

doc.fillColor(COLORS.negro)
.fontSize(17)
.text(
    datos.nombre,
    35,
    548
);

doc.fillColor(COLORS.gris)
.fontSize(11)
.text(
    datos.correo,
    35,
    573
);

doc.text(
    datos.telefono || "",
    35,
    592
);

/*
=====================================
FOLIO
=====================================
*/

doc.roundedRect(
    20,
    650,
    175,
    90,
    16
)
.fill(COLORS.negro);

doc.fillColor(COLORS.blanco)
.fontSize(12)
.text(
    "FOLIO",
    35,
    665
);

doc.fillColor(COLORS.dorado)
.fontSize(20)
.text(
    datos.folio,
    35,
    690
);

/*
=====================================
PRECIO
=====================================
*/

doc.roundedRect(
    225,
    650,
    175,
    90,
    16
)
.fill(COLORS.azul);

doc.fillColor(COLORS.blanco)
.fontSize(12)
.text(
    "PRECIO",
    240,
    665
);

const precio =
    datos.tipo === "VIP"
        ? "$350 MXN"
        : "$250 MXN";

doc.fontSize(22)
.text(
    precio,
    240,
    690
);

/*
=====================================
CONTINÚA EN MÓDULO 3
=====================================
*/

                /*
=====================================
QR
=====================================
*/

doc.roundedRect(
    20,
    760,
    380,
    120,
    18
)
.fill(COLORS.blanco);

doc.fillColor(COLORS.azul)
.fontSize(16)
.text(
    "ACCESO AL EVENTO",
    30,
    775
);

/*
=====================================
GENERAR CODE128
=====================================
*/

const barcodeBuffer =
await bwipjs.toBuffer({

    bcid: "code128",

    text: datos.uuid,

    scale: 2,

    height: 12,

    includetext: false

});

/*
=====================================
QR
=====================================
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
    800,
    {
        width:110
    }
);

/*
=====================================
CODE128
=====================================
*/

doc.image(
    barcodeBuffer,
    175,
    815,
    {
        width:190
    }
);

/*
=====================================
UUID
=====================================
*/

doc.fillColor(COLORS.gris)
.fontSize(8)
.text(
    datos.uuid,
    175,
    860,
    {
        width:190,
        align:"center"
    }
);

/*
=====================================
FOOTER
=====================================
*/

doc.rect(
    0,
    885,
    420,
    15
)
.fill(COLORS.negro);

doc.fillColor(COLORS.blanco)
.fontSize(9)
.text(
    "Powered by EXELARIS EVENTOS",
    110,
    888
);

/*
=====================================
ADVERTENCIAS
=====================================
*/

doc.fillColor(COLORS.gris)
.fontSize(8)
.text(

"Este boleto es único. No compartas el código QR. La duplicidad invalidará el acceso.",

20,

905,

{

width:380,

align:"center"

}

);

/*
=====================================
FINALIZAR PDF
=====================================
*/

doc.end();

stream.on(

"finish",

()=>{

    resolve(ruta);

}

);

stream.on(

"error",

reject

);

}catch(error){

    reject(error);

}

}

);

}

/*
=====================================
EXPORTAR
=====================================
*/

module.exports =
generarPDF;


            
