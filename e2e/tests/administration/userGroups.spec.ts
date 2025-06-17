import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { enterAdminArea, login, navigateToUserGroupAdministration } from '../utils/helper';

test.describe('User group management', () => {
  const randomGroupName = faker.vehicle.bicycle();
  const randomNewGroupName = faker.vehicle.bicycle();
  test.beforeEach(async ({ page }) => {
    await login(page);
    await enterAdminArea(page);
  });

  test('should create a user group', async ({ page }) => {
    await navigateToUserGroupAdministration(page);

    const adminCell = page.getByRole('cell', { name: 'Default', exact: true });
    await adminCell.waitFor();

    const oldUserGroupCount = await page.getByRole('table').getByRole('row').count();

    await page.getByRole('button', { name: 'Create User Group' }).click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill(randomGroupName);
    await page.getByRole('button', { name: 'Save' }).click();

    const createUserGroupModal = page.getByRole('heading', { name: 'Create User Group' });
    await createUserGroupModal.waitFor({ state: 'detached' });

    const newUserGroupCount = await page.getByRole('table').getByRole('row').count();
    expect(newUserGroupCount).toBe(oldUserGroupCount + 1);
    const newGroup = page.getByRole('table').getByRole('row').filter({ hasText: randomGroupName });
    await expect(newGroup).toHaveCount(1);
  });

  test('should edit the user group detail', async ({ page }) => {
    await navigateToUserGroupAdministration(page);

    const userGroupBuiltIn = page.getByRole('table').getByRole('row').nth(3);

    await userGroupBuiltIn.click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill(randomNewGroupName);
    await page.getByRole('button', { name: 'Save' }).click();

    const userGroupName = await page.getByRole('cell', { name: randomNewGroupName }).textContent();

    expect(userGroupName).toEqual(randomNewGroupName);
  });

  test('should delete a user group', async ({ page }) => {
    await navigateToUserGroupAdministration(page);

    const adminCell = page.getByRole('cell', { name: 'Default', exact: true });
    await adminCell.last().waitFor();

    const userGroupToBeDeleted = page.getByRole('table').getByRole('row').last();
    const userGroupToBeDeletedText = await userGroupToBeDeleted.textContent();
    await userGroupToBeDeleted.click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    const updateUserGroupModal = page.getByRole('heading', { name: 'Update User Group' });
    await updateUserGroupModal.waitFor({ state: 'detached' });

    expect(userGroupToBeDeletedText).toBeDefined();
    const editedRows = page.getByRole('table').getByRole('row').filter({ hasText: userGroupToBeDeletedText! });
    await expect(editedRows).toHaveCount(0);
  });

  test('should alert when user group name is empty', async ({ page }) => {
    await navigateToUserGroupAdministration(page);

    await page.getByRole('button', { name: 'Create User Group' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    expect(page.getByRole('alert', { name: 'Name is a required field' })).toBeDefined();
  });

  test('should alert when monthly token is not a positive number', async ({ page }) => {
    await navigateToUserGroupAdministration(page);

    await page.getByRole('button', { name: 'Create User Group' }).click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill(randomGroupName);
    await page.getByLabel('Monthly tokens', { exact: true }).click();
    await page.getByLabel('Monthly tokens', { exact: true }).fill('0');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(page.getByRole('alert', { name: 'Monthly tokens must be a positive number' })).toBeDefined();

    await page.getByLabel('Monthly tokens', { exact: true }).click();
    await page.getByLabel('Monthly tokens', { exact: true }).fill('-1');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(page.getByRole('alert', { name: 'Monthly tokens must be a positive number' })).toBeDefined();
  });

  test('should alert when monthly token per user is not a positive number', async ({ page }) => {
    await navigateToUserGroupAdministration(page);

    await page.getByRole('button', { name: 'Create User Group' }).click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill(randomGroupName);
    await page.getByLabel('Monthly tokens / User', { exact: true }).click();
    await page.getByLabel('Monthly tokens / User', { exact: true }).fill('0');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(page.getByRole('alert', { name: 'Monthly tokens / User must be a positive number' })).toBeDefined();

    await page.getByLabel('Monthly tokens / User', { exact: true }).click();
    await page.getByLabel('Monthly tokens / User', { exact: true }).fill('-1');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(page.getByRole('alert', { name: 'Monthly tokens / User must be a positive number' })).toBeDefined();
  });
});
