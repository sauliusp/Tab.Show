import React from 'react';
import { Box, Button, Fade, Paper, Popper, Typography } from '@mui/material';
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import PersonAddAlt1Rounded from '@mui/icons-material/PersonAddAlt1Rounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { EXTENSION_URLS } from '../parameters';

export const TELL_A_FRIEND_TEXT = `Try TabShow: find the right Chrome tab without losing your place: ${EXTENSION_URLS.CHROME_WEB_STORE}`;

async function copyShareMessage(): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(TELL_A_FRIEND_TEXT);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = TELL_A_FRIEND_TEXT;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Clipboard copy failed');
}

export function PanelEngagementBar() {
  const shareButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyState, setCopyState] = React.useState<'idle' | 'copied' | 'error'>('idle');

  React.useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const handleTellFriend = async () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    try {
      await copyShareMessage();
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    closeTimerRef.current = setTimeout(() => setCopyState('idle'), 2600);
  };

  return (
    <Box sx={{ px: 1.25, py: 0.8, flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75, borderTop: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
      <Button
        component="a"
        href={EXTENSION_URLS.FEATURE_REQUEST}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        variant="outlined"
        startIcon={<LightbulbRounded sx={{ fontSize: 15 }} />}
        sx={{ minWidth: 0, py: 0.65, textTransform: 'none', fontSize: 10.75, fontWeight: 750 }}
      >
        Suggest a feature
      </Button>
      <Button
        ref={shareButtonRef}
        type="button"
        size="small"
        variant="contained"
        onClick={() => { void handleTellFriend(); }}
        startIcon={copyState === 'copied' ? <CheckCircleRounded sx={{ fontSize: 15 }} /> : <PersonAddAlt1Rounded sx={{ fontSize: 15 }} />}
        sx={{ minWidth: 0, py: 0.65, color: 'primary.contrastText', textTransform: 'none', fontSize: 10.75, fontWeight: 800 }}
      >
        {copyState === 'copied' ? 'Copied' : 'Tell a friend'}
      </Button>
      <Popper open={copyState !== 'idle'} anchorEl={shareButtonRef.current} placement="top-end" transition sx={{ zIndex: 1400 }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={170}>
            <Paper role="status" aria-live="polite" elevation={8} sx={{ mb: 0.75, px: 1.25, py: 0.9, maxWidth: 235, border: 1, borderColor: copyState === 'error' ? 'error.main' : 'divider', borderRadius: 1.75 }}>
              <Typography sx={{ fontSize: 10.75, fontWeight: 850, color: copyState === 'error' ? 'error.main' : 'text.primary' }}>
                {copyState === 'error' ? 'Could not access the clipboard' : 'Chrome extension link copied'}
              </Typography>
              <Typography sx={{ mt: 0.15, fontSize: 9.75, lineHeight: 1.35, color: 'text.secondary' }}>
                {copyState === 'error' ? 'Copy the Store link from Settings instead.' : 'Paste it into any message, email, or post.'}
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
