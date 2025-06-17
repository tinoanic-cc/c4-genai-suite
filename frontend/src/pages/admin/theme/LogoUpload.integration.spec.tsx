import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LogoUpload } from 'src/pages/admin/theme/LogoUpload';
import { texts } from 'src/texts';
import { server } from '../../../../mock/node';
import { apiBaseUrl, fileWithLogo, render } from '../test-utils';

function startMockedServer(interceptedRequest: { received: boolean }) {
  server.use(
    http.post(`${apiBaseUrl}/settings/logo`, () => {
      interceptedRequest.received = true;
      return HttpResponse.json();
    }),
  );
  server.use(
    http.delete(`${apiBaseUrl}/settings/logo`, () => {
      interceptedRequest.received = true;
      return HttpResponse.json();
    }),
  );
}

describe('LogoUpload save', () => {
  const user = userEvent.setup();

  beforeAll(() => server.listen());
  beforeEach(() => {
    vi.resetAllMocks();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should update logo preview', async () => {
    render(<LogoUpload imageType="logo" />);
    const interceptedRequest = { received: false };
    startMockedServer(interceptedRequest);

    const imageBefore = screen.queryByRole<HTMLImageElement>('img');
    expect(imageBefore).not.toBeInTheDocument();

    const fileUpload = screen.getByTestId('logo-upload-input');
    await user.upload(fileUpload, fileWithLogo);

    const imageAfter = screen.getByRole<HTMLImageElement>('img');
    expect(interceptedRequest.received).toBe(false);
    expect(imageAfter.src).toContain('logo-new.svg');
  });

  it('should save logo', async () => {
    render(<LogoUpload imageType="logo" />);
    const interceptedRequest = { received: false };
    startMockedServer(interceptedRequest);

    const fileUpload = screen.getByTestId('logo-upload-input');
    await user.upload(fileUpload, fileWithLogo);

    const button = screen.getByRole('button', { name: texts.common.save });
    await user.click(button);

    expect(interceptedRequest.received).toBe(true);
  });

  it('should disable the upload button while the file is uploading', async () => {
    render(<LogoUpload imageType="logo" />);
    const interceptedRequest = { received: false };
    startMockedServer(interceptedRequest);

    const fileUpload = screen.getByTestId('logo-upload-input');
    const saveButton = screen.getByRole('button', { name: texts.common.save });

    expect(saveButton).toBeDisabled();

    await user.upload(fileUpload, fileWithLogo);
    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);

    expect(interceptedRequest.received).toBe(true);
    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('should handle BadRequest response from the server', async () => {
    const interceptedRequest = { received: false };
    server.use(
      http.post(`${apiBaseUrl}/settings/logo`, () => {
        interceptedRequest.received = true;
        return new HttpResponse('Bad Stuff happened', { status: 400 });
      }),
    );

    render(<LogoUpload imageType="logo" />);

    const fileUpload = screen.getByTestId('logo-upload-input');
    await user.upload(fileUpload, fileWithLogo);

    const button = screen.getByRole('button', { name: texts.common.save });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to make update.')).toBeInTheDocument();
    });

    expect(interceptedRequest.received).toBe(true);
  });
});
describe('LogoUpload remove', () => {
  const user = userEvent.setup();

  beforeAll(() => server.listen());
  beforeEach(() => {
    vi.resetAllMocks();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  it('should remove logo', async () => {
    render(<LogoUpload imageType="logo" />, { theme: { logoUrl: 'logo-new.svg' } });
    const interceptedRequest = { received: false };
    startMockedServer(interceptedRequest);

    const image = screen.getByRole('img', { name: 'Logo' });
    expect(image).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: texts.common.remove });
    expect(removeButton).toBeEnabled();

    await user.click(removeButton);
    expect(interceptedRequest.received).toBe(true);
  });

  it('should handle BadRequest response from the server on removing logo', async () => {
    const interceptedRequest = { received: false };
    server.use(
      http.delete(`${apiBaseUrl}/settings/logo`, () => {
        interceptedRequest.received = true;
        return new HttpResponse('Bad Stuff happened', { status: 400 });
      }),
    );

    render(<LogoUpload imageType="logo" />, { theme: { logoUrl: 'logo-new.svg' } });

    expect(screen.queryByText('Failed to make update.')).not.toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: texts.common.remove });
    expect(removeButton).toBeEnabled();
    await user.click(removeButton);

    expect(interceptedRequest.received).toBe(true);
    await waitFor(() => {
      expect(screen.getByText('Failed to make update.')).toBeInTheDocument();
    });
  });
});
