import { imageResizes } from "../../../firebase/storage";
import { timeoutPromise } from "../../../utils";
import { isObject } from "lodash";
import type { RcFile } from "antd/es/upload/interface";
import * as assert from "assert";
import type { UploadFileParams } from "../../types/upload.types";

interface StorageError {
  code: string;
  message: string;
}

interface UploadFileWithStatus {
  uid: string;
  name: string;
  url?: string;
  thumbUrl?: string;
  status?: "uploading" | "done" | "error" | "success";
}

interface UploadFileResult {
  newFile: UploadFileWithStatus;
  status: boolean;
}

export const isRcFile = (data: any): data is RcFile =>
  isObject(data) && "uid" in data;

export const uploadFile = async ({
  filePath,
  fileName,
  storage,
  resize,
  isImage,
  withThumbImage,
  options: { file, onError, onProgress, onSuccess },
}: UploadFileParams): Promise<UploadFileResult> =>
  await new Promise((resolve, reject) => {
    assert(isRcFile(file), "Options.file not is File");

    const fileExtension = file.name.split(".").pop() || "";
    const finalFileName =
      fileName || file.name.replace(`.${fileExtension}`, "");

    const fileConfig = {
      url: {
        path: filePath,
        fileName: `${finalFileName}.${fileExtension}`,
      },
      thumbUrl: {
        path: `${filePath}/thumbs`,
        fileName: `${finalFileName}_${resize}.webp`,
      },
    };

    storage
      .ref(fileConfig.url.path)
      .child(fileConfig.url.fileName)
      .put(file)
      .on(
        "state_changed",
        ({
          bytesTransferred,
          totalBytes,
        }: {
          bytesTransferred: number;
          totalBytes: number;
        }) => onProgress((bytesTransferred / totalBytes) * 95),
        (error: any) => {
          onError(error);
          reject(error);
        },
        () => uploadComplete(mapUploadFile(file), fileConfig)
      );

    const uploadComplete = async (
      newFile: UploadFileWithStatus,
      fileConfig: typeof fileConfig
    ): Promise<void> => {
      try {
        newFile.url = await storage
          .ref(fileConfig.url.path)
          .child(fileConfig.url.fileName)
          .getDownloadURL();

        if (isImage && withThumbImage) {
          const fileThumbUrlRef = storage
            .ref(fileConfig.thumbUrl.path)
            .child(fileConfig.thumbUrl.fileName);

          const thumbUrl = await keepTryingGetThumbURL(fileThumbUrlRef);

          assert(typeof thumbUrl === "string", "thumbUrl no is string");

          newFile.thumbUrl = thumbUrl;
        }

        newFile.status = "success";
        newFile.name = fileConfig.url.fileName;

        onSuccess("ok");
        resolve({ newFile, status: true });
      } catch (error) {
        console.error("Upload Complete", { error, file });
        await timeoutPromise(5000);
        onError(error);
        resolve({ newFile, status: false });
      }
    };
  });

const mapUploadFile = (file: RcFile): UploadFileWithStatus => ({
  uid: file.uid,
  name: file.name,
});

export const deleteFileAndFileThumbFromStorage = async (
  storage: any,
  filePath: string,
  fileName: string
): Promise<void> => {
  const extension = fileName.split(".").pop() || "";

  const pathImage = `${filePath}/${fileName}`;

  const pathThumbImages = imageResizes.map(
    (resizeImage) =>
      `${filePath}/thumbs/${fileName.replace(
        `.${extension}`,
        ""
      )}_${resizeImage}.${extension}`
  );

  const uris = [pathImage, ...pathThumbImages].map(
    (url) => `gs://${storage.ref().bucket}/${url}`
  );

  try {
    await Promise.all(uris.map((uri) => deleteFileFromStorage(storage, uri)));
  } catch (error) {
    console.error("Delete file and file thumb", error);
  }
};

export const deleteFileFromStorage = async (
  storage: any,
  url: string
): Promise<void | null> => {
  try {
    console.log("url", url);
    const ref = storage.refFromURL(url);

    return await storage.ref(ref.fullPath).delete();
  } catch (error) {
    if (isObject(error) && "code" in error) {
      const storageError = error as StorageError;
      if (storageError.code === "storage/object-not-found") return null;
    }

    throw error;
  }
};

export const keepTryingGetThumbURL = async (
  storageRef: any,
  triesCount: number = 10
): Promise<string> => {
  console.info("Getting thumb download URL...");

  if (triesCount < 0) return Promise.reject("out of tries");

  try {
    return await storageRef.getDownloadURL();
  } catch (error) {
    if (isObject(error) && "code" in error) {
      const storageError = error as StorageError;
      if (storageError.code === "storage/object-not-found") {
        await timeoutPromise(1000);
        return keepTryingGetThumbURL(storageRef, triesCount - 1);
      } else {
        return Promise.reject(storageError);
      }
    }
    return Promise.reject(error);
  }
};
