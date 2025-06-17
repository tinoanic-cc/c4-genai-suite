import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from 'src/components/Markdown';

describe('Markdown component', () => {
  it('renders table correctly', () => {
    const content = '| Header1 | Header2 |\n|---------|---------|\n| Hello   | C4   |';
    render(<Markdown>{content}</Markdown>);

    const markdownTable = screen.getByRole('table');
    expect(markdownTable).toBeInTheDocument();

    const header1 = screen.getByRole('columnheader', { name: 'Header1' });
    const header2 = screen.getByRole('columnheader', { name: 'Header2' });

    expect(header1).toBeInTheDocument();
    expect(header2).toBeInTheDocument();

    const cellHello = screen.getByRole('cell', { name: 'Hello' });
    const cellC4 = screen.getByRole('cell', { name: 'C4' });
    expect(cellHello).toBeInTheDocument();
    expect(cellC4).toBeInTheDocument();
  });

  it('renders img correctly', () => {
    const imageUrl = 'https://c4.dev.ccopt.de/blobs/7a181be7-fa78-4bfe-bf02-faaa3392b926';
    const content = `![Image](${imageUrl})`;
    render(<Markdown>{content}</Markdown>);

    const markdownImage = screen.getByRole<HTMLImageElement>('img');
    expect(markdownImage).toBeInTheDocument();
    expect(markdownImage.src).toBe(imageUrl);
  });
});
