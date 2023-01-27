import { createSignal, Show } from 'solid-js';

import Button from '$/components/button/button';
import Overlay from '$/components/overlay/overlay';

export default {
  title: 'Packages/Components/Overlay',
};

export const Default = () => {
  const [overlayToggled, setOverlayToggled] = createSignal(false);

  return (
    <div>
      <Button
        onclick={() => {
          setOverlayToggled(!overlayToggled());
        }}
      >
        Toggle Overlay
      </Button>
      <Show when={overlayToggled()}>
        <div style={{ position: 'relative', 'background-color': 'white', 'z-index': '100000' }}>
          <Button
            onclick={() => {
              setOverlayToggled(!overlayToggled());
            }}
          >
            Close Overlay
          </Button>{' '}
        </div>
        <Overlay />
      </Show>
    </div>
  );
};
