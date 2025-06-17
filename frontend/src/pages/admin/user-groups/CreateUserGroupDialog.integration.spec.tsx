import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { http } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateUserGroupDialog, CreateUserGroupDialogProps } from 'src/pages/admin/user-groups/CreateUserGroupDialog';

import { texts } from 'src/texts';
import { server } from '../../../../mock/node';
import { apiBaseUrl, render, required } from '../test-utils';

describe('CreateUserGroupDialog', () => {
  beforeAll(() => server.listen());
  beforeEach(() => {
    vi.resetAllMocks();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const defaultProps: CreateUserGroupDialogProps = {
    onClose: vi.fn(),
    onCreate: vi.fn(),
  };

  it('should call onCreate with user group', async () => {
    render(<CreateUserGroupDialog {...defaultProps} />);

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(required(texts.common.groupName));
    await user.click(nameInput);
    await user.type(nameInput, 'st2');
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    await user.click(saveBtn);

    expect(defaultProps.onCreate).toHaveBeenCalledWith(expect.objectContaining({ name: 'st2' }));
  });

  it('should display an error message on response 500', async () => {
    render(<CreateUserGroupDialog {...defaultProps} />);
    server.use(
      http.post(`${apiBaseUrl}/user-groups`, () => {
        return new Response(null, { status: 500 });
      }),
    );

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(required(texts.common.groupName));
    await user.click(nameInput);
    await user.type(nameInput, 'st2');

    const saveButton = screen.getByRole('button', { name: texts.common.save });
    await user.click(saveButton);
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});
