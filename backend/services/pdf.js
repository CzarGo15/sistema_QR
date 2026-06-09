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

                size: 'A4',

                margin: 40

            });

            const stream =
                fs.createWriteStream(
                    rutaPDF
                );

            doc.pipe(stream);

            // ENCABEZADO

            doc
                .fontSize(28)
                .fillColor('#4f46e5')
                .text(
                    'EXELARIS',
                    {
                        align: 'center'
                    }
                );

            doc
                .fontSize(20)
                .fillColor('#111827')
                .text(
                    'FIESTA RETRO',
                    {
                        align: 'center'
                    }
                );

            doc.moveDown();

            // DATOS EVENTO

            doc
                .fontSize(14)
                .fillColor('black')
                .text(
                    '31 Octubre 2026'
                );

            doc.text(
                '20:00 HRS'
            );

            doc.text(
                'Salon SUTERM'
            );

            doc.text(
                'Coatzacoalcos, Veracruz'
            );

            doc.moveDown();

            // DATOS BOLETO

            doc
                .fontSize(18)
                .fillColor('#4f46e5')
                .text(
                    'Datos del Boleto'
                );

            doc.moveDown(0.5);

            doc
                .fontSize(12)
                .fillColor('black');

            doc.text(
                `Nombre: ${datos.nombre}`
            );

            doc.text(
                `Correo: ${datos.correo}`
            );

            doc.text(
                `Folio: ${datos.folio}`
            );

            doc.text(
                `Tipo: ${datos.tipo}`
            );

            doc.text(
                `UUID: ${datos.uuid}`
            );

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
                {
                    fit: [220, 220],
                    align: 'center'
                }
            );

            doc.moveDown();

            doc
                .fontSize(10)
                .fillColor('gray')
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

        } catch (error) {

            reject(error);

        }

    });

}

module.exports = generarPDF;
