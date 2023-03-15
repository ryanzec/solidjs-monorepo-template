import classnames from 'classnames';
import { JSX, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/radio/radio.module.css';
import { CommonDataAttributes } from '$/types/generic';

type RadioGroupProps = JSX.HTMLAttributes<HTMLDivElement> & CommonDataAttributes;

// we exposed a plain input in the off chance we need an input not hooked up to react-hook-form directly (like the
// auto complete component)
const RadioGroup = (passedProps: ParentProps<RadioGroupProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'children']);

  return (
    <div data-id="radio-group" class={classnames(styles.group, props.class)} {...restOfProps}>
      {props.children}
    </div>
  );
};

// by default, we should be using the input the auto hooks with react-hook-form
export default RadioGroup;
