import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { DialogProvider } from 'src/components/DialogProvider';
import { MantineThemeProvider } from 'src/components/MantineThemeProvider';
import { Theme, ThemeContext, ThemeState } from 'src/hooks';

export const AllTheProviders = ({ children, theme = {} }: { children: React.ReactNode; theme?: Theme }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // turn off retries for testing
      },
    },
  });
  const mockTheme: ThemeState = {
    theme,
    setTheme: () => {},
    refetch: () => {},
  };
  return (
    <ThemeContext.Provider value={mockTheme}>
      <MantineThemeProvider>
        <DialogProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
          </QueryClientProvider>
        </DialogProvider>
      </MantineThemeProvider>
    </ThemeContext.Provider>
  );
};
