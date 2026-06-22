const { Storage } = require('@google-cloud/storage');

const storage = new Storage({

    credentials: JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    ),

    projectId: 'sistemaqr-a4d32'

});

const bucket = storage.bucket(
    'sistemaqr-a4d32.firebasestorage.app'
);

async function subirPDF(rutaPDF, folio) {

    try {

        const nombreArchivo =
            `boletos/${folio}.pdf`;

        await bucket.upload(
            rutaPDF,
            {
                destination: nombreArchivo,
                resumable: false
            }
        );

        const file =
            bucket.file(nombreArchivo);

        await file.makePublic();

        const urlPublica =
            `https://storage.googleapis.com/${bucket.name}/${nombreArchivo}`;

        console.log(
            `☁️ PDF subido correctamente: ${urlPublica}`
        );

        return urlPublica;

    } catch (error) {

        console.error(
            '❌ ERROR STORAGE:',
            error
        );

        throw error;

    }

}

module.exports = subirPDF;
