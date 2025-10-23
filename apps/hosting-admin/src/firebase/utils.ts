import firebase from "firebase/compat/app";

export const now = () => firebase.firestore.Timestamp.now();
