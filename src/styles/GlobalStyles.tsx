import { Global } from '@emotion/react';
import { globalStyles } from './styles';

/**
 * GlobalStyles component to be rendered at the root of the app.
 */
export default function GlobalStyles() {
  return <Global styles={globalStyles} />;
}
