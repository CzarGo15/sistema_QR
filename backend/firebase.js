const admin = require('firebase-admin');

const serviceAccount = require('./sistemaqr-a4d32-firebase-adminsdk-fbsvc-e5a2c6cb40.json');
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
@@ -10,4 +12,4 @@ const db = admin.firestore();

console.log('✅ Firebase conectado correctamente');

module.exports = db;
module.exports = db;
