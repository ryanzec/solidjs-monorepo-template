import { useNavigate } from '@solidjs/router';
import classnames from 'classnames';
import { JSX } from 'solid-js';

import styles from '$/components/application-frame/application-frame.module.css';

export interface ApplicationFrameNavigationItemProps {
  icon: JSX.Element;
  text: string;
  navigateTo: string;
}

const ApplicationFrameNavigationItem = (props: ApplicationFrameNavigationItemProps) => {
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(props.navigateTo);
  };

  return (
    <div
      role="button"
      class={classnames(styles.navigationItem)}
      tabIndex={0}
      data-id="item"
      onClick={onNavigate}
      // this is needed for a11y though not sure what this event should do
      onKeyPress={() => {}}
    >
      {props.icon} {props.text}
    </div>
  );
};

export default ApplicationFrameNavigationItem;
