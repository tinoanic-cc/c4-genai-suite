import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavigationBar } from 'src/components/NavigationBar';
import { render } from 'src/pages/admin/test-utils';
import { InAppDocsProvider } from './InAppDocsProvider';

describe('Markdown component', () => {
  it('renders logo without text if logo present', () => {
    const theme = { logoUrl: '/settings/logo', name: 'Test' };
    render(
      <InAppDocsProvider>
        <NavigationBar theme={theme}></NavigationBar>
      </InAppDocsProvider>,
    );

    const logo = screen.getByRole<HTMLImageElement>('img');
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain(theme.logoUrl);
    expect(screen.queryByText(theme.name)).not.toBeInTheDocument();
  });

  it('renders text without logo if logo is not present', () => {
    const theme = { name: 'Test' };
    render(
      <InAppDocsProvider>
        <NavigationBar theme={theme}></NavigationBar>
      </InAppDocsProvider>,
    );

    expect(screen.getByText(theme.name)).toBeInTheDocument();

    const logo = screen.queryByRole('img');
    expect(logo).not.toBeInTheDocument();
  });
});
