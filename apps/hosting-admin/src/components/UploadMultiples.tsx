import React, { useEffect, useState } from "react";
import { buckets } from "../firebase/storage";
import { ComponentContainer, modalConfirm, notification } from "./ui";
import AntdUpload from "antd/lib/upload";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import styled from "styled-components";
import {
  deleteFileAndFileThumbFromStorage,
  isRcFile,
  uploadFile,
} from "./utils/upload/functions";
import {
  PreviewFile,
  UploadBody,
  UploadDraggerBody,
} from "./utils/upload/components";
import { isEmpty } from "lodash";
import { useLoadings } from "../hooks";
import * as assert from "assert";
import { BucketType, ImageResize, UploadedFile } from "./types/upload.types";

type UploadValue = UploadedFile[];

interface UploadMultipleProps {
  accept?: string;
  bucket?: BucketType;
  buttonText?: string;
  dragger?: boolean;
  hidden?: boolean;
  name: string;
  error?: boolean;
  helperText?: string;
  filePath: string;
  isImage?: boolean;
  withThumbImage?: boolean;
  label?: string;
  required?: boolean;
  resize?: ImageResize;
  additionalFields?: Record<string, any> | null;
  value?: UploadValue | null;
  onChange: (files?: UploadValue) => void;
  onUploading?: (uploading: boolean) => void;
  limit?: number;
  keepFilesAfterUpload?: boolean;
}

interface UploadFileWithStatus extends UploadFile {
  status?: "uploading" | "done" | "error" | "success";
  url?: string;
  thumbUrl?: string;
}

interface CustomRequestOptions {
  file: RcFile;
  onError?: (error: any) => void;
  onProgress?: (event: { percent: number }) => void;
  onSuccess?: (message: string, xhr: XMLHttpRequest) => void;
}

