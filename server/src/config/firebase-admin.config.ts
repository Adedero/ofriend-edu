import path from 'node:path';
import admin, { ServiceAccount } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
//import serviceAccount from '../../secrets/ofriend-6ce1c-firebase-adminsdk-fl83g-255faa2a44.json';

const pathToServiceAccount = path.resolve('secrets', 'ofriend-6ce1c-firebase-adminsdk-fl83g-255faa2a44.json');
(async function() {
  const serviceAccount = await import(pathToServiceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: 'gs://ofriend-6ce1c.appspot.com'
  });
})();

const bucket = getStorage().bucket();

export default bucket;
