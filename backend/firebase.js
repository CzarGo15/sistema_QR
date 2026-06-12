const admin = require('firebase-admin');


const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
@@ -10,4 +12,4 @@ const db = admin.firestore();

console.log('✅ Firebase conectado correctamente');

module.exports = db;
module.exports = db;
