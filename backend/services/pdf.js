const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function generarPDF(datos) {

    try {

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

        const doc =
            new PDFDocument({

                size: [420, 900],
                margin: 0

            });

        const stream =
            fs.createWriteStream(
                rutaPDF
            );

        doc.pipe(stream);

        /*
        ==========================
        FLYER
        ==========================
        */

        try {

            if (datos.eventoFlyer) {

                const response =
                    await axios.get(
                        datos.eventoFlyer,
                        {
                            responseType:
                                'arraybuffer'
                        }
                    );

                const flyerBuffer =
                    Buffer.from(
                        response.data
                    );

                doc.image(
                    flyerBuffer,
                    0,
                    0,
                    {
                        width: 420,
                        height: 260
                    }
                );

            }

        } catch (error) {

            console.log(
                'Flyer no disponible'
            );

        }

        /*
        ==========================
        CAPA OSCURA
        ==========================
        */

        doc.rect(
            0,
            200,
            420,
            60
        )
        .fillOpacity(0.7)
        .fill('black');

        doc.fillOpacity(1);

        /*
        ==========================
        EVENTO
        ==========================
        */

        doc
            .fillColor('white')
            .fontSize(24)
            .text(
                datos.eventoNombre || 'Evento',
                20,
                210
            );

        doc
            .fontSize(12)
            .fillColor('#60a5fa')
            .text(
                datos.tipo,
                20,
                240
            );

        /*
        ==========================
        CUERPO
        ==========================
        */

        doc
            .fillColor('black')
            .fontSize(12);

        let y = 300;

        doc.text(
            'Fecha',
            25,
            y
        );

        doc.text(
            datos.eventoFecha || '',
            120,
            y
        );

        y += 30;

        doc.text(
            'Hora',
            25,
            y
        );

        doc.text(
            datos.eventoHora || '',
            120,
            y
        );

        y += 30;

        doc.text(
            'Lugar',
            25,
            y
        );

        doc.text(
            datos.eventoLugar || '',
            120,
            y
        );

        y += 50;

        doc
            .fontSize(10)
            .fillColor('gray')
            .text(
                'Titular del boleto',
                25,
                y
            );

        y += 20;

        doc
            .fontSize(16)
            .fillColor('black')
            .text(
                datos.nombre,
                25,
                y
            );

        y += 25;

        doc
            .fontSize(10)
            .fillColor('gray')
            .text(
                datos.correo,
                25,
                y
            );

        y += 40;

        doc
            .fontSize(14)
            .fillColor('black')
            .text(
                `Folio: ${datos.folio}`,
                25,
                y
            );

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

        doc.image(
            qrBuffer,
            110,
            580,
            {
                width: 200
            }
        );

        doc
            .fontSize(8)
            .fillColor('gray')
            .text(
                datos.uuid,
                50,
                800,
                {
                    width: 320,
                    align: 'center'
                }
            );

        doc
            .fontSize(10)
            .text(
                'Presenta este QR al ingresar al evento',
                50,
                825,
                {
                    width: 320,
                    align: 'center'
                }
            );

        doc.end();

        await new Promise(
            resolve =>
                stream.on(
                    'finish',
                    resolve
                )
        );

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
