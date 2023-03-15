import type { Id } from '@thisbeyond/solid-dnd';

import { createDroppable, SortableProvider } from '@thisbeyond/solid-dnd';
import { JSX, ParentProps, splitProps } from 'solid-js';

import { DragDropItem } from '$/components/drag-drop/utils';

interface DroppableProps extends JSX.HTMLAttributes<HTMLDivElement> {
  droppableId: Id;
  items: DragDropItem[];
}

const Droppable = (passedProps: ParentProps<DroppableProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['droppableId', 'items', 'children']);

  // droppable is technically being used by SolidJS's directive feature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const droppable = createDroppable(props.droppableId);

  return (
    <div use:droppable {...restOfProps}>
      <SortableProvider ids={props.items.map((item) => item.id)}>{props.children}</SortableProvider>
    </div>
  );
};

export default Droppable;
