import * as firebase from "firebase-admin";
type Document<T extends ObjectType> = {
  id: string;
} & T;
type DocumentData = firebase.firestore.DocumentData;
export type QuerySnapshot = FirebaseFirestore.QuerySnapshot;
export type Query = FirebaseFirestore.Query;
export type DocumentReference = FirebaseFirestore.DocumentReference;
type WriteResult = FirebaseFirestore.WriteResult;
export type WhereClauses<T extends ObjectType> = [
  NestedKeyOf<T>,
  FirebaseFirestore.WhereFilterOp,
  unknown,
];
export declare const querySnapshotToArray: <T extends ObjectType>(
  querySnapshot: QuerySnapshot
) => Document<T>[];
export declare const documentSnapshotToDocument: <T extends ObjectType>(
  docSnapshot: FirebaseFirestore.DocumentSnapshot
) => T | undefined;
export declare const fetchCollection: <T extends ObjectType>(
  query: Query,
  whereClauses?: WhereClauses<T>[]
) => Promise<Document<T>[]>;
export declare const fetchCollectionOnce: <T extends DocumentData>(
  query: Query
) => Promise<Document<T>[]>;
export declare const fetchDocument: <T extends ObjectType>(
  query: DocumentReference
) => Promise<T | undefined>;
export declare const setDocument: <T extends ObjectType>(
  docRef: DocumentReference,
  document: T
) => Promise<WriteResult>;
export declare const updateDocument: <T extends ObjectType>(
  docRef: DocumentReference,
  document: T
) => Promise<WriteResult>;
export declare const mergeDocument: <T extends ObjectType>(
  docRef: DocumentReference,
  document: T
) => Promise<WriteResult>;
export declare const deleteDocument: (
  docRef: DocumentReference
) => Promise<WriteResult>;
export {};
//# sourceMappingURL=firestore.d.ts.map
