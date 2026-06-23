const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generarPDF(datos) {

```
return new Promise((resolve, reject) => {

    try {

        const carpetaPDF = path.join(
            __dirname,
            '../pdfs'
        );

        if (!fs.existsSync(carpetaPDF)) {

            fs.mkdirSync(
                carpetaPDF,
                {
                    recursive: true
                }
            );

        }

        const rutaPDF = path.join(
            carpetaPDF,
            `boleto-${datos.folio}.pdf`
        );

        const doc = new PDFDocument({

            size: [300, 600],
            margin: 20

        });

        const stream =
            fs.createWriteStream(
                rutaPDF
            );

        doc.pipe(stream);

        /*
        ==========================
        ENCABEZADO
        ==========================
        */

        doc
            .rect(
                0,
                0,
                300,
                100
            )
            .fill('#1e3a8a');

        doc
            .fillColor('white')
            .fontSize(24)
            .text(
                'FIESTA RETRO',
                0,
                25,
                {
                    align: 'center'
                }
            );

        doc
            .fontSize(12)
            .text(
                "70's • 80's • 90's",
                {
                    align: 'center'
                }
            );

        doc.moveDown(5);

        /*
        ==========================
        EVENTO
        ==========================
        */

        doc
            .fillColor('black')
            .fontSize(12);

        doc.text(
            '📅 31 Octubre 2026'
        );

        doc.text(
            '🕗 20:00 HRS'
        );

        doc.text(
            '📍 Salon SUTERM'
        );

        doc.text(
            'Coatzacoalcos, Veracruz'
        );

        doc.moveDown();

        /*
        ==========================
        TITULAR
        ==========================
        */

        doc
            .roundedRect(
                20,
                doc.y,
                260,
                110,
                10
            )
            .fillAndStroke(
                '#f8fafc',
                '#cbd5e1'
            );

        doc
            .fillColor('black')
            .fontSize(10)
            .text(
                'TITULAR',
                35,
                doc.y - 95
            );

        doc
            .fontSize(16)
            .text(
                datos.nombre,
                35,
                doc.y + 5
            );

        doc
            .fontSize(11)
            .fillColor('gray')
            .text(
                datos.correo,
                35
            );

        doc
            .fillColor('black')
            .fontSize(11)
            .text(
                `Folio: ${datos.folio}`,
                35
            );

        doc.text(
            `Tipo: ${datos.tipo}`,
            35
        );

        doc.moveDown(6);

        /*
        ==========================
        QR
        ==========================
        */

        const qrBase64 =
            datos.qr.replace(
                /^data:image\/png;base64,/,
                ''
            );

        const qrBuffer =
            Buffer.from(
                qrBase64,
                'base64'
            );

        const qrX =
            (300 - 140) / 2;

        doc.image(
            qrBuffer,
            qrX,
            doc.y,
            {
                width: 140
            }
        );

        doc.moveDown(8);

        doc
            .fontSize(8)
            .fillColor('gray')
            .text(
                datos.uuid,
                {
                    align: 'center'
                }
            );

        doc.moveDown();

        doc
            .fontSize(10)
            .fillColor('black')
            .text(
                'Presenta este QR al ingresar al evento.',
                {
                    align: 'center'
                }
            );

        doc.end();

        stream.on(
            'finish',
            () => {

                console.log(
                    `PDF generado: ${rutaPDF}`
                );

                resolve(
                    rutaPDF
                );

            }
        );

        stream.on(
            'error',
            reject
        );

    } catch (error) {

        reject(error);

    }

});
```

}

module.exports = generarPDF;
