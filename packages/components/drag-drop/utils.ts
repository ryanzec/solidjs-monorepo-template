import type { Id } from '@thisbeyond/solid-dnd';

export interface DragDropItem {
  id: Id;
  [key: string]: unknown;
}
