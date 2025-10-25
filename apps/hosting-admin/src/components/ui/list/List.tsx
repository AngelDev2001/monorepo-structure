import type { JSX, ReactNode } from "react";
import styled, { css } from "styled-components";
import { List as ListAntd } from "antd";
import { IconAction } from "../IconAction";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { modalConfirm } from "../modalConfirm";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { lighten } from "polished";
import { theme } from "../../../styles";

interface ListProps<T = any> {
  actions?: (item: T, index: number) => ReactNode[];
  dataSource: T[];
  isMobile?: boolean;
  isColored?: (item: T) => boolean;
  itemContent?: (item: T, index: number) => ReactNode;
  itemDescription?: (item: T, index: number) => ReactNode;
  itemTitle?: (item: T, index: number) => ReactNode;
  loading?: boolean;
  onDeleteItem?: (item: T, index: number) => void | Promise<void>;
  onDeleteConfirmOptions?: {
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
  };
  onEditItem?: (item: T, index: number) => void;
  visibleDeleteItem?: (item: T) => boolean;
  visibleEditItem?: (item: T) => boolean;
}

interface ListWrapperProps {
  $isMobile: boolean;
}

interface ListItemProps {
  $isColored: boolean;
}

export const List = <T,>({
  actions,
  dataSource,
  isMobile = false,
  isColored = () => false,
  itemContent,
  itemDescription,
  itemTitle,
  loading = false,
  onDeleteItem,
  onDeleteConfirmOptions,
  onEditItem,
  visibleDeleteItem = () => true,
  visibleEditItem = () => true,
}: ListProps<T>): JSX.Element => {
  const itemActions = (item: T, index: number): ReactNode[] => {
    const itemActions: ReactNode[] = [];

    if (visibleEditItem(item) && onEditItem) {
      const onClickEdit = (): void => onEditItem(item, index);

      itemActions.push(
        <IconAction
          key="edit"
          data-testid="edit"
          onClick={onClickEdit}
          icon={faEdit}
          iconStyles={{ color: () => theme.colors.primary }}
        />
      );
    }

    if (visibleDeleteItem(item) && onDeleteItem) {
      const onClickDelete = (): void => {
        modalConfirm({
          onOk: async () => await onDeleteItem(item, index),
          ...onDeleteConfirmOptions,
        });
      };

      itemActions.push(
        <IconAction
          key="delete"
          data-testid="delete"
          onClick={onClickDelete}
          icon={faTrashAlt}
          iconStyles={{ color: () => "rgb(241, 13, 13)" }}
        />
      );
    }

    if (actions) {
      itemActions.push(...actions(item, index));
    }

    return itemActions;
  };

  return (
    <ListWrapper $isMobile={isMobile}>
      <ListAntd
        loading={loading}
        dataSource={dataSource}
        itemLayout={isMobile ? "vertical" : "horizontal"}
        renderItem={(item: T, index: number) => (
          <ListItem
            key={index}
            $isColored={isColored(item)}
            actions={itemActions(item, index)}
          >
            <ListAntd.Item.Meta
              title={itemTitle && itemTitle(item, index)}
              description={itemDescription && itemDescription(item, index)}
            />
            {itemContent && itemContent(item, index)}
          </ListItem>
        )}
      />
    </ListWrapper>
  );
};

const ListWrapper = styled.section<ListWrapperProps>`
  ${({ $isMobile }) => css`
    ${$isMobile ? ListMobileCSS : ListDesktopCSS}

    .ant-spin-container {
      .ant-list-items {
        .ant-list-item {
          position: relative;
          box-sizing: border-box;
          transition: all ease-in-out 150ms;
          border-radius: ${theme.border_radius.small};
          margin-bottom: ${theme.paddings.small};
          border: 1px solid ${theme.colors.font2}40;
          background: ${theme.colors.secondary};

          &:hover {
            border: 1px solid ${theme.colors.primary}80;
            box-shadow: 0 2px 8px ${theme.colors.primary}20;
            transform: translateY(-2px);
          }

          .ant-list-item-meta {
            .ant-list-item-meta-title {
              color: ${theme.colors.font1};
              font-weight: ${theme.font_weight.medium};
            }

            .ant-list-item-meta-description {
              color: ${theme.colors.font2};
            }
          }
        }
      }

      .ant-spin {
        .ant-spin-dot-item {
          background-color: ${theme.colors.primary};
        }
      }

      .ant-list-empty-text {
        color: ${theme.colors.font2};
      }
    }
  `}
`;

const ListDesktopCSS = css`
  ${() => css`
    .ant-spin-container {
      .ant-list-items {
        .ant-list-item {
          padding: ${theme.paddings.large} ${theme.paddings.x_large};

          .ant-list-item-action {
            margin-left: 0;

            li {
              padding: 0 ${theme.paddings.x_small};
            }
          }
        }
      }
    }
  `}
`;

const ListMobileCSS = css`
  ${() => css`
    .ant-spin-container {
      .ant-list-items {
        .ant-list-item {
          padding: ${theme.paddings.large};

          .ant-list-item-meta {
            .ant-list-item-meta-title {
              margin-bottom: ${theme.paddings.x_small};
            }
          }

          .ant-list-item-action {
            margin-top: ${theme.paddings.medium};

            li {
              padding: 0;
            }
          }
        }
      }
    }
  `}
`;

const ListItem = styled(ListAntd.Item)<ListItemProps>`
  ${({ $isColored }) => css`
    background: ${$isColored
      ? lighten(0.35, theme.colors.error)
      : theme.colors.secondary} !important;

    ${$isColored &&
    css`
      border-color: ${theme.colors.error}40 !important;

      &:hover {
        border-color: ${theme.colors.error}80 !important;
        box-shadow: 0 2px 8px ${theme.colors.error}20 !important;
      }
    `}
  `}
`;
