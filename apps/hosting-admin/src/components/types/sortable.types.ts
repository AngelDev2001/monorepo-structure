import type { DisableDragProps } from "../utils/upload/SortableItems.utils";

export type ObjectType = Record<string, any>;

export type DataSourceValue = string | number | ObjectType;

export type Paths<T> = T extends ObjectType
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends ObjectType
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type FieldAsId<Data extends DataSourceValue> = Data extends ObjectType
  ? Paths<Data> | string[]
  : undefined;

export interface SortableOptions {
  disableDragProps: DisableDragProps;
}

export interface SortableRenderItemProps<Data extends DataSourceValue> {
  data: Data;
  index: number;
  options: SortableOptions;
}
