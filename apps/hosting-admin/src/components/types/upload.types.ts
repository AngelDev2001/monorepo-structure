import type { RcFile } from "antd/es/upload/interface";

export type BucketType = "default" | "public" | string;
export type ImageResize = "1000x1000" | "1480x2508" | "423x304" | string;

export interface UploadedFile {
  uid: string;
  name: string;
  url: string;
  thumbUrl?: string;
}

export interface Image extends UploadedFile {
  status?: "uploading" | "done" | "error" | "success";
}

export interface UploadFileConfig {
  url: {
    path: string;
    fileName: string;
  };
  thumbUrl: {
    path: string;
    fileName: string;
  };
}

export interface UploadFileParams {
  filePath: string;
  fileName?: string;
  storage: any; // Firebase storage instance
  resize: string;
  isImage: boolean;
  withThumbImage: boolean;
  options: {
    file: RcFile;
    onError: (error: any) => void;
    onProgress: (percent: number) => void;
    onSuccess: (message: string) => void;
  };
}

export interface CopyFilesTo {
  bucket: BucketType;
  filePath: string;
  fileName?: string;
  resize?: ImageResize;
  isImage?: boolean;
  withThumbImage?: boolean;
  storage?: any;
}
