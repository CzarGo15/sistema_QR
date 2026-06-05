const admin = require('firebase-admin');

const serviceAccount = require('./sistemaqr-a4d32-firebase-adminsdk-fbsvc-e5a2c6cb40.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('✅ Firebase conectado correctamente');

module.exports = db;