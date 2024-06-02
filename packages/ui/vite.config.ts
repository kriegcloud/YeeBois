import { mergeConfig } from 'vite';

import react from '@dank/vite/react';

export default mergeConfig(react, {
  // your custom config & overrides on top here
});
