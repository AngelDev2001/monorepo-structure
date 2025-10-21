import firebase from 'firebase/compat/app';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Document<T extends ObjectType> = { id: string } & T;

type DocumentData = firebase.firestore.DocumentData;
export type QuerySnapshot = firebase.firestore.QuerySnapshot;
export type Query = firebase.firestore.Query;
export type DocumentReference = firebase.firestore.DocumentReference;
type WriteResult = void;

export type WhereClauses<T extends ObjectType> = [
  NestedKeyOf<T>,
  firebase.firestore.WhereFilterOp,
  unknown,
];

export const querySnapshotToArray = <T extends ObjectType>(
  querySnapshot: QuerySnapshot
): Document<T>[] => {
  const documents: Document<T>[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    const document = documentSnapshot.data() as T;
    documents.push({ ...document, id: documentSnapshot.id });
  });

  return documents;
};

export const documentSnapshotToDocument = <T extends ObjectType>(
  docSnapshot: firebase.firestore.DocumentSnapshot
): T | undefined => {
  const document = docSnapshot as firebase.firestore.DocumentSnapshot<T>;

  return document.data();
};

export const fetchCollection = async <T extends ObjectType>(
  query: Query,
  whereClauses?: WhereClauses<T>[]
): Promise<Document<T>[]> => {
  let newQuery = query;

  whereClauses?.forEach(
    ([field, operation, value]) => (newQuery = newQuery.where(field, operation, value))
  );

  const querySnapshot = await newQuery.get();

  return querySnapshotToArray<T>(querySnapshot);
};

export const fetchCollectionOnce = async <T extends DocumentData>(
  query: Query
): Promise<Document<T>[]> => {
  const querySnapshot = await query.get();

  return querySnapshotToArray<T>(querySnapshot);
};

export const fetchDocument = async <T extends ObjectType>(
  query: DocumentReference
): Promise<T | undefined> => {
  const documentSnapshot = await query.get();

  return documentSnapshotToDocument(documentSnapshot);
};

export const setDocument = async <T extends ObjectType>(
  docRef: DocumentReference,
  document: T
): Promise<WriteResult> => docRef.set(document);

export const updateDocument = async <T extends ObjectType>(
  docRef: DocumentReference,
  document: T
): Promise<WriteResult> => docRef.update(document);

export const mergeDocument = async <T extends ObjectType>(
  docRef: DocumentReference,
  document: T
): Promise<WriteResult> => docRef.set(document, { merge: true });

export const deleteDocument = async (docRef: DocumentReference): Promise<WriteResult> =>
  docRef.delete();

export const uploadToFirebase = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `agreements/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
