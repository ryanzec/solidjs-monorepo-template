import { useNavigate } from '@solidjs/router';
import classnames from 'classnames';
import { ParentProps } from 'solid-js';

import styles from '$sandbox/components/application-frame/application-frame.module.css';

interface ApplicationFrameNavigationItemProps {
  path: string;
}

const ApplicationFrameNavigationItem = (props: ParentProps<ApplicationFrameNavigationItemProps>) => {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      class={classnames(styles.navigationItem, styles.navigationLink)}
      tabIndex={0}
      data-id="item"
      onClick={() => navigate(props.path)}
      // this is needed for a11y though not sure what this event should do
      onKeyPress={() => {}}
    >
      {props.children}
    </div>
  );
};

export default ApplicationFrameNavigationItem;
