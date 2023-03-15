import classnames from 'classnames';
import { JSX, mergeProps, splitProps } from 'solid-js';

import styles from '$/components/button/button.module.css';
import { ButtonIconPosition, DEFAULT_BUTTON_ICON_POSITION } from '$/components/button/utils';
import Icon from '$/components/icon';

export interface ButtonIconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  position?: ButtonIconPosition;
  isLoading?: boolean;
  icon: JSX.Element;
}

const ButtonIcon = (passedProps: ButtonIconProps) => {
  const [props, restOfProps] = splitProps(
    mergeProps({ position: DEFAULT_BUTTON_ICON_POSITION, isLoading: false }, passedProps),
    ['position', 'isLoading', 'icon', 'class'],
  );
  const dataId = () => {
    return `icon${props.isLoading ? ' loading' : ''}${props.position === ButtonIconPosition.PRE ? ' pre' : ' post'}`;
  };

  return (
    <div
      data-id={dataId()}
      class={classnames(styles.icon, props.class, {
        [styles.iconPre]: props.position === ButtonIconPosition.PRE,
        [styles.iconPost]: props.position === ButtonIconPosition.POST,
        [styles.iconIsLoading]: props.isLoading,
      })}
      {...restOfProps}
    >
      {props.isLoading ? <Icon.HeroHome /> : props.icon}
    </div>
  );
};

export default ButtonIcon;
