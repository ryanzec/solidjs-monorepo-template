import { For, Match, Switch } from 'solid-js';

import { DynamicRouteNavigation } from '../../stores/dynamic-routes';

import ApplicationFrameExpandableItem from './application-frame-expandable-item';
import ApplicationFrameNavigationItem from './application-frame-navigation-item';

interface ApplicationFrameSubNavigationProps {
  routes: DynamicRouteNavigation;
}

const ApplicationFrameSubNavigation = (props: ApplicationFrameSubNavigationProps) => {
  return (
    <For each={Object.keys(props.routes)}>
      {(routeKey) => {
        const isEndRoute = () => {
          return typeof props.routes[routeKey] !== 'object';
        };

        return (
          <Switch>
            <Match when={isEndRoute()}>
              {/* since this is an end route, we are casting to string to avoid typescript error */}
              <ApplicationFrameNavigationItem path={props.routes[routeKey] as string}>
                {routeKey}
              </ApplicationFrameNavigationItem>
            </Match>
            <Match when={isEndRoute() === false}>
              {/* we only get here if the route is an object so casting to prevent typescript error */}
              <ApplicationFrameExpandableItem
                routes={props.routes[routeKey] as DynamicRouteNavigation}
                routeKey={routeKey}
              />
            </Match>
          </Switch>
        );
      }}
    </For>
  );
};

export default ApplicationFrameSubNavigation;
