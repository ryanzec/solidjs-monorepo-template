import type { Id } from '@thisbeyond/solid-dnd';

import { createDroppable, SortableProvider } from '@thisbeyond/solid-dnd';
import { JSX, ParentProps, splitProps } from 'solid-js';

import { DragDropItem } from '$/components/drag-drop/utils';

interface DroppableProps extends JSX.HTMLAttributes<HTMLDivElement> {
  droppableId: Id;
  items: DragDropItem[];
}

const Droppable = (props: ParentProps<DroppableProps>) => {
  const [local, restOfProps] = splitProps(props, ['droppableId', 'items', 'children']);

  // droppable is technically being used by SolidJS's directive feature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const droppable = createDroppable(local.droppableId);

  return (
    <div use:droppable {...restOfProps}>
      <SortableProvider ids={local.items.map((item) => item.id)}>{local.children}</SortableProvider>
    </div>
  );
};

export default Droppable;
