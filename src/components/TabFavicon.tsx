import React from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material/styles';
import { Tab } from '../types/Tab';

function faviconProxyUrl(pageUrl?: string): string | undefined {
  if (!pageUrl || !/^https?:|^chrome:|^file:|^ftp:/i.test(pageUrl)) return undefined;
  try {
    return (browser.runtime.getURL as (path: string) => string)(`/_favicon/?pageUrl=${encodeURIComponent(pageUrl)}&size=32`);
  } catch {
    return undefined;
  }
}

export function getFaviconCandidates(tab: Tab): string[] {
  return [...new Set([tab.favIconUrl, faviconProxyUrl(tab.url)].filter((value): value is string => Boolean(value)))];
}

interface TabFaviconProps {
  tab: Tab;
  alt?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  showImage?: boolean;
}

export function TabFavicon({ tab, alt, sx, children, showImage = true }: TabFaviconProps) {
  const candidates = React.useMemo(() => getFaviconCandidates(tab), [tab.favIconUrl, tab.url]);
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
