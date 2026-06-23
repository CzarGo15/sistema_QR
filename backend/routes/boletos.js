const express = require('express');
const { nanoid } = require('nanoid');

const db = require('../firebase');

const generarQR = require('../services/qr');
const generarPDF = require('../services/pdf');
const subirPDF = require('../services/storage');

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

                    const folioTexto =
                        String(nuevoFolio)
                            .padStart(6, '0');

                    return 'EXL-' + folioTexto;

                }
            );

            let uuid;
            let existeUUID = true;

            while (existeUUID) {

                uuid = 'EXL-' + nanoid(12);

                const existe =
                    await db
                        .collection('boletos')
                        .doc(uuid)
                        .get();

                existeUUID =
                    existe.exists;

            }

            const precio =
                tipo === 'VIP'
                    ? 350
                    : 250;

            const qr =
                await generarQR(uuid);

            const boleto = {

    uuid,
    folio,
    nombre,
    correo,
    telefono,
    tipo,
    precio,
    qr,

    estado: 'activo',

    fechaCompra: new Date()

};

            await db
                .collection('boletos')
                .doc(uuid)
                .set(boleto);

            console.log(
                `✅ Guardado ${folio}`
            );

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

            const urlPDF =
                await subirPDF(
                    rutaPDF,
                    folio
                );

            console.log(
                `☁️ PDF subido ${urlPDF}`
            );

            await db
                .collection('boletos')
                .doc(uuid)
                .update({

                    pdfUrl: urlPDF

                });

            boletos.push({

                ...boleto,

                pdfUrl: urlPDF

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
