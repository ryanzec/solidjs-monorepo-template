import classnames from 'classnames';
import { For, JSX, mergeProps, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import GlobalNotificationsListItem from '$/components/global-notifications-list/global-notifications-list-item';
import styles from '$/components/global-notifications-list/global-notifications-list.module.css';
import { GlobalNotification } from '$/stores/global-notifications-store';

export interface GlobalNotificationsListProps extends JSX.HTMLAttributes<HTMLDivElement> {
  notifications?: GlobalNotification[];
}

const GlobalNotificationsList = (passedProps: GlobalNotificationsListProps) => {
  const [props, restOfProps] = splitProps(mergeProps({ notifications: [] }, passedProps), ['notifications', 'class']);

  return (
    <Show when={props.notifications.length > 0}>
      <Portal>
        <div class={classnames(props.class, styles.notifications)} {...restOfProps}>
          <For each={props.notifications}>
            {(notification) => {
              return <GlobalNotificationsListItem notification={notification} />;
            }}
          </For>
        </div>
      </Portal>
    </Show>
  );
};

export default GlobalNotificationsList;
