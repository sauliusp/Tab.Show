import React from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material/styles';
import { Tab } from '../types/Tab';

export function getFaviconCandidates(tab: Tab): string[] {
  return tab.favIconUrl ? [tab.favIconUrl] : [];
}

interface TabFaviconProps {
  tab: Tab;
  alt?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  showImage?: boolean;
}

export function TabFavicon({ tab, alt, sx, children, showImage = true }: TabFaviconProps) {
  const candidates = React.useMemo(() => getFaviconCandidates(tab), [tab.favIconUrl]);
  const [candidateIndex, setCandidateIndex] = React.useState(0);

  React.useEffect(() => setCandidateIndex(0), [candidates.join('|')]);

  const src = showImage ? candidates[candidateIndex] : undefined;
  return (
    <Avatar
      alt={alt ?? tab.title ?? 'Tab'}
      src={src}
      imgProps={{
        onError: () => setCandidateIndex(index => Math.min(index + 1, candidates.length))
      }}
      sx={sx}
    >
      {!src && children}
    </Avatar>
  );
}
