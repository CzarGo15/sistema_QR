const admin = require('firebase-admin');


const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)


console.log('✅ Firebase conectado correctamente');

module.exports = db;
module.exports = db;
