require('dotenv').config();

const express = require('express');
const cors = require('cors');

const boletosRoutes =
require('./routes/boletos');

const validarRoutes =
require('./routes/validar');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
'/api/boletos',
boletosRoutes
);

app.use(
'/api/validar',
validarRoutes
);

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(
`Servidor iniciado en puerto ${PORT}`
);

});