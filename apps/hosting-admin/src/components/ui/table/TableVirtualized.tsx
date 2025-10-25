import React, { type JSX } from "react";
import styled, { css } from "styled-components";
import { VirtualizedList } from "../list";
import { Spinner } from "../Spinner";
import { theme } from "../../../styles";

export interface Column<T = any> {
  title: string;
  key: string;
  width: [string, string];
  align?: "left" | "center" | "right";
  render: (data: T, index: number) => React.ReactNode;
  withFilter?: boolean;
  onFilter?: (filterValue: string, record: T) => boolean;
  filterDropdown?: React.ComponentType<any>;
  filters?: Array<{ value: string; text: string }>;
}

interface TableVirtualizedProps<T = any> {
  dataSource: T[];
  columns: Column<T>[];
  rowHeaderHeight: number;
  rowBodyHeight: number;
  loading?: boolean;
}

interface RowHeaderProps<T = any> {
  columns: Column<T>[];
}

interface RowBodyProps<T = any> {
  data: T;
  columns: Column<T>[];
  index: number;
}

interface CellProps {
  align?: "left" | "center" | "right";
}

interface RowContainerProps {
  widthsColumns: Array<[string, string]>;
}

export const TableVirtualized = <T,>({
  dataSource,
  columns,
  rowHeaderHeight,
  rowBodyHeight,
  loading = false,
}: TableVirtualizedProps<T>): JSX.Element => {
  return (
    <Container>
      <VirtualizedList
        dataSource={[null, ...dataSource]}
        rowHeight={({ index }: { index: number }) =>
          index === 0 ? (loading ? 120 : rowHeaderHeight) : rowBodyHeight
        }
        renderItem={(data: T | null, index: number) =>
          !data ? (
            <div>
              <RowHeader columns={columns} />
              {loading && <Spinner size="3x" height="12vh" />}
            </div>
          ) : (
            <RowBody data={data} columns={columns} index={index - 1} />
          )
        }
      />
    </Container>
  );
};

const RowHeader = <T,>({ columns }: RowHeaderProps<T>): JSX.Element => (
  <RowHeaderContainer widthsColumns={columns.map((column) => column.width)}>
    {columns.map((column) => (
      <Cell key={column.title} className="cell-header" align="center">
        {column.title}
      </Cell>
    ))}
  </RowHeaderContainer>
);

const RowBody = <T,>({
  data,
  columns,
  index,
}: RowBodyProps<T>): JSX.Element => (
  <RowBodyContainer widthsColumns={columns.map((column) => column.width)}>
    {columns.map((column) => (
      <Cell key={column.title} align={column.align}>
        {column.render(data, index)}
      </Cell>
    ))}
  </RowBodyContainer>
);

const Container = styled.section`
  height: 100%;
  position: relative;

  .ReactVirtualized__Grid__innerScrollContainer {
    overflow-x: scroll !important;
  }
`;

const RowContainer = styled.div<RowContainerProps>`
  ${({ widthsColumns }) => css`
    width: 100%;
    height: 100%;
    display: grid;
    word-break: break-word;
    grid-template-columns: ${widthsColumns
      .map(([min, max]) => `minmax(${min},${max})`)
      .join(" ")};
  `}
`;

const RowHeaderContainer = styled(RowContainer)`
  ${() => css`
    width: 100%;
    align-content: center;
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.small};
    font-weight: ${theme.font_weight.medium};

    .cell-header {
      background: ${theme.colors.secondary};
      justify-content: center;
      border-bottom: 2px solid ${theme.colors.primary};
    }

    .cell-header:first-child {
      border-top-left-radius: ${theme.border_radius.small};
    }

    .cell-header:last-child {
      border-top-right-radius: ${theme.border_radius.small};
    }
  `}
`;

const RowBodyContainer = styled(RowContainer)`
  ${() => css`
    border-bottom: 1px solid ${theme.colors.secondary};

    &:hover {
      background: ${theme.colors.secondary}10;
    }
  `}
`;

const Cell = styled.div<CellProps>`
  ${({ align = "center" }) => css`
    width: 100%;
    height: 100%;
    padding: ${theme.paddings.medium} ${theme.paddings.x_small};
    text-align: ${align};
    align-items: ${align};
    display: flex;
    gap: ${theme.paddings.xx_small};
    flex-direction: column;
    color: ${theme.colors.font1};
  `}
`;
