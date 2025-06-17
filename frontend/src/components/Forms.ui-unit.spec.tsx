import { fireEvent, renderHook, screen, within } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { UpsertBucketDto } from 'src/api';
import { Forms } from 'src/components';
import { render } from 'src/pages/admin/test-utils';

describe('Form components', () => {
  it('FileSizeDynamicFields add new field', () => {
    const { result } = renderHook(() =>
      useForm<UpsertBucketDto>({
        defaultValues: {
          isDefault: false,
          perUserQuota: 20,
          allowedFileNameExtensions: [],
          fileSizeLimits: { general: 1, pdf: 10, pptx: 10 },
        },
      }),
    );

    const form = result.current;
    render(
      <FormProvider {...form}>
        <Forms.FileSizeDynamicFields name="fileSizeLimits" label="File Size Limit" suffix="MB" />
      </FormProvider>,
    );

    const addButton = screen.getByTestId('fileSizeLimitsDynamic.add');
    fireEvent.click(addButton);

    // Find the newly added key input field (it's the last one)
    const keyInputs = screen.getAllByPlaceholderText('pdf');
    const newKeyInput = keyInputs[keyInputs.length - 1];
    fireEvent.change(newKeyInput, { target: { value: 'xlsx' } });

    // Find the newly added value input field (it's the last one)
    const valueInputs = screen.getAllByPlaceholderText('10');
    const newValueInput = valueInputs[valueInputs.length - 1];
    fireEvent.change(newValueInput, { target: { value: '13' } });

    const formValues = form.getValues();
    expect(formValues.fileSizeLimits).toBeDefined();
    expect(formValues.fileSizeLimits.xlsx).toBe(13);
  });

  it('FileSizeDynamicFields remove field', () => {
    const { result } = renderHook(() =>
      useForm<UpsertBucketDto>({
        defaultValues: {
          isDefault: false,
          perUserQuota: 20,
          allowedFileNameExtensions: [],
          fileSizeLimits: { general: 1, pdf: 10, pptx: 10 },
        },
      }),
    );

    const form = result.current;
    render(
      <FormProvider {...form}>
        <Forms.FileSizeDynamicFields name="fileSizeLimits" label="File Size Limit" suffix="MB" />
      </FormProvider>,
    );

    const rows = screen.getAllByTestId(/fileSizeLimitsDynamic\.\d+\.row/);
    const rowToRemove = rows.find((row) => {
      const keyInput = within(row).getByTestId(/fileSizeLimitsDynamic\.\d+\.key/);
      return (keyInput as HTMLInputElement).value === 'pptx';
    });

    const removeButton = within(rowToRemove!).getByTestId(/fileSizeLimitsDynamic\.\d+\.remove/);
    fireEvent.click(removeButton);

    const formValues = form.getValues();
    expect(formValues.fileSizeLimits.pptx).toBeUndefined();
  });
});