export const UploadMultiple: React.FC<UploadMultipleProps> = ({
  accept,
  bucket = "default",
  buttonText = "Upload image",
  dragger = true,
  hidden,
  name,
  error = false,
  helperText,
  filePath,
  isImage = true,
  withThumbImage = true,
  label,
  required = false,
  resize = "423x304",
  additionalFields = null,
  value,
  onChange,
  onUploading,
  limit,
  keepFilesAfterUpload = true,
}) => {
  const storage = buckets[bucket];

  const [files, setFiles] = useState<UploadFileWithStatus[]>([]);
  const [uploadings, setUploadings] = useLoadings();
  const [currentFile, setCurrentFile] = useState<UploadFileWithStatus | null>(
    null
  );
  const [preventFirstEffect, setPreventFirstEffect] = useState<boolean>(false);

  useEffect(() => {
    if (!value) return;

    setFiles(value.map((file) => ({ ...file, status: "done" })));
  }, [JSON.stringify(value)]);

  useEffect(() => {
    onUploading?.(uploadings);
  }, [uploadings, onUploading]);

  useEffect(() => {
    if (!preventFirstEffect) return setPreventFirstEffect(true);

    if (!keepFilesAfterUpload && isEmpty(files)) return;

    const uploadedFiles = files
      .filter((file) => file.status !== "done")
      .every((file) => file.status === "success");

    uploadedFiles && afterUpload();
  }, [JSON.stringify(files)]);

  const afterUpload = (): void => {
    const newFiles = !isEmpty(files)
      ? files.map((file) => uploadFileToFile(file))
      : [];

    onChange(newFiles);

    !keepFilesAfterUpload && setFiles([]);
  };

  const uploadFileToFile = (file: UploadFileWithStatus): UploadedFile => {
    assert(file.url, "Missing url");

    const uploadedFile: UploadedFile = {
      ...additionalFields,
      uid: file.uid,
      name: file.name,
      url: file.url,
    };

    if (isImage && file.thumbUrl) {
      uploadedFile.thumbUrl = file.thumbUrl;
    }

    return uploadedFile;
  };

  const customRequest = async (
    requestOption: CustomRequestOptions
  ): Promise<void> => {
    assert(isRcFile(requestOption.file), "Options.file not is File");

    try {
      setUploadings({ [requestOption.file.uid]: true });

      const { newFile, status } = await uploadFile({
        filePath,
        resize,
        storage,
        isImage,
        withThumbImage,
        options: {
          file: requestOption.file,
          onError: (error) => requestOption.onError?.(error),
          onProgress: (percent) =>
            requestOption.onProgress?.({
              ...new ProgressEvent("load"),
              percent: percent,
            }),
          onSuccess: (message) =>
            requestOption.onSuccess?.(message, new XMLHttpRequest()),
        },
      });

      if (status) return addFileToFiles(newFile);

      await deleteFile(newFile);
    } catch (e) {
      uploadErrorMessage();
      console.error("Upload - custom request", e);
    } finally {
      setUploadings({ [requestOption.file.uid]: false });
    }
  };

  const uploadErrorMessage = (): void =>
    notification({
      type: "error",
      title: "Error uploading the file",
      description: "Try again!",
    });

  const addFileToFiles = (file: UploadFileWithStatus): void =>
    setFiles((prevFiles) => {
      const index = prevFiles.findIndex(
        (prevFile) => prevFile.uid === file.uid
      );

      const nextFiles = [...prevFiles];
      nextFiles[index] = file;

      return nextFiles;
    });

  const onChangeUpload = ({
    file,
    fileList,
  }: {
    file: UploadFile;
    fileList: UploadFile[];
  }): void => {
    if (file.status === "done") return;

    setFiles(fileList);
  };

  const onPreview = (file: UploadFile): void => setCurrentFile(file);

  const onRemove = async (file: UploadFile): Promise<boolean> =>
    new Promise((resolve) => {
      modalConfirm({
        content: "The image will be removed.",
        onOk: async () => {
          await deleteFile(file);
          resolve(true);
        },
      });
    });

  const deleteFile = async (file: UploadFile): Promise<void> => {
    await deleteFileAndFileThumbFromStorage(storage, filePath, file.name);

    setFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.uid !== file.uid)
    );
  };

  return (
    <>
      <ComponentContainer.filled
        animation={false}
        required={required}
        hidden={hidden}
        error={error}
        helperText={helperText}
        label={label}
      >
        <WrapperComponents>
          {dragger ? (
            <AntdUpload.Dragger
              name={name}
              fileList={files}
              multiple={true}
              listType="picture"
              accept={accept}
              customRequest={customRequest as any}
              onRemove={onRemove}
              onPreview={onPreview}
              onChange={onChangeUpload}
            >
              <UploadDraggerBody
                hint={`Soportado para cargar múltiples ${isImage ? "imágenes" : "documentos"}.`}
                text={`Haga clic aquí o arrastre para cargar ${isImage ? "las imágenes" : "los documentos"}.`}
              />
            </AntdUpload.Dragger>
          ) : (
            <UploadStyled
              name={name}
              fileList={files}
              multiple={true}
              listType="picture"
              accept={accept}
              customRequest={customRequest as any}
              onRemove={onRemove}
              onPreview={onPreview}
              onChange={onChangeUpload}
            >
              <UploadBody
                visible={limit ? files.length < limit : true}
                buttonText={buttonText}
              />
            </UploadStyled>
          )}
        </WrapperComponents>
      </ComponentContainer.filled>
      {currentFile?.url && (
        <PreviewFile
          url={currentFile.url}
          thumbUrl={currentFile?.thumbUrl || currentFile?.url}
          isImage={isImage}
          onCancel={() => setCurrentFile(null)}
          visible={!!currentFile}
        />
      )}
    </>
  );
};

const UploadStyled = styled(AntdUpload)`
  cursor: pointer;

  .ant-upload.ant-upload-select {
    display: block;

    .ant-upload {
      button {
        text-align: left;
      }
    }
  }

  .ant-upload-list .ant-upload-list-item {
    margin: 7px 5px;
  }
`;

const WrapperComponents = styled.div`
  margin: 11px;
`;
