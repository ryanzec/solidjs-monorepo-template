import produce from 'immer';
import pullAt from 'lodash/pullAt';
import { nanoid } from 'nanoid';
import { createRoot, createSignal } from 'solid-js';

export interface GlobalNotification {
  id: string;
  message: string;
  autoClose?: number;
  isRemoving?: boolean;
}

export const REMOVE_ANIMATION_DURATION = 1000;

const createGlobalNotificationsStore = () => {
  const [notifications, setNotifications] = createSignal<GlobalNotification[]>([]);

  const addNotification = (notification: Omit<GlobalNotification, 'id'>) => {
    const newNotification = {
      id: nanoid(),
      ...notification,
    };

    if (notification.autoClose !== undefined) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.autoClose);
    }

    setNotifications(
      produce(notifications(), (draft) => {
        draft.push(newNotification);
      }),
    );
  };

  const removeNotification = (id: GlobalNotification['id']) => {
    const matchingIndex = notifications().findIndex((notification) => notification.id === id);

    if (matchingIndex === -1) {
      return;
    }

    setNotifications(
      produce(notifications(), (draft) => {
        draft[matchingIndex].isRemoving = true;
      }),
    );

    setTimeout(() => {
      setNotifications(
        produce(notifications(), (draft) => {
          // since it is possible for this or another notification to be remove between the start of the removal and
          // this being processed, we need to double check the index to remove to makes sure the wrong notification
          // is not removed
          const removeIndex = notifications().findIndex((notification) => notification.id === id);

          if (removeIndex === -1) {
            return;
          }

          pullAt(draft, [removeIndex]);
        }),
      );
    }, REMOVE_ANIMATION_DURATION);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

const globalNotificationsStore = createRoot(createGlobalNotificationsStore);

export { globalNotificationsStore };
