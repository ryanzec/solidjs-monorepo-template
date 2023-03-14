import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/input/input.module.css';
import { InputVariant } from '$/components/input/utils';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

// we exposed a plain input in the off chance we need an input not hooked up to react-hook-form directly (like the
// auto complete component)
const Input = (props: InputProps) => {
  const [local, restOfProps] = splitProps(props, ['class', 'variant']);

  return (
    <input
      data-id="input"
      class={classnames(styles.input, local.class, {
        [styles.transparent]: local.variant === InputVariant.TRANSPARENT,
      })}
      {...restOfProps}
      autocomplete="off"
    />
  );
};

// by default, we should be using the input the auto hooks with react-hook-form
export default Input;
