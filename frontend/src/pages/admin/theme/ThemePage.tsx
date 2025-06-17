import { Page } from 'src/components';
import { texts } from 'src/texts';
import { LogoUpload } from './LogoUpload';
import { ThemeForm } from './ThemeForm';

export function ThemePage() {
  return (
    <Page>
      <h1 className="mb-4 text-3xl">{texts.theme.headline}</h1>

      <h2 className="mt-8 mb-2 text-xl">{texts.theme.logo}</h2>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <LogoUpload imageType="logo" />
        </div>
      </div>
      <h2 className="mt-8 mb-2 text-xl">{texts.theme.avatarLogo}</h2>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <LogoUpload imageType="avatarLogo" />
        </div>
      </div>

      <h2 className="mt-8 mb-2 text-xl">{texts.theme.backgroundLogo}</h2>

      <div className="card bg-base-100 mb-2 shadow">
        <div className="card-body">
          <LogoUpload imageType="backgroundLogo" />
        </div>
      </div>

      <h2 className="mb-2 pt-4 text-xl">{texts.theme.settings}</h2>

      <div className="card bg-base-100 mt-4 shadow">
        <div className="card-body">
          <ThemeForm />
        </div>
      </div>
    </Page>
  );
}
