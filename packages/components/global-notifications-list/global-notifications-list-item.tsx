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

const GlobalNotificationsListItem = (passedProps: GlobalNotificationsListItemProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['notification', 'class']);

  return (
    <div
      class={classnames(styles.notification, props.class, {
        [styles.isRemoving]: props.notification.isRemoving || false,
      })}
      style={{ 'animation-duration': `${REMOVE_ANIMATION_DURATION}ms` }}
      {...restOfProps}
    >
      {props.notification.message}{' '}
      <Button
        onclick={() => {
          globalNotificationsStore.removeNotification(props.notification.id);
        }}
      >
        X
      </Button>
    </div>
  );
};

export default GlobalNotificationsListItem;
