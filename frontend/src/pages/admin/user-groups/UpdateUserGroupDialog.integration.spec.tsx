import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserGroupDto } from 'src/api';
import { UpdateUserGroupDialog, UpdateUserGroupDialogProps } from 'src/pages/admin/user-groups/UpdateUserGroupDialog';
import { texts } from 'src/texts';
import { server } from '../../../../mock/node';
import { apiBaseUrl, render, required } from '../test-utils';

describe('UpdateUserGroupDialog', () => {
  beforeAll(() => server.listen());
  beforeEach(() => {
    vi.resetAllMocks();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const mockUserGroup: UserGroupDto = {
    id: 'st1',
    name: 'St1',
    isAdmin: false,
    isBuiltIn: false,
    monthlyTokens: 1,
    monthlyUserTokens: 1,
  };

  const defaultProps: UpdateUserGroupDialogProps = {
    target: mockUserGroup,
    onClose: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  };

  it('should call onUpdate with updated user group info', async () => {
    const newUserName = 'new user name';

    render(<UpdateUserGroupDialog {...defaultProps} />);

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(required(texts.common.groupName));
    await user.clear(nameInput);
    await user.type(nameInput, newUserName);

    const saveButton = screen.getByRole('button', { name: texts.common.save });
    await user.click(saveButton);

    expect(defaultProps.onUpdate).toHaveBeenCalledWith(expect.objectContaining({ name: newUserName }));
    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(defaultProps.onDelete).not.toHaveBeenCalled();
  });

  it('should call onDelete with user group id that was deleted', async () => {
    render(<UpdateUserGroupDialog {...defaultProps} />);

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: texts.common.remove });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: texts.common.remove });
    await user.click(confirmButton);

    const yesButton = screen.getByRole('button', { name: texts.common.confirm });
    await user.click(yesButton);

    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockUserGroup.id);
    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(defaultProps.onUpdate).not.toHaveBeenCalled();
  });

  it('should display an error message on response 500', async () => {
    render(<UpdateUserGroupDialog {...defaultProps} />);
    server.use(
      http.put(`${apiBaseUrl}/user-groups/*`, () => {
        return new Response(null, { status: 500 });
      }),
    );

    const user = userEvent.setup();
    const saveButton = screen.getByRole('button', { name: texts.common.save });
    await user.click(saveButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});
