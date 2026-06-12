const path = require('path');
const { bucket } = require('../firebase');

async function subirPDF(rutaPDF, folio) {

```
const nombreArchivo =
    `boletos/${folio}.pdf`;

await bucket.upload(
    rutaPDF,
    {
        destination:
            nombreArchivo
    }
);

const file =
    bucket.file(
        nombreArchivo
    );

await file.makePublic();

return `https://storage.googleapis.com/${bucket.name}/${nombreArchivo}`;
```

}

module.exports = subirPDF;
