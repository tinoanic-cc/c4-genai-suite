import { IconFileXFilled } from '@tabler/icons-react';

export const UploadLimitReached = () => {
  return (
    <div className="text-text-primary animate-in fade-in absolute top-0 left-0 z-[9999] flex h-full w-full flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-[4px] transition-all duration-200 ease-in-out">
      <IconFileXFilled width={128} size={128} fill="#3C46FF" />
      <b>Upload limit reached</b>
      You can start a new converstation to upload other files or remove existing files.
    </div>
  );
};
