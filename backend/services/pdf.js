const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generarPDF(datos) {

    try {

        const plantillaPath = path.join(
            __dirname,
            '../../frontend/boleto.html'
        );

        let html = fs.readFileSync(
            plantillaPath,
            'utf8'
        );

        html = html.replaceAll(
            '{{NOMBRE}}',
            datos.nombre
        );

        html = html.replaceAll(
            '{{CORREO}}',
            datos.correo
        );

        html = html.replaceAll(
            '{{FOLIO}}',
            datos.folio
        );

        html = html.replaceAll(
            '{{TIPO}}',
            datos.tipo
        );

        html = html.replaceAll(
            '{{UUID}}',
            datos.uuid
        );

        html = html.replaceAll(
            '{{QR}}',
            datos.qr
        );

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

        const nombreArchivo =
            `boleto-${datos.folio}.pdf`;

        const rutaPDF =
            path.join(
                carpetaPDF,
                nombreArchivo
            );

        const browser =
            await puppeteer.launch({
                headless: true
            });

        const page =
            await browser.newPage();

        await page.setContent(
            html,
            {
                waitUntil: 'networkidle0'
            }
        );

        await page.pdf({

            path: rutaPDF,

            format: 'A4',

            printBackground: true,

            margin: {

                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'

            }

        });

        await browser.close();

        console.log(
            `PDF generado: ${rutaPDF}`
        );

        return rutaPDF;

    } catch (error) {

        console.error(
            'Error generando PDF:',
            error
        );

        throw error;

    }

}

module.exports = generarPDF;