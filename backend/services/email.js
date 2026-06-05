const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {

        user: process.env.GMAIL_USER,

        pass: process.env.GMAIL_PASS

    }

});

async function enviarBoleto(datos) {

    await transporter.sendMail({

        from: `"Fiesta Retro" <${process.env.GMAIL_USER}>`,

        to: datos.correo,

        cc: process.env.GMAIL_USER,

        subject: '🎉 Tus boletos para Fiesta Retro',

        html: `
        <div style="font-family:Arial,sans-serif">

            <h2>🎉 Gracias por tu compra</h2>

            <p>Hola <strong>${datos.nombre}</strong>,</p>

            <p>
                Adjuntamos tu boleto digital para
                <strong>Fiesta Retro</strong>.
            </p>

            <p>
                <strong>Folio:</strong> ${datos.folio}
            </p>

            <p>
                <strong>Tipo:</strong> ${datos.tipo}
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
                filename: `boleto-${datos.folio}.pdf`,
                path: datos.pdf
            }
        ]

    });

}

module.exports = enviarBoleto;