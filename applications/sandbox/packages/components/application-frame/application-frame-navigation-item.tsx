import { useNavigate } from '@solidjs/router';
import classnames from 'classnames';
import { JSX, ParentProps, splitProps } from 'solid-js';

import styles from '$sandbox/components/application-frame/application-frame.module.css';

import { CommonDataAttributes } from '../../../../../packages/types/generic';

interface ApplicationFrameNavigationItemProps extends JSX.HTMLAttributes<HTMLDivElement>, CommonDataAttributes {
  path: string;
}

const ApplicationFrameNavigationItem = (passedProps: ParentProps<ApplicationFrameNavigationItemProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['path', 'class', 'children']);
  const navigate = useNavigate();

  return (
    <div
      role="button"
      class={classnames(styles.navigationItem, styles.navigationLink, props.class)}
      tabIndex={0}
      data-id="item"
      onClick={() => navigate(props.path)}
      // this is needed for a11y though not sure what this event should do
      onKeyPress={() => {}}
      {...restOfProps}
    >
      {props.children}
    </div>
  );
};

export default ApplicationFrameNavigationItem;
