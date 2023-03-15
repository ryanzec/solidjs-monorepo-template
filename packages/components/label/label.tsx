import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/label/label.module.css';
import { CommonDataAttributes } from '$/types/generic';

type LabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement> & CommonDataAttributes;

const Label = (passedProps: LabelProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['children', 'class']);

  return (
    <label data-id="label" class={classnames(styles.label, props.class)} {...restOfProps}>
      {props.children}
    </label>
  );
};

export default Label;
