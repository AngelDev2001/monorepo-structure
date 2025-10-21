import * as admin from "firebase-admin";
interface DocumentCreate {
    createAt: admin.firestore.Timestamp;
    updateAt: admin.firestore.Timestamp;
    isDeleted?: false;
}
interface DocumentUpdate {
    updateAt: admin.firestore.Timestamp;
}
interface DocumentDelete {
    updateAt: admin.firestore.Timestamp;
    isDeleted?: true;
}
interface Return {
    assignCreateProps: <U>(document: U) => U & DocumentCreate;
    assignDeleteProps: <U>(document: U) => U & DocumentDelete;
    assignUpdateProps: <U>(document: U) => U & DocumentUpdate;
}
export declare const defaultFirestoreProps: (isSoftDelete?: boolean) => Return;
export {};
//# sourceMappingURL=defaultFirestoreProps.d.ts.map