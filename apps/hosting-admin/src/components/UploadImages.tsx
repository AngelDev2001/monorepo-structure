import React, { useState } from "react";
import { buckets } from "../firebase/storage";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  deleteFileAndFileThumbFromStorage,
  keepTryingGetThumbURL,
} from "./utils/upload/functions";
import { isString } from "lodash";
import { v1 as uuidv1 } from "uuid";
import { SortableImages } from "./SortableImages";
import { IconAction, modalConfirm, Spin } from "./ui";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { BucketType, Image, ImageResize } from "./types/upload.types";
import { theme } from "../styles";

export interface UploadImagesProps {
  images: Image[];
  onChange: (images: Image[]) => Promise<void>;
  bucketType?: BucketType;
  imageResize?: ImageResize;
  path: string;
  onUploading?: (uploading: boolean) => void;
}

interface UploadedImage {
  url: string;
  thumbUrl: string;
  uid: string;
  name: string;
}

export const UploadImages: React.FC<UploadImagesProps> = ({
  images,
  onChange,
  bucketType = "default",
  imageResize = "1000x1000",
  path,
  onUploading,
}) => {
  const firebaseStorage = buckets[bucketType];

  const [uploading, setUploading] = useState<boolean>(false);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void =>
    event.preventDefault();

  const onDrop = async (
    event: React.DragEvent<HTMLDivElement>
  ): Promise<void> => {
    event.preventDefault();
    await uploadFiles(event.dataTransfer.files);
  };

  const onInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    event.target.files && (await uploadFiles(event.target.files));
  };

  const uploadFiles = async (fileList: FileList): Promise<void> => {
    try {
      setUploading(true);
      onUploading?.(true);

      const filesResult = await Promise.allSettled(
        Array.from(fileList).map((file) => uploadFile(file))
      );

      await onChange([...images, ...getImages(filesResult)]);
    } catch (e) {
      console.error("filesResult", e);
    } finally {
      console.warn("FINISH");
      setUploading(false);
      onUploading?.(false);
    }
  };

  const uploadFile = async (file: File): Promise<UploadedImage> =>
    new Promise((resolve, reject) => {
      const uid = uuidv1();
      const name = uid;
      const filename = `${name}`;
      const filenameThumb = `${name}_${imageResize}`;

      const storageFileRef = firebaseStorage.ref(path).child(filename);
      const storageFileThumbRef = firebaseStorage
        .ref(path + "/thumbs")
        .child(filenameThumb);

      storageFileRef.put(file).on(
        "state_changed",
        ({ bytesTransferred, totalBytes }) =>
          console.log((bytesTransferred / totalBytes) * 95),
        (error) => reject(error),
        async () => {
          try {
            const url = await storageFileRef.getDownloadURL();
            const thumbUrl = await keepTryingGetThumbURL(storageFileThumbRef);

            if (!isString(thumbUrl)) {
              throw new Error(`ThumbUrl is not string: ${thumbUrl}`);
            }

            resolve({ url, thumbUrl, uid, name });
          } catch (e) {
            await deleteFileAndFileThumbFromStorage(
              firebaseStorage,
              path,
              filename
            );
            reject(e);
          }
        }
      );
    });

  const deleteImage = async (image: Image): Promise<void> => {
    modalConfirm({
      content: "The image will be removed.",
      onOk: async () => {
        await deleteFileAndFileThumbFromStorage(
          firebaseStorage,
          path,
          image.name
        );

        await onChange(images.filter((_image) => _image.uid !== image.uid));
      },
    });
  };

  return (
    <div>
      <SortableImages
        images={images}
        onChange={onChange}
        height="200px"
        width="200px"
        onRenderLastElement={() => (
          <Spin spinning={uploading}>
            <DragAndDrop onDragOver={onDragOver} onDrop={onDrop}>
              <input
                type="file"
                multiple
                id="upload-input-file"
                onChange={onInputChange}
              />
              <label className="upload-body" htmlFor="upload-input-file">
                <FontAwesomeIcon icon={faUpload} size="2x" />
                <span className="upload-body-title">
                  Haga clic o arrastre el archivo a esta área para cargarlo
                </span>
                <span className="upload-body-description">
                  Soporte para una carga única o masiva
                </span>
              </label>
            </DragAndDrop>
          </Spin>
        )}
        overlayItem={(image: Image) => (
          <>
            <IconAction
              onClick={() => deleteImage(image)}
              size={25}
              icon={faTrash}
              styled={{
                color: () => "rgb(241, 13, 13)",
              }}
            />
          </>
        )}
      />
    </div>
  );
};

const getImages = (
  filesResult: PromiseSettledResult<UploadedImage>[]
): Image[] =>
  filesResult.reduce<Image[]>((images, fileResult) => {
    if (fileResult.status === "fulfilled") {
      images.push(fileResult.value);
    }
    return images;
  }, []);

const DragAndDrop = styled.div`
  ${() => css`
    width: 200px;
    height: 200px;
    background: ${theme.colors.secondary};
    border-radius: ${theme.border_radius.medium};
    position: relative;
    text-align: center;
    border: 2px dashed ${theme.colors.font2};
    transition: all 0.3s ease;
    padding: ${theme.paddings.large};
    margin-bottom: ${theme.paddings.medium};

    &:hover {
      border-color: ${theme.colors.primary};
      background: ${theme.colors.secondary}dd;
    }

    #upload-input-file {
      display: none;
    }

    .upload-body {
      display: flex;
      gap: ${theme.paddings.small};
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 100%;
      height: 100%;
      color: ${theme.colors.font1};

      svg {
        color: ${theme.colors.primary};
      }

      .upload-body-title {
        font-size: ${theme.font_sizes.medium};
        font-weight: ${theme.font_weight.medium};
        white-space: pre-wrap;
        line-height: 1.2em;
        color: ${theme.colors.font1};
      }

      .upload-body-description {
        font-size: ${theme.font_sizes.small};
        white-space: pre-wrap;
        line-height: 1.2em;
        color: ${theme.colors.font2};
      }
    }
  `}
`;
