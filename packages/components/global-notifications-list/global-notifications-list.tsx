import classnames from 'classnames';
import { For, JSX, mergeProps, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import GlobalNotificationsListItem from '$/components/global-notifications-list/global-notifications-list-item';
import styles from '$/components/global-notifications-list/global-notifications-list.module.css';
import { GlobalNotification } from '$/stores/global-notifications-store';

export interface GlobalNotificationsListProps extends JSX.HTMLAttributes<HTMLDivElement> {
  notifications?: GlobalNotification[];
}

const GlobalNotificationsList = (props: GlobalNotificationsListProps) => {
  const [local, restOfProps] = splitProps(mergeProps({ notifications: [] }, props), ['notifications', 'class']);

  return (
    <Show when={local.notifications.length > 0}>
      <Portal>
        <div class={classnames(local.class, styles.notifications)} {...restOfProps}>
          <For each={local.notifications}>
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
