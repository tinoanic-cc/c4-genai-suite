import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BucketDtoTypeEnum, FileDto, useApi } from 'src/api';
import { Pagingation } from 'src/components';
import { buildError } from 'src/lib';
import { texts } from 'src/texts';
import { FileCard } from './FileCard';
import { useFilesStore } from './state';

export function FilesPage() {
  const api = useApi();
  const pageSize = 20;

  const bucketParam = useParams<'id'>();
  const bucketId = +bucketParam.id!;
  const [uploading, setUploading] = useState<File[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { files, removeFile, setFile, setFiles } = useFilesStore();

  const { data: bucket } = useQuery({
    queryKey: ['bucket', bucketId],
    queryFn: () => api.files.getBucket(bucketId),
  });

  const { data: loadedFiles } = useQuery({
    // we need to requery when the total changed (because we uploaded/deleted one)
    queryKey: ['files', bucketId, page, pageSize, total],
    queryFn: () => api.files.getFiles(bucketId, page, pageSize),
  });

  useEffect(() => {
    if (loadedFiles) {
      setFiles(loadedFiles.items);
      setTotal(loadedFiles.total);
    }
  }, [loadedFiles, setFiles, setTotal]);

  const upload = useMutation({
    mutationFn: (file: File) => api.files.postFile(bucketId, file),
    onMutate: (file) => {
      setUploading((files) => [...files, file]);
    },
    onSuccess: (file) => {
      setFile(file);
      setTotal((t) => t + 1);
    },
    onSettled: (_, __, file) => {
      setUploading((files) => files.filter((f) => f !== file));
    },
    onError: async (error, file) => {
      toast.error(await buildError(`${texts.files.uploadFailed} '${file.name}'`, error));
    },
  });

  const deleting = useMutation({
    mutationFn: (file: FileDto) => {
      return api.files.deleteFile(bucketId, file.id);
    },
    onSuccess: (_, bucket) => {
      removeFile(bucket.id);
      setTotal((t) => t - 1);
    },
    onError: async (error) => {
      toast.error(await buildError(texts.files.removeFileFailed, error));
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files.forEach((file) => upload.mutate(file)),
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex">
          <h2 className="grow text-2xl">{texts.files.headlineSearchable}</h2>
        </div>

        {/* only show the file upload dropzone if this is not a user/conversation bucket */}
        {bucket?.type !== BucketDtoTypeEnum.Conversation && bucket?.type !== BucketDtoTypeEnum.User && (
          <div
            className="rounded-box flex h-32 items-center justify-center border-2 border-dashed border-gray-300 p-4 text-gray-600 transition-all hover:border-gray-400"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? <p>{texts.common.dropZoneDrop}</p> : <p>{texts.common.dropZone}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {files.map((file) => (
            <FileCard key={file.id} file={file} onDelete={deleting.mutate} />
          ))}

          {uploading.map((file, i) => (
            <div
              key={i}
              className="rounded-box flex h-32 flex-col items-center justify-center gap-2 truncate bg-gray-200 p-8 text-sm text-gray-500"
            >
              {texts.files.uploading}

              <div>{file.name}</div>
            </div>
          ))}
        </div>
        <Pagingation page={page} pageSize={pageSize} total={total} onPage={setPage} />
      </div>
    </>
  );
}
