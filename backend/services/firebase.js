const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };