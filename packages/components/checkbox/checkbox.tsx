import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/checkbox/checkbox.module.css';
import { CommonDataAttributes } from '$/types/generic';

interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement>, CommonDataAttributes {
  labelNode: JSX.Element;
}

// we exposed a plain input in the off chance we need an input not hooked up to react-hook-form directly (like the
// auto complete component)
const Checkbox = (passedProps: CheckboxProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'labelNode']);

  return (
    <span class={classnames(styles.checkbox, props.class)}>
      <label>
        <input data-id="checkbox" {...restOfProps} type="checkbox" />
        <span class={styles.label}>{props.labelNode}</span>
      </label>
    </span>
  );
};

// by default, we should be using the input the auto hooks with react-hook-form
export default Checkbox;
