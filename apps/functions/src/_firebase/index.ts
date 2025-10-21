export * from "./firestore";

import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

initializeApp();

export const firestore = getFirestore();
export const storage = getStorage();
export const auth = getAuth();

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "servitec-peru" ? "production" : "development";

export const isProduction = currentEnvironment === "production";

export const bucketAtFunction = projectId + ".appspot.com";
export const firestoreFieldValue = FieldValue;
export const firestoreTimestamp = Timestamp;
