import { JSX, splitProps } from 'solid-js';

import styles from '$/components/label/label.module.css';

type LabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement>;

const Label = (props: LabelProps) => {
  const [local, restOfProps] = splitProps(props, ['children', 'class']);

  return (
    <label data-id="label" class={styles.label} {...restOfProps}>
      {local.children}
    </label>
  );
};

export default Label;
