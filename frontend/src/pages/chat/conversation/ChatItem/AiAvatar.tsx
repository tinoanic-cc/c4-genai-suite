import { Logo } from 'src/components';

type AiAvatarProps = { avatarLogoUrl?: string; llmLogo?: string; baseUrl: string };
export const AiAvatar = ({ avatarLogoUrl, llmLogo }: AiAvatarProps) => {
  return (
    <div className="max-h-4 min-h-4 max-w-4 min-w-4 p-0">
      {!avatarLogoUrl && llmLogo && <Logo previewLogo={llmLogo} />}
      {avatarLogoUrl && <Logo url={avatarLogoUrl} />}
      {!avatarLogoUrl && !llmLogo && (
        <div className="avatar placeholder">
          <div className="bg-cc h-full w-full rounded-full fill-black/60">AI</div>
        </div>
      )}
    </div>
  );
};
