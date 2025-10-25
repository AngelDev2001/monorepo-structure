import React, { type CSSProperties, JSX } from "react";
import { SortableItems } from "./SortableItems";
import styled, { css } from "styled-components";
import { isString } from "lodash";
import { type Image } from "./types/upload.types";
import { type SortableOptions } from "./types/sortable.types";

export interface SortableImagesProps
  extends Pick<CSSProperties, "width" | "height"> {
  images: Image[];
  onChange: (images: Image[]) => Promise<void>;
  overlayItem?: (image: Image) => JSX.Element;
  onRenderLastElement?: () => JSX.Element;
}

type DataSourceItem = Image | "last";

interface ContainerProps {
  width: string | number;
  height: string | number;
}

export const SortableImages: React.FC<SortableImagesProps> = ({
  images,
  onChange,
  height = "200px",
  overlayItem,
  width = "200px",
  onRenderLastElement,
}) => {
  const dataSource: DataSourceItem[] = [
    ...images,
    onRenderLastElement ? "last" : "",
  ].filter((image): image is DataSourceItem => !!image);

  const handleChange = (items: DataSourceItem[]): void => {
    const filteredImages = items.reduce<Image[]>((acc, item) => {
      if (!isString(item)) {
        acc.push(item);
      }
      return acc;
    }, []);

    onChange(filteredImages);
  };

  return (
    <Container height={height} width={width}>
      <SortableItems<DataSourceItem>
        dataSource={dataSource}
        fieldAsId={["uid"]}
        className="sortable-images"
        itemClassName="sortable-image"
        isDisabledLastElement={!!onRenderLastElement}
        renderItem={(
          image: DataSourceItem,
          index: number,
          options: SortableOptions
        ) =>
          isString(image) ? (
            <div {...options.disableDragProps} data-last="true">
              {onRenderLastElement && onRenderLastElement()}
            </div>
          ) : (
            <ImageContainer>
              <img src={image.thumbUrl || image.url} alt={image.name} />
              {overlayItem && (
                <div {...options.disableDragProps} className="image-overlay">
                  {overlayItem(image)}
                </div>
              )}
            </ImageContainer>
          )
        }
        onChange={handleChange}
      />
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  ${({ theme, width, height }) => css`
    .sortable-images {
      display: grid;
      grid-gap: ${theme.paddings.large};
      grid-template-columns: repeat(
        auto-fill,
        ${typeof width === "string" ? width : `${width}px`}
      );
      justify-content: space-around;
    }

    .sortable-image {
      width: 100%;
      height: ${typeof height === "string" ? height : `${height}px`};
    }
  `}
`;

const ImageContainer = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: ${theme.border_radius.large};
    background: ${theme.colors.secondary};
    border: 1px solid ${theme.colors.font2}40;
    transition: all 0.3s ease;

    &:hover {
      border-color: ${theme.colors.primary};
      transform: scale(1.02);
      box-shadow: 0 4px 12px ${theme.colors.primary}40;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${theme.border_radius.large};
    }

    .image-overlay {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      gap: ${theme.paddings.xx_small};
      position: absolute;
      bottom: 0;
      background: linear-gradient(to top, ${theme.colors.dark}dd, transparent);
      width: 100%;
      transition: opacity 0.3s ease;
      opacity: 0;
      color: ${theme.colors.font1};
      font-size: ${theme.font_sizes.small};
      padding: ${theme.paddings.small};
      text-align: center;
      border-bottom-left-radius: ${theme.border_radius.large};
      border-bottom-right-radius: ${theme.border_radius.large};

      svg {
        transition: color 0.2s ease;

        &:hover {
          color: ${theme.colors.primary};
        }
      }
    }

    &:hover .image-overlay {
      opacity: 1;
    }
  `}
`;
