const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(
    process.env.RESEND_API_KEY
);

async function enviarBoleto(datos) {

    try {

        const pdfBuffer =
            fs.readFileSync(datos.pdf);

        const resultado =
            await resend.emails.send({

                from:
                    'Fiesta Retro <onboarding@resend.dev>',

                to:
                    datos.correo,

                subject:
                    '🎉 Tus boletos para Fiesta Retro',

                html: `
                <h2>Gracias por tu compra</h2>

                <p>
                    Hola ${datos.nombre}
                </p>

                <p>
                    Folio: ${datos.folio}
                </p>

                <p>
                    Tipo: ${datos.tipo}
                </p>

                <p>
                    Tu boleto se encuentra adjunto.
                </p>
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

        console.log(resultado);

        return true;

    } catch (error) {

        console.error(
            '❌ ERROR EMAIL:',
            error
        );

        throw error;

    }

}

module.exports = enviarBoleto;
