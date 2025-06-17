import { formatDate } from 'date-fns';
import { memo } from 'react';
import { FileDto } from 'src/api';
import { ConfirmDialog, Icon } from 'src/components';
import { OverlayDropdown } from 'src/components/Overlay';
import { cn, formatFileSize } from 'src/lib';
import { extractType } from 'src/pages/utils';
import { texts } from 'src/texts';

interface FileCardProps {
  // The uploaded file.
  file: FileDto;

  // Invoked when deleted.
  onDelete: (file: FileDto) => void;
}

export const FileCard = memo((props: FileCardProps) => {
  const { file, onDelete } = props;

  return (
    <div className="card bg-base-100 h-36 shadow-sm hover:shadow">
      <div className="group card-body relative">
        <div className="flex justify-between">
          <span className="badge bg-gray-200">{extractType(file)}</span>
          <span className="text-sm">{formatFileSize(file.fileSize)}</span>
        </div>

        <div className="mt-2 truncate" title={file.fileName}>
          {file.fileName}
        </div>
        <span className="text-sm">{formatDate(file.uploadedAt, 'Pp')}</span>

        {onDelete && (
          <OverlayDropdown
            className="invisible absolute top-2 right-2 p-0 group-hover:visible"
            button={({ isOpen }) => (
              <button
                className={cn('btn btn-ghost btn-sm rounded-none bg-gray-100 hover:bg-gray-100', {
                  'btn-secondary !visible': isOpen,
                })}
              >
                <Icon size={16} icon="more-horizontal" />
              </button>
            )}
          >
            <ul tabIndex={0} className="dropdown-menu">
              {onDelete && (
                <li>
                  <ConfirmDialog
                    title={texts.files.removeBucketConfirmTitle}
                    text={texts.files.removeFileConfirmText}
                    onPerform={() => onDelete(file)}
                  >
                    {({ onClick }) => <a onClick={onClick}>{texts.common.remove}</a>}
                  </ConfirmDialog>
                </li>
              )}
            </ul>
          </OverlayDropdown>
        )}
      </div>
    </div>
  );
});
