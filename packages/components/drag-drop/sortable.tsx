import { createSortable } from '@thisbeyond/solid-dnd';
import { JSX, ParentProps, splitProps } from 'solid-js';

import { DragDropItem } from '$/components/drag-drop/utils';

interface SortableProps extends JSX.HTMLAttributes<HTMLDivElement> {
  item: DragDropItem;
}

const Sortable = (passedProps: ParentProps<SortableProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['item', 'children']);
  const sortable = createSortable(props.item.id);

  return (
    <div use:sortable {...restOfProps} style={{ opacity: sortable.isActiveDraggable ? 0.25 : 1 }}>
      {props.children}
    </div>
  );
};

export default Sortable;
