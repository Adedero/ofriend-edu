//import path from 'node:path';
import admin, { ServiceAccount } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { Bucket } from '@google-cloud/storage';
import serviceAccount from '../../secrets/ofriend-6ce1c-firebase-adminsdk-fl83g-255faa2a44.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: 'gs://ofriend-6ce1c.appspot.com',
});

const bucket: Bucket = getStorage().bucket();
export default bucket;

/* const initializeFirebaseStorage = async () => {
  try {
    const serviceAccount = await import(pathToServiceAccount) as { default: ServiceAccount };

    console.log('Service account: ', serviceAccount)

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount.default),
      storageBucket: 'gs://ofriend-6ce1c.appspot.com',
    });

    bucket = getStorage().bucket();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw new Error('Failed to initialize Firebase');
  }
}; */

