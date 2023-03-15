import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/input/input.module.css';
import { InputVariant } from '$/components/input/utils';
import { CommonDataAttributes } from '$/types/generic';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement>, CommonDataAttributes {
  variant?: InputVariant;
}

// we exposed a plain input in the off chance we need an input not hooked up to react-hook-form directly (like the
// auto complete component)
const Input = (passedProps: InputProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'variant']);

  return (
    <input
      data-id="input"
      class={classnames(styles.input, props.class, {
        [styles.transparent]: props.variant === InputVariant.TRANSPARENT,
      })}
      {...restOfProps}
      autocomplete="off"
    />
  );
};

// by default, we should be using the input the auto hooks with react-hook-form
export default Input;
