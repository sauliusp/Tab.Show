import { darken, getContrastRatio, lighten } from '@mui/material/styles';

export function getReadableTextColor(background: string): string {
  return getContrastRatio(background, '#ffffff') >= getContrastRatio(background, '#11131a')
    ? '#ffffff'
    : '#11131a';
}

export function getReadableForegroundColor(
  foreground: string,
  background: string,
  minimumContrast = 4.5,
): string {
  if (getContrastRatio(foreground, background) >= minimumContrast) {
    return foreground;
  }

  const preferDarker = getContrastRatio('#11131a', background) >= getContrastRatio('#ffffff', background);
  const adjust = preferDarker ? darken : lighten;

  for (const amount of [0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72]) {
    const candidate = adjust(foreground, amount);
    if (getContrastRatio(candidate, background) >= minimumContrast) {
      return candidate;
    }
  }

  return preferDarker ? '#11131a' : '#ffffff';
}
