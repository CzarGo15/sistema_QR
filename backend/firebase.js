const admin = require('firebase-admin');

const serviceAccount = JSON.parse(
process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({

```
credential:
    admin.credential.cert(
        serviceAccount
    ),

storageBucket:
    'sistemaqr-a4d32.firebasestorage.app'
```

});

const db =
admin.firestore();

const bucket =
admin.storage().bucket();

console.log(
'✅ Firebase conectado correctamente'
);

module.exports = {

```
db,
bucket
```

};
