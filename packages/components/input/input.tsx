import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/input/input.module.css';

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

// we exposed a plain input in the off chance we need an input not hooked up to react-hook-form directly (like the
// auto complete component)
const Input = (props: InputProps) => {
  const [local, restOfProps] = splitProps(props, ['class']);

  return <input data-id="input" class={classnames(local.class, styles.input)} {...restOfProps} autocomplete="off" />;
};

// by default, we should be using the input the auto hooks with react-hook-form
export default Input;
