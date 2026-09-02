import { getContrastRatio } from '@mui/material/styles';

export function getReadableTextColor(background: string): string {
  return getContrastRatio(background, '#ffffff') >= getContrastRatio(background, '#11131a')
    ? '#ffffff'
    : '#11131a';
}
