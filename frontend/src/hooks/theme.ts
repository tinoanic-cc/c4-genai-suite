import { createContext, useContext } from 'react';
import { SettingsDto } from 'src/api';

export interface Theme extends SettingsDto {
  // The pae title.
  title?: string;

  key?: number;

  logoUrl?: string;

  backgroundLogoUrl?: string;

  avatarLogoUrl?: string;
}

export interface ThemeState {
  // The actual theme.
  theme: Theme;

  // Reloads the theme.
  refetch: () => void;

  // Make as a partial update of the theme.
  setTheme: (theme: Partial<Theme>) => void;
}

export const ThemeContext = createContext<ThemeState>(null!);

export function useTheme() {
  return useContext(ThemeContext);
}
