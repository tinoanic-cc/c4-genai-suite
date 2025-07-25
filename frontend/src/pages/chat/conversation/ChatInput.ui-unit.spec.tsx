import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileDto } from 'src/api';
import { useConversationBucketAvailabilities } from 'src/hooks/api/extensions';
import { useConversationFiles } from 'src/hooks/api/files';
import { render } from 'src/pages/admin/test-utils';
import { ChatInput } from './ChatInput';

vi.mock('src/api', () => ({
  useApi: () => ({}),
}));

vi.mock('src/hooks/api/extensions', () => ({
  useConversationBucketAvailabilities: vi.fn(),
}));

vi.mock('src/hooks/api/files', () => ({
  useConversationFiles: vi.fn(),
}));

vi.mocked(useConversationBucketAvailabilities)
  // @ts-expect-error we just mock the needed fields of the query
  .mockImplementation(() => ({
    data: {
      extensions: [
        {
          extensionId: 0,
          title: 'Files in Chat',
          maxFiles: 10,
          fileNameExtensions: [],
        },
        {
          extensionId: 1,
          title: 'Files Vision',
          maxFiles: 2,
          fileNameExtensions: ['.png'],
        },
      ],
    },
    refetch: vi.fn(),
  }));

describe('ChatInput', () => {
  const mockConversationFiles = (files: FileDto[]) =>
    vi
      .mocked(useConversationFiles)
      // @ts-expect-error we just mock the needed fields of the query
      .mockImplementation(() => ({
        data: files,
        refetch: vi.fn(),
      }));
  it('should allow file upload in empty conversation', () => {
    mockConversationFiles([]);

    render(<ChatInput chatId={0} submitMessage={() => {}} />);

    expect(getFileInputButton()).not.toBeDisabled();
    assertFilesInChatExtensionErrorMessageVisible(false);
    assertFilesVisionExtensionErrorMessageVisible(false);
  });
  it('should show max files warning for files vision and allow uploading other files', () => {
    mockConversationFiles([
      {
        id: 0,
        fileName: 'image-1.png',
        fileSize: 10,
        mimeType: 'image/png',
        uploadedAt: new Date(),
        docId: 0,
      },
      {
        id: 1,
        fileName: 'image-2.png',
        fileSize: 10,
        mimeType: 'image/png',
        uploadedAt: new Date(),
        docId: 0,
      },
      {
        id: 2,
        fileName: 'texfile.txt',
        fileSize: 10,
        mimeType: 'text/plain',
        uploadedAt: new Date(),
        docId: 0,
      },
    ]);

    render(<ChatInput chatId={0} submitMessage={() => {}} />);

    expect(getFileInputButton()).not.toBeDisabled();
    assertFilesInChatExtensionErrorMessageVisible(false);
    assertFilesVisionExtensionErrorMessageVisible(true);
  });
  it('should show max files warning for both extensions', () => {
    mockConversationFiles([
      {
        id: 0,
        fileName: 'image-1.png',
        fileSize: 10,
        mimeType: 'image/png',
        uploadedAt: new Date(),
        docId: 0,
      },
      {
        id: 1,
        fileName: 'image-2.png',
        fileSize: 10,
        mimeType: 'image/png',
        uploadedAt: new Date(),
        docId: 0,
      },
      ...Array.from({ length: 10 }, (_, index) => ({
        id: index + 2,
        fileName: `textfile-${index + 1}.txt`,
        fileSize: 10,
        mimeType: 'text/plain',
        uploadedAt: new Date(),
        docId: 0,
      })),
    ]);
    render(<ChatInput chatId={0} submitMessage={() => {}} />);

    expect(getFileInputButton()).toBeDisabled();
    assertFilesInChatExtensionErrorMessageVisible(true);
    assertFilesVisionExtensionErrorMessageVisible(true);
  });
});

const assertFilesInChatExtensionErrorMessageVisible = (visible: boolean) => {
  const message = screen.queryByText('You have reached the maximum upload limit of 10 files for the Files in Chat extension.');
  if (visible) {
    expect(message).toBeVisible();
  } else {
    expect(message).toBeNull();
  }
};
const assertFilesVisionExtensionErrorMessageVisible = (visible: boolean) => {
  const message = screen.queryByText('You have reached the maximum upload limit of 2 files for the Files Vision extension.');
  if (visible) {
    expect(message).toBeVisible();
  } else {
    expect(message).toBeNull();
  }
};
const getFileInputButton = () => screen.getByTestId('file-upload');
