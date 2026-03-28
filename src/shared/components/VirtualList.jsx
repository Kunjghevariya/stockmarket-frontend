import { useMemo, useState } from 'react';

export default function VirtualList({
  items,
  height = 400,
  itemHeight = 80,
  overscan = 4,
  className = '',
  renderItem,
  getItemKey,
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );

    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
    };
  }, [height, itemHeight, items, overscan, scrollTop]);

  return (
    <div
      className={`overflow-y-auto ${className}`.trim()}
      style={{ height }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div className="relative" style={{ height: visibleRange.totalHeight }}>
        {visibleRange.visibleItems.map((item, index) => {
          const absoluteIndex = visibleRange.startIndex + index;
          return (
            <div
              key={getItemKey(item, absoluteIndex)}
              className="absolute left-0 right-0"
              style={{
                height: itemHeight,
                transform: `translateY(${absoluteIndex * itemHeight}px)`,
              }}
            >
              {renderItem(item, absoluteIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
