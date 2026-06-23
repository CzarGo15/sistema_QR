const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generarPDF(datos) {

    try {

        const plantilla =
            path.join(
                __dirname,
                '../../frontend/boleto.html'
            );

        let html =
            fs.readFileSync(
                plantilla,
                'utf8'
            );

        html = html.replace(
            /{{NOMBRE}}/g,
            datos.nombre
        );

        html = html.replace(
            /{{CORREO}}/g,
            datos.correo
        );

        html = html.replace(
            /{{FOLIO}}/g,
            datos.folio
        );

        html = html.replace(
            /{{TIPO}}/g,
            datos.tipo
        );

        html = html.replace(
            /{{UUID}}/g,
            datos.uuid
        );

        html = html.replace(
            /{{QR}}/g,
            datos.qr
        );

        const carpetaPDF =
            path.join(
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

        const rutaPDF =
            path.join(
                carpetaPDF,
                `boleto-${datos.folio}.pdf`
            );

        const browser =
            await puppeteer.launch({

                headless: true,

                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]

            });

        const page =
            await browser.newPage();

        await page.setContent(
            html,
            {
                waitUntil:
                    'networkidle0'
            }
        );

        await page.pdf({

            path: rutaPDF,

            printBackground: true,

            width: '420px',

            height: '900px',

            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }

        });

        await browser.close();

        console.log(
            `PDF generado: ${rutaPDF}`
        );

        return rutaPDF;

    } catch (error) {

        console.error(
            'ERROR PDF:',
            error
        );

        throw error;

    }

}

module.exports = generarPDF;
