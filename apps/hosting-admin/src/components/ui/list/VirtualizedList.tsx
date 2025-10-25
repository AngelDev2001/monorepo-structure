import type { CSSProperties, JSX, ReactNode } from "react";
import type { ListRowProps } from "react-virtualized";
import {
  AutoSizer,
  type Index,
  type IndexRange,
  InfiniteLoader,
  List as VList,
  WindowScroller,
} from "react-virtualized";

export interface VirtualizedListProps<T = any> {
  dataSource: T[];
  rowHeight: number | ((params: Index) => number);
  renderItem: (data: T | undefined, index: number) => ReactNode;
  onLoadMore?: () => Promise<void>;
  threshold?: number;
  minimumBatchSize?: number;
  overscanRowCount?: number;
}

interface RowRendererParams extends ListRowProps {
  index: number;
  key: string;
  style: CSSProperties;
}

export const VirtualizedList = <T,>({
  dataSource,
  rowHeight,
  renderItem,
  onLoadMore,
  threshold = 15,
  minimumBatchSize = 10,
  overscanRowCount = 10,
}: VirtualizedListProps<T>): JSX.Element => {
  const rowRenderer = ({ index, key, style }: RowRendererParams): ReactNode => (
    <div key={key} style={style}>
      {renderItem(dataSource[index], index)}
    </div>
  );

  const isRowLoaded = ({ index }: Index): boolean => {
    return !!dataSource[index];
  };

  const loadMoreRows = async (params: IndexRange): Promise<void> => {
    if (onLoadMore) {
      await onLoadMore();
    } else {
      console.log("loadMoreRows", params);
    }
  };

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <InfiniteLoader
          rowCount={dataSource.length}
          threshold={threshold}
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          minimumBatchSize={minimumBatchSize}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <VList
                  ref={registerChild}
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  overscanRowCount={overscanRowCount}
                  rowCount={dataSource.length}
                  rowHeight={rowHeight}
                  rowRenderer={rowRenderer}
                  onRowsRendered={onRowsRendered}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      )}
    </WindowScroller>
  );
};
