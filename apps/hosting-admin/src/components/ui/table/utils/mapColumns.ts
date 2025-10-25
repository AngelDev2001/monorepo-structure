import { type Filter, FilterDropdown } from "./FilterDropdown";
import type { Column } from "../TableVirtualized";
import { get, groupBy, isEmpty, orderBy } from "lodash";

export interface MapColumnsParams<T = any> {
  columns: Column<T>[];
  dataSource: T[];
  currentFilters: Record<string, string[]>;
}

export interface MapColumnsResult<T = any> {
  columnsTable: Column<T>[];
  itemsFiltered: T[];
}

export const mapColumns = <T = any>({
  columns,
  dataSource,
  currentFilters,
}: MapColumnsParams<T>): MapColumnsResult<T> => {
  const dataSourceView = dataSourceFilters(dataSource, currentFilters);

  return {
    columnsTable: columns.map((column) =>
      mapTableColumn(column, dataSourceView)
    ),
    itemsFiltered: dataSourceView,
  };
};

// Helper Functions
const dataSourceFilters = <T>(
  dataSource: T[],
  currentFilters: Record<string, string[]>
): T[] => {
  let filteredData = dataSource;

  Object.entries(currentFilters).forEach(([fieldName, filterValues]) => {
    filteredData = filteredData.filter((record) =>
      recordFilter(record, fieldName, filterValues)
    );
  });

  return filteredData;
};

const recordFilter = <T>(
  record: T,
  fieldName: string,
  filterValues: string[]
): boolean => {
  if (isEmpty(filterValues)) return true;

  return filterValues.some((filterValue) =>
    onFilter(filterValue, record, fieldName)
  );
};

const mapTableColumn = <T>(
  column: Column<T>,
  dataSourceView: T[]
): Column<T> => {
  if (column.withFilter) {
    column.filterDropdown = FilterDropdown;
    column.filters = filters(column.key, dataSourceView);
    column.onFilter = (filterValue: string, record: T) =>
      onFilter(filterValue, record, column.key);
  }

  return column;
};

const filters = <T>(fieldName: string, dataSourceView: T[]): Filter[] => {
  const valuesByFieldName = groupBy(
    dataSourceView,
    (record) => get(record, `${fieldName}`) || ""
  );

  const filtersList: Filter[] = Object.entries(valuesByFieldName).map(
    ([value, records]) => {
      return value
        ? {
            value: value,
            text: `${value} (${records.length})`,
          }
        : {
            value: " ",
            text: `Blank (${records.length})`,
          };
    }
  );

  return orderBy(filtersList, ["value"], ["asc"]);
};

const onFilter = <T>(
  filterValue: string,
  record: T,
  fieldName: string
): boolean => {
  const recordValue = get(record, `${fieldName}`, "");

  return filterValue === " " ? !recordValue : recordValue === filterValue;
};
