import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/radio/radio.module.css';
import { CommonDataAttributes } from '$/types/generic';

interface RadioProps extends JSX.InputHTMLAttributes<HTMLInputElement>, CommonDataAttributes {
  labelNode: JSX.Element;
}

// we exposed a plain input in the off chance we need an input not hooked up to react-hook-form directly (like the
// auto complete component)
const Radio = (passedProps: RadioProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'labelNode']);

  return (
    <span class={classnames(styles.radio, props.class)}>
      <label>
        <input data-id="radio" {...restOfProps} type="radio" />
        <span class={styles.label}>{props.labelNode}</span>
      </label>
    </span>
  );
};

// by default, we should be using the input the auto hooks with react-hook-form
export default Radio;
