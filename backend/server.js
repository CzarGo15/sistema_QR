require('dotenv').config();

const express = require('express');
const cors = require('cors');

const boletosRoutes =
require('./routes/boletos');

const validarRoutes =
require('./routes/validar');

const dashboardRoutes =
require('./routes/dashboard');

const eventosRoutes =
require('./routes/eventos');

const app = express();

app.use(cors());

app.use(express.json());

/*
==================================
RUTAS
==================================
*/

app.use(
    '/api/boletos',
    boletosRoutes
);

app.use(
    '/api/validar',
    validarRoutes
);

app.use(
    '/api/dashboard',
    dashboardRoutes
);

app.use(
    '/api/eventos',
    eventosRoutes
);

/*
==================================
HOME
==================================
*/

app.get('/', (req, res) => {

    res.json({

        sistema: 'Fiesta Retro',

        estado: 'Activo',

        version: '2.0'

    });

});

/*
==================================
UPLOAD FLYER
==================================
*/

const uploadRoutes =
require('./routes/upload');

app.use(
    '/api/upload',
    uploadRoutes
);

/*
==================================
SERVER
==================================
*/

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor iniciado en puerto ${PORT}`
    );

});
