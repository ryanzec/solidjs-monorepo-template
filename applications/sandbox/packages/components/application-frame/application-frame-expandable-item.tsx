import classnames from 'classnames';
import { createSignal, JSX, Show, splitProps } from 'solid-js';

import styles from '$sandbox/components/application-frame/application-frame.module.css';

import { CommonDataAttributes } from '../../../../../packages/types/generic';
import { DynamicRouteNavigation } from '../../stores/dynamic-routes';

import ApplicationFrameSubNavigation from './application-frame-sub-navigation';

interface ApplicationFrameExpandableItemProps extends JSX.HTMLAttributes<HTMLDivElement>, CommonDataAttributes {
  routes: DynamicRouteNavigation;
  routeKey: string;
}

const ApplicationFrameExpandableItem = (passedProps: ApplicationFrameExpandableItemProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['routes', 'class', 'routeKey']);
  const [isExpanded, setIsExpanded] = createSignal<boolean>(true);

  return (
    <div class={styles.navigationGroup}>
      <div
        role="button"
        class={classnames(styles.navigationItem, props.class)}
        tabIndex={0}
        data-id="item"
        onClick={() => setIsExpanded(!isExpanded())}
        // this is needed for a11y though not sure what this event should do
        onKeyPress={() => {}}
        {...restOfProps}
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
