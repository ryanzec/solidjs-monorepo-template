import classnames from 'classnames';
import { createSignal, Show } from 'solid-js';

import styles from '$sandbox/components/application-frame/application-frame.module.css';

import { DynamicRouteNavigation } from '../../stores/dynamic-routes';

import ApplicationFrameSubNavigation from './application-frame-sub-navigation';

interface ApplicationFrameExpandableItemProps {
  routes: DynamicRouteNavigation;
  routeKey: string;
}

const ApplicationFrameExpandableItem = (props: ApplicationFrameExpandableItemProps) => {
  const [isExpanded, setIsExpanded] = createSignal<boolean>(false);

  return (
    <div class={styles.navigationGroup}>
      <div
        role="button"
        class={classnames(styles.navigationItem)}
        tabIndex={0}
        data-id="item"
        onClick={() => setIsExpanded(!isExpanded())}
        // this is needed for a11y though not sure what this event should do
        onKeyPress={() => {}}
      >
        {props.routeKey}
      </div>
      <Show when={isExpanded()}>
        <ApplicationFrameSubNavigation routes={props.routes} />
      </Show>
    </div>
  );
};

export default ApplicationFrameExpandableItem;
