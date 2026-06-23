const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generarPDF(datos) {

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

            // ENCABEZADO

            doc
                .rect(0, 0, 300, 90)
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
                .fontSize(11)
                .text(
                    "70's • 80's • 90's",
                    {
                        align: 'center'
                    }
                );

            doc.moveDown(5);

            // EVENTO

            doc
                .fillColor('black')
                .fontSize(11);

            doc.text('Fecha: 31 Octubre 2026');
            doc.text('Hora: 20:00 HRS');
            doc.text('Lugar: Salon SUTERM');
            doc.text('Coatzacoalcos, Veracruz');

            doc.moveDown();

            // TITULAR

            doc
                .fontSize(18)
                .fillColor('#1e3a8a')
                .text('DATOS DEL BOLETO');

            doc.moveDown();

            doc
                .fillColor('black')
                .fontSize(12);

            doc.text(`Nombre: ${datos.nombre}`);
            doc.text(`Correo: ${datos.correo}`);
            doc.text(`Folio: ${datos.folio}`);
            doc.text(`Tipo: ${datos.tipo}`);

            doc.moveDown();

            // QR

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

            doc.image(
                qrBuffer,
                80,
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

}

module.exports = generarPDF;
