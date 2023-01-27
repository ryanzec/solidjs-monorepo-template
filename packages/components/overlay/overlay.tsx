import { Portal } from 'solid-js/web';

import styles from '$/components/overlay/overlay.module.css';

const Overlay = () => {
  return (
    <Portal>
      <div class={styles.overlay} />
    </Portal>
  );
};

export default Overlay;
