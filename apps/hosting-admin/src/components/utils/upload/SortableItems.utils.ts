import { MouseSensor as LibMouseSensor } from "@dnd-kit/core";
import type { MouseSensorOptions } from "@dnd-kit/core";

// Types & Interfaces
export type DisableDragProps = Record<string, string>;

interface DatasetWithDnd {
  disabledDnd?: string;
}

// Custom Mouse Sensor
export class MouseSensor extends LibMouseSensor {
  constructor(props: MouseSensorOptions) {
    super(props);

    this.constructor.activators = [
      {
        eventName: "onMouseDown" as const,
        handler: ({ nativeEvent: event }: { nativeEvent: MouseEvent }) => {
          return shouldHandleEvent(event.target as HTMLElement);
        },
      },
    ];
  }
}

// Helper Functions
const shouldHandleEvent = (element: HTMLElement | null): boolean => {
  let cur: HTMLElement | null = element;

  while (cur) {
    const dataset = cur.dataset as DatasetWithDnd;

    if (dataset && dataset.disabledDnd) {
      return false;
    }

    cur = cur.parentElement;
  }

  return true;
};

// Export disable drag props
export const disableDragProps: DisableDragProps = {
  id: "disabled-dnd",
  "data-disabled-dnd": "true",
};
