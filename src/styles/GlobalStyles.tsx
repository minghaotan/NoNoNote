import { Global } from '@emotion/react';
import { globalStyles } from './globalStyles';

/**
 * GlobalStyles component to be rendered at the root of the app.
 */
export function GlobalStyles() {
  return <Global styles={globalStyles} />;
}
