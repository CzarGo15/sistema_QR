```javascript
const express = require('express');
const db = require('../firebase');

const router = express.Router();

/*
==================================
CONSULTAR BOLETO
POST /api/validar/buscar
==================================
*/

router.post('/buscar', async (req, res) => {

    try {

        const { uuid } = req.body;

        if (!uuid) {

            return res.status(400).json({
                success: false,
                error: 'UUID requerido'
            });

        }

        const doc = await db
            .collection('boletos')
            .doc(uuid)
            .get();

        if (!doc.exists) {

            return res.json({
                success: false,
                error: 'BOLETO NO ENCONTRADO'
            });

        }

        const boleto = doc.data();

        if (boleto.estado === 'usado') {

            return res.json({

                success: false,

                usado: true,

                error: 'BOLETO YA UTILIZADO',

                boleto

            });

        }

        return res.json({

            success: true,

            boleto

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

/*
==================================
CONFIRMAR ACCESO
POST /api/validar/confirmar
==================================
*/

router.post('/confirmar', async (req, res) => {

    try {

        const {
            uuid,
            validador
        } = req.body;

        const ref =
            db.collection('boletos')
                .doc(uuid);

        const doc =
            await ref.get();

        if (!doc.exists) {

            return res.json({

                success: false,

                error: 'BOLETO NO ENCONTRADO'

            });

        }

        const boleto = doc.data();

        if (boleto.estado === 'usado') {

            return res.json({

                success: false,

                error: 'BOLETO YA UTILIZADO'

            });

        }

        await ref.update({

            estado: 'usado',

            validadoPor: validador,

            fechaValidacion: new Date()

        });

        return res.json({

            success: true,

            mensaje: 'ACCESO REGISTRADO'

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
```
