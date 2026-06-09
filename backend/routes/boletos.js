const express = require('express');
const { nanoid } = require('nanoid');

const db = require('../firebase');

const generarQR = require('../services/qr');
const generarPDF = require('../services/pdf');
const enviarBoleto = require('../services/email');

const router = express.Router();

router.post('/comprar', async (req, res) => {

try {

    console.log('POST /comprar ejecutado');

    const {
        nombre,
        correo,
        telefono,
        tipo,
        cantidad
    } = req.body;

    if (!nombre || !correo) {

        return res.status(400).json({

            success: false,

            error: 'Nombre y correo son obligatorios'

        });

    }

    const boletos = [];

    const contadorRef =
        db.collection('config')
            .doc('contadorBoletos');

    for (let i = 0; i < cantidad; i++) {

        // ==========================
        // FOLIO CONSECUTIVO
        // ==========================

        const folio = await db.runTransaction(
            async (transaction) => {

                const doc =
                    await transaction.get(contadorRef);

                let ultimoFolio = 0;

                if (doc.exists) {

                    ultimoFolio =
                        doc.data().ultimoFolio || 0;

                }

                const nuevoFolio =
                    ultimoFolio + 1;

                transaction.set(
                    contadorRef,
                    {
                        ultimoFolio: nuevoFolio
                    }
                );

                return `EXL-${String(nuevoFolio)
                    .padStart(6, '0')}`;

            }
        );

        // ==========================
        // UUID ÚNICO
        // ==========================

        let uuid;
        let existeUUID = true;

        while (existeUUID) {

            uuid = `EXL-${nanoid(12)}`;

            const existe =
                await db
                    .collection('boletos')
                    .doc(uuid)
                    .get();

            existeUUID = existe.exists;

        }

        // ==========================
        // PRECIO
        // ==========================

        const precio =
            tipo === 'VIP'
                ? 350
                : 250;

        // ==========================
        // QR
        // ==========================

        const qr =
            await generarQR(uuid);

        // ==========================
        // OBJETO BOLETO
        // ==========================

        const boleto = {

            uuid,
            folio,
            nombre,
            correo,
            telefono,
            tipo,
            precio,

            estado: 'activo',

            fechaCompra: new Date()

        };

        // ==========================
        // GUARDAR FIREBASE
        // ==========================

        await db
            .collection('boletos')
            .doc(uuid)
            .set(boleto);

        console.log(
            `✅ Guardado ${folio}`
        );

        // ==========================
        // GENERAR PDF
        // ==========================

        const rutaPDF =
            await generarPDF({

                nombre,
                correo,
                folio,
                tipo,
                uuid,
                qr

            });

        console.log(
            `📄 PDF generado ${folio}`
        );

        // ==========================
        // ENVIAR CORREO
        // ==========================

        try {

            await enviarBoleto({

                nombre,
                correo,
                folio,
                tipo,
                pdf: rutaPDF

            });

            console.log(
                `📧 Correo enviado ${correo}`
            );

        } catch (emailError) {

            console.error(
                '❌ ERROR EMAIL:',
                emailError.message
            );

        }

        boletos.push({

            ...boleto,

            pdf: rutaPDF

        });

    }

    return res.json({

        success: true,

        total: boletos.length,

        boletos

    });

} catch (error) {

    console.error(error);

    return res.status(500).json({

        success: false,

        error: error.message

    });

}

});

module.exports = router;
