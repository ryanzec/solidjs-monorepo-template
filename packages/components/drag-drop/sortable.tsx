import { createSortable } from '@thisbeyond/solid-dnd';
import { JSX, ParentProps, splitProps } from 'solid-js';

import { DragDropItem } from '$/components/drag-drop/utils';

interface SortableProps extends JSX.HTMLAttributes<HTMLDivElement> {
  item: DragDropItem;
}

const Sortable = (props: ParentProps<SortableProps>) => {
  const [local, restOfProps] = splitProps(props, ['item', 'children']);
  const sortable = createSortable(local.item.id);

  return (
    <div use:sortable {...restOfProps} style={{ opacity: sortable.isActiveDraggable ? 0.25 : 1 }}>
      {local.children}
    </div>
  );
};

export default Sortable;
