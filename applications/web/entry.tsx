/* @refresh reload */
import '../../packages/types/solid-js';

import '@fontsource/inter';

import '../../packages/styles/variables.css';
import '../../packages/styles/keyframes.css';
import '../../packages/styles/normalize.css';
import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';

import ApplicationWrapper from '../../packages/components/application-wrapper';

render(
  () => (
    <Router>
      <ApplicationWrapper />
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);
