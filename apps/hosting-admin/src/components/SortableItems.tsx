import React from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  TouchSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled, { css } from "styled-components";
import { isObjectType } from "./utils";
import {
  disableDragProps,
  MouseSensor,
} from "./utils/upload/SortableItems.utils";
import { get } from "lodash";
import {
  DataSourceValue,
  FieldAsId,
  SortableOptions,
} from "./types/sortable.types";

export interface SortableItemsProps<Data extends DataSourceValue> {
  dataSource: Data[];
  fieldAsId?: FieldAsId<Data>;
  renderItem: (
    data: Data,
    index: number,
    options: SortableOptions
  ) => JSX.Element;
  onChange: (dataSource: Data[]) => void;
  className?: string;
  itemClassName?: string;
  isDisabledLastElement?: boolean;
}

interface ListItemProps {
  isDragging: boolean;
  isOver: boolean;
  isSorting: boolean;
}

interface ListItemSortableProps {
  children: React.ReactNode;
  index: number;
  uniqueIdentifier: UniqueIdentifier;
  className?: string;
  lastElement: boolean;
}

export const SortableItems = <Data extends DataSourceValue>({
  dataSource,
  fieldAsId,
  renderItem,
  onChange,
  className,
  itemClassName,
  isDisabledLastElement = false,
}: SortableItemsProps<Data>): JSX.Element => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const getUniqueIdentifier = (dataSourceValue: Data): UniqueIdentifier => {
    if (isObjectType(dataSourceValue) && fieldAsId) {
      const id = get(dataSourceValue, fieldAsId, null);
      return id !== null ? String(id) : String(Math.random());
    }
    return String(dataSourceValue);
  };

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    if (over && active.id !== over?.id) {
      const oldIndex = dataSource.findIndex(
        (dataSourceValue) => getUniqueIdentifier(dataSourceValue) === active.id
      );
      const newIndex = dataSource.findIndex(
        (dataSourceValue) => getUniqueIdentifier(dataSourceValue) === over.id
      );

      const newDataSource = arrayMove(dataSource, oldIndex, newIndex);

      onChange(newDataSource);
    }
  };

  const items: UniqueIdentifier[] = dataSource.map((dataSourceValue) =>
    getUniqueIdentifier(dataSourceValue)
  );

  return (
    <DndContext
      autoScroll={false}
      onDragEnd={onDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <ListItems className={className}>
          {dataSource.map((dataSourceValue, index) => {
            const lastElement = isDisabledLastElement
              ? items.length - 1 === index
              : false;
            const uniqueIdentifier = getUniqueIdentifier(dataSourceValue);

            return (
              <ListItemSortable
                index={index}
                key={uniqueIdentifier}
                uniqueIdentifier={uniqueIdentifier}
                className={itemClassName}
                lastElement={lastElement}
              >
                {renderItem(dataSourceValue, index, { disableDragProps })}
              </ListItemSortable>
            );
          })}
        </ListItems>
      </SortableContext>
    </DndContext>
  );
};

const ListItems = styled.ul`
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li<ListItemProps>`
  ${({ isSorting, theme }) => css`
    position: relative;
    cursor: ${isSorting ? "grabbing" : "grab"};
    outline: none;
    box-sizing: border-box;
    list-style: none;
    transform-origin: 50% 50%;
    white-space: nowrap;
    transform: scale(var(--scale, 1));
    transition: box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);

    #disabled-dnd {
      cursor: default;
    }

    &:active {
      box-shadow: 0 0 20px ${theme.colors.primary}40;
    }
  `}
`;

const ListItemSortable: React.FC<ListItemSortableProps> = ({
  children,
  index,
  uniqueIdentifier,
  className,
  lastElement,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    isOver,
    isSorting,
    transition,
  } = useSortable({
    id: uniqueIdentifier,
    animateLayoutChanges: () => true,
  });

  const style: React.CSSProperties = {
    transform: lastElement ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: lastElement ? "default" : "grab",
  };

  return (
    <ListItem
      isSorting={isSorting}
      isOver={isOver}
      isDragging={isDragging}
      ref={setNodeRef}
      style={style}
      key={index}
      {...(lastElement ? {} : attributes)}
      {...(lastElement ? {} : listeners)}
      className={className}
    >
      {children}
    </ListItem>
  );
};
