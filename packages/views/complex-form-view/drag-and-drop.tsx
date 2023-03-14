// @ts-nocheck
import type { Id } from '@thisbeyond/solid-dnd';

import { closestCenter, DragDropProvider, DragDropSensors, DragOverlay } from '@thisbeyond/solid-dnd';
import { batch, For } from 'solid-js';
import { createStore } from 'solid-js/store';

import DragDrop from '$/components/drag-drop';
import styles from '$/views/complex-form-view/complex-form-view.module.css';

interface ListItemData {
  id: Id;
  name: string;
}

const a: ListItemData[] = [];
const b: ListItemData[] = [];
const c: ListItemData[] = [];
const d: ListItemData[] = [];
const e: ListItemData[] = [];
const f: ListItemData[] = [];
const g: ListItemData[] = [];
const h: ListItemData[] = [];
const i: ListItemData[] = [];
const j: ListItemData[] = [];
const count = 40;

for (let z = 1; z <= count; z++) {
  a.push({ id: z, name: `item name ${z}` });
  b.push({ id: z + count, name: `item name ${z + count}` });
  c.push({ id: z + count * 2, name: `item name ${z + count * 2}` });
  d.push({ id: z + count * 3, name: `item name ${z + count * 3}` });
  e.push({ id: z + count * 4, name: `item name ${z + count * 4}` });
  f.push({ id: z + count * 5, name: `item name ${z + count * 5}` });
  g.push({ id: z + count * 6, name: `item name ${z + count * 6}` });
  h.push({ id: z + count * 7, name: `item name ${z + count * 7}` });
  i.push({ id: z + count * 8, name: `item name ${z + count * 8}` });
  j.push({ id: z + count * 9, name: `item name ${z + count * 9}` });
}

interface ItemDisplayProps {
  item: ListItemData;
}

const ItemDisplay = (props: ItemDisplayProps) => {
  return (
    <DragDrop.Sortable class={styles.item} item={props.item}>
      {props.item.id}: {props.item.name}
    </DragDrop.Sortable>
  );
};

interface ListDisplayProps {
  items: ListItemData[];
}

const ListDisplay = (props: ListDisplayProps) => {
  return <For each={props.items}>{(item) => <ItemDisplay item={item} />}</For>;
};

const DragAndDrop = () => {
  const [containers, setContainers] = createStore<Record<string, number[]>>({
    A: [...a],
    B: [...b],
    C: [...c],
    D: [...d],
    E: [...e],
    F: [...f],
    G: [...g],
    H: [...h],
    I: [...i],
    J: [...j],
  });

  const containerIds = () => Object.keys(containers);

  const isContainer = (id) => containerIds().includes(id);

  const getContainer = (id) => {
    for (const [key, items] of Object.entries(containers)) {
      if (items.find((item) => item.id === id)) {
        return key;
      }
    }
  };

  const getContainerIds = (items) => items.map((item) => item.id);

  const closestContainerOrItem = (draggable, droppables, context) => {
    const closestContainer = closestCenter(
      draggable,
      droppables.filter((droppable) => isContainer(droppable.id)),
      context,
    );
    if (closestContainer) {
      const containerItemIds = getContainerIds(containers[closestContainer.id]);
      const closestItem = closestCenter(
        draggable,
        droppables.filter((droppable) => containerItemIds.includes(droppable.id)),
        context,
      );

      if (!closestItem) {
        return closestContainer;
      }

      if (getContainer(draggable.id) !== closestContainer.id) {
        const isLastItem = containerItemIds.indexOf(closestItem.id as number) === containerItemIds.length - 1;

        if (isLastItem) {
          const belowLastItem = draggable.transformed.center.y > closestItem.transformed.center.y;

          if (belowLastItem) {
            return closestContainer;
          }
        }
      }

      return closestItem;
    }
  };

  const move = (draggable, droppable, onlyWhenChangingContainer = true) => {
    const draggableContainer = getContainer(draggable.id);
    const droppableContainer = isContainer(droppable.id) ? droppable.id : getContainer(droppable.id);

    if (draggableContainer != droppableContainer || !onlyWhenChangingContainer) {
      const draggingItem = containers[draggableContainer].find((item) => item.id === draggable.id);

      if (!draggingItem) {
        return;
      }

      const containerItemIds = getContainerIds(containers[droppableContainer]);
      let index = containerItemIds.indexOf(droppable.id);
      if (index === -1) index = containerItemIds.length;

      batch(() => {
        setContainers(draggableContainer, (items) => items.filter((item) => item.id !== draggable.id));
        setContainers(droppableContainer, (items) => [...items.slice(0, index), draggingItem, ...items.slice(index)]);
      });
    }
  };

  const onDragOver = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      move(draggable, droppable);
    }
  };

  const onDragEnd = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      move(draggable, droppable, false);
    }
  };

  return (
    <>
      <div>Drag and Drop</div>
      <DragDropProvider onDragOver={onDragOver} onDragEnd={onDragEnd} collisionDetector={closestContainerOrItem}>
        <DragDropSensors />
        <div class={styles.lists}>
          <For each={containerIds()}>
            {(key) => (
              <DragDrop.Droppable class={styles.list} droppableId={key} items={containers[key]}>
                <ListDisplay items={containers[key]} />
              </DragDrop.Droppable>
            )}
          </For>
        </div>
        <DragOverlay>{(draggable) => <div class={styles.item}>{draggable.id}</div>}</DragOverlay>
      </DragDropProvider>
    </>
  );
};

export default DragAndDrop;
