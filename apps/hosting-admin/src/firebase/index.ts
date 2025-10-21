import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

import { currentConfig, currentEnvironment } from "../config";

firebase.initializeApp(currentConfig.firebaseApp);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

firestore.settings({ ignoreUndefinedProperties: true, merge: true });

const { version, apiUrl } = currentConfig;

console.log(currentEnvironment, ":", version);

export { currentConfig, firebase, firestore, version, auth, storage, apiUrl };
