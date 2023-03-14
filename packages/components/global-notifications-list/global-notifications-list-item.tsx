import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import Button from '$/components/button/button';
import styles from '$/components/global-notifications-list/global-notifications-list.module.css';
import {
  GlobalNotification,
  globalNotificationsStore,
  REMOVE_ANIMATION_DURATION,
} from '$/stores/global-notifications-store';

export interface GlobalNotificationsListItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  notification: GlobalNotification;
}

const GlobalNotificationsListItem = (props: GlobalNotificationsListItemProps) => {
  const [local, restOfProps] = splitProps(props, ['notification', 'class']);

  return (
    <div
      class={classnames(styles.notification, local.class, {
        [styles.isRemoving]: local.notification.isRemoving || false,
      })}
      style={{ 'animation-duration': `${REMOVE_ANIMATION_DURATION}ms` }}
      {...restOfProps}
    >
      {local.notification.message}{' '}
      <Button
        onclick={() => {
          globalNotificationsStore.removeNotification(local.notification.id);
        }}
      >
        X
      </Button>
    </div>
  );
};

export default GlobalNotificationsListItem;
