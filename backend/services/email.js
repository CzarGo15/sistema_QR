const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com',

    port: 465,

    secure: true,

    auth: {

        user: process.env.GMAIL_USER,

        pass: process.env.GMAIL_PASS

    }

});

async function enviarBoleto(datos) {

    try {

        console.log('====================');
        console.log(
            'GMAIL_USER:',
            process.env.GMAIL_USER
        );

        console.log(
            'GMAIL_PASS:',
            process.env.GMAIL_PASS
                ? 'CONFIGURADA'
                : 'NO CONFIGURADA'
        );
        console.log('====================');

        await transporter.verify();

        console.log(
            '✅ SMTP Gmail conectado correctamente'
        );

        await transporter.sendMail({

            from: `"Fiesta Retro" <${process.env.GMAIL_USER}>`,

            to: datos.correo,

            cc: process.env.GMAIL_USER,

            subject: '🎉 Tus boletos para Fiesta Retro',

            html: `

            <div style="font-family:Arial,sans-serif">

                <h2>
                    🎉 Gracias por tu compra
                </h2>

                <p>
                    Hola
                    <strong>${datos.nombre}</strong>,
                </p>

                <p>
                    Adjuntamos tu boleto digital para
                    <strong>Fiesta Retro</strong>.
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
                    Presenta el código QR al ingresar
                    al evento.
                </p>

                <p>
                    ¡Nos vemos en la pista! 🕺💃
                </p>

            </div>

            `,

            attachments: [

                {

                    filename:
                        `boleto-${datos.folio}.pdf`,

                    path: datos.pdf

                }

            ]

        });

        console.log(
            `📧 Correo enviado a ${datos.correo}`
        );

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
