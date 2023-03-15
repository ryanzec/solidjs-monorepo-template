import classnames from 'classnames';
import { JSX, mergeProps, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/button/button.module.css';
import { ButtonGroupProvider } from '$/components/button/context';
import {
  ButtonContext,
  ButtonSize,
  ButtonVariant,
  DEFAULT_BUTTON_CONTEXT,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
} from '$/components/button/utils';
import { CommonDataAttributes } from '$/types/generic';

interface ButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement>, CommonDataAttributes {
  context?: ButtonContext;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  isAttached?: boolean;
}

const ButtonGroup = (passedProps: ParentProps<ButtonGroupProps>) => {
  const [props, restOfProps] = splitProps(
    mergeProps(
      {
        isAttached: false,
        variant: DEFAULT_BUTTON_VARIANT,
        size: DEFAULT_BUTTON_SIZE,
        context: DEFAULT_BUTTON_CONTEXT,
        disabled: false,
      },
      passedProps,
    ),
    ['children', 'isAttached', 'variant', 'size', 'context', 'disabled'],
  );

  return (
    <ButtonGroupProvider
      isAttached={props.isAttached}
      variant={props.variant}
      context={props.context}
      size={props.size}
      disabled={props.disabled}
    >
      <div
        data-id="button-group"
        role="group"
        class={classnames(styles.group, { [styles.isAttached]: props.isAttached })}
        {...restOfProps}
      >
        {props.children}
      </div>
    </ButtonGroupProvider>
  );
};

export default ButtonGroup;
