import { ThemeProvider, useTheme } from '@/providers/theme-provider';

import { ReactNode } from 'react';

function App({ children }: { children: ReactNode }) {
  const { theme: darkOrLight } = useTheme();
  return (
    <ThemeProvider defaultTheme={darkOrLight} storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  );
}

export default App;
