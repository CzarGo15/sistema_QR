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

                fs.mkdirSync(carpetaPDF, {
                    recursive: true
                });

            }

            const rutaPDF = path.join(
                carpetaPDF,
                `boleto-${datos.folio}.pdf`
            );

            const doc = new PDFDocument({
                size: [400, 700],
                margin: 20
            });

            const stream =
                fs.createWriteStream(rutaPDF);

            doc.pipe(stream);

            // Encabezado

            doc.rect(0, 0, 400, 100)
               .fill('#1e3a8a');

            doc.fillColor('white')
               .fontSize(24)
               .text(
                    'FIESTA RETRO',
                    0,
                    30,
                    {
                        width: 400,
                        align: 'center'
                    }
                );

            doc.fillColor('black');

            // Datos evento

            doc.y = 130;

            doc.fontSize(12);

            doc.text('Fecha: 31 Octubre 2026');
            doc.text('Hora: 20:00 HRS');
            doc.text('Lugar: Salon SUTERM');
            doc.text('Coatzacoalcos, Veracruz');

            doc.moveDown();

            // Datos comprador

            doc.fontSize(14);
            doc.text(`Nombre: ${datos.nombre}`);

            doc.fontSize(11);
            doc.text(`Correo: ${datos.correo}`);
            doc.text(`Folio: ${datos.folio}`);
            doc.text(`Tipo: ${datos.tipo}`);

            doc.moveDown(2);

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
                130,
                doc.y,
                {
                    width: 140
                }
            );

            doc.y += 170;

            doc.fontSize(9)
               .fillColor('gray')
               .text(
                    datos.uuid,
                    {
                        align: 'center'
                    }
                );

            doc.moveDown();

            doc.fillColor('black');

            doc.text(
                'Presenta este QR al ingresar al evento.',
                {
                    align: 'center'
                }
            );

            doc.end();

            stream.on('finish', () => {

                console.log(
                    `PDF generado: ${rutaPDF}`
                );

                resolve(rutaPDF);

            });

            stream.on('error', reject);

        } catch (error) {

            reject(error);

        }

    });

}

module.exports = generarPDF;
