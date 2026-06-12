const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(
    process.env.RESEND_API_KEY
);

async function enviarBoleto(datos) {

    try {

        const pdfBuffer =
            fs.readFileSync(datos.pdf);

        const respuesta =
            await resend.emails.send({

                from:
                    'Fiesta Retro <onboarding@resend.dev>',

                to: [
                    datos.correo
                ],

                subject:
                    '🎉 Tus boletos para Fiesta Retro',

                html: `
                <div style="
                    font-family:Arial,sans-serif;
                    max-width:600px;
                    margin:auto;
                ">

                    <h2>
                        🎉 Gracias por tu compra
                    </h2>

                    <p>
                        Hola
                        <strong>${datos.nombre}</strong>
                    </p>

                    <p>
                        Adjuntamos tu boleto digital.
                    </p>

                    <p>
                        <strong>Folio:</strong>
                        ${datos.folio}
                    </p>

                    <p>
                        <strong>Tipo:</strong>
                        ${datos.tipo}
                    </p>

                    <p>
                        Presenta este boleto al ingresar.
                    </p>

                </div>
                `,

                attachments: [

                    {

                        filename:
                            `boleto-${datos.folio}.pdf`,

                        content:
                            pdfBuffer.toString('base64')

                    }

                ]

            });

        console.log(
            '📧 CORREO ENVIADO'
        );

        console.log(respuesta);

        return true;

    } catch (error) {

        console.error(
            '❌ ERROR RESEND:',
            error
        );

        throw error;

    }

}

module.exports = enviarBoleto;
