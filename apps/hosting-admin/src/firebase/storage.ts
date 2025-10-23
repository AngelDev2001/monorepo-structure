import { storage } from "./index";

// export type FirebaseStorage = firebase.storage.Storage;
// export type FirebaseStorageReference = firebase.storage.Reference;
// export type FirebaseStorageError = firebase.storage.FirebaseStorageError;
//
// export type BucketType = 'default' | 'photos';
// export type ImageResize = '100x50' | '200x150' | '700x450';
//
// type Buckets = Record<BucketType, FirebaseStorage>;

export const buckets = {
  default: storage,
};

export const imageResizes = ["423x304", "313x370"];
