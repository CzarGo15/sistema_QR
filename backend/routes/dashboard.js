router.get('/estadisticas', async (req, res) => {

    try {

        const snapshot =
            await db
                .collection('boletos')
                .get();

        let total = 0;
        let vip = 0;
        let general = 0;
        let usados = 0;
        let activos = 0;
        let ingresos = 0;

        snapshot.forEach(doc => {

            const b = doc.data();

            total++;

            ingresos += b.precio || 0;

            if (b.tipo === 'VIP') vip++;
            else general++;

            if (b.estado === 'usado')
                usados++;
            else
                activos++;

        });

        res.json({

            success: true,

            total,
            vip,
            general,
            usados,
            activos,
            ingresos

        });

    } catch (error) {

        res.status(500).json({
            success:false,
            error:error.message
        });

    }

});
