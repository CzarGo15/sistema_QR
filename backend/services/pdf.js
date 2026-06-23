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

            console.log('Generando PDF...');
            console.log(datos);

            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            const stream =
                fs.createWriteStream(
                    rutaPDF
                );

            doc.pipe(stream);

            // PRUEBA SIMPLE

            doc
                .fontSize(30)
                .fillColor('red')
                .text(
                    'PRUEBA PDF',
                    50,
                    50
                );

            doc
                .rect(
                    50,
                    120,
                    300,
                    100
                )
                .stroke();

            doc
                .fontSize(20)
                .fillColor('black')
                .text(
                    `Folio: ${datos.folio}`,
                    60,
                    150
                );

            doc
                .fontSize(16)
                .text(
                    `Nombre: ${datos.nombre}`,
                    60,
                    190
                );

            console.log(
                'Finalizando PDF...'
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
