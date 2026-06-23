const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generarPDF(datos) {

    return new Promise((resolve, reject) => {

        const rutaPDF = path.join(
            __dirname,
            `../pdfs/boleto-${datos.folio}.pdf`
        );

        const doc = new PDFDocument();

        const stream =
            fs.createWriteStream(rutaPDF);

        doc.pipe(stream);

        doc.fontSize(25);
        doc.text('FIESTA RETRO');

        doc.moveDown();

        doc.text(`Nombre: ${datos.nombre}`);
        doc.text(`Correo: ${datos.correo}`);
        doc.text(`Folio: ${datos.folio}`);
        doc.text(`UUID: ${datos.uuid}`);

        doc.end();

        stream.on('finish', () => {

            console.log('PDF OK');

            resolve(rutaPDF);

        });

        stream.on('error', reject);

    });

}

module.exports = generarPDF;
