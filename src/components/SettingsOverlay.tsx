import React from 'react';
import { Box, Typography, IconButton, RadioGroup, FormControlLabel, Radio, Button, Link, Slider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useColorScheme } from '../contexts/ColorSchemeContext';
import { useUserSettings } from '../contexts/UserSettingsContext';
import { EXTENSION_URLS } from '../parameters';

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const theme = useTheme();
  const { colorPairingId, availablePairings, setColorPairingById } = useColorScheme();
  const { hoverPreviewDelayMs, setHoverPreviewDelayMs } = useUserSettings();

  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorPairingById(event.target.value);
  };

  const handleHoverDelayChange = (_event: Event, value: number | number[]) => {
    const delayMs = Array.isArray(value) ? value[0] : value;
    setHoverPreviewDelayMs(delayMs);
  };

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-overlay-title"
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 320,
        maxWidth: '80%',
        backgroundColor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        boxShadow: open ? '0 0 16px rgba(0, 0, 0, 0.35)' : 'none',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        zIndex: 1200,
        pointerEvents: open ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography id="settings-overlay-title" variant="h6" sx={{ fontSize: '1rem' }}>
          User Settings
        </Typography>
        <IconButton aria-label="Close settings" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, overflowY: 'auto' }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1.5 }}>
          Choose your color pairing
        </Typography>

        <RadioGroup value={colorPairingId} onChange={handleSelectionChange}>
          {availablePairings.map((pairing) => {
            const isActive = pairing.id === colorPairingId;
            return (
              <Box
                key={pairing.id}
                sx={{
                  border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  p: 1.5,
                  mb: 1.5,
                  backgroundColor: isActive ? theme.palette.primary.main + '14' : 'transparent',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease',
                }}
              >
                <FormControlLabel
                  value={pairing.id}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', color: theme.palette.text.primary }}>
                        {pairing.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ColorSwatch color={pairing.colors.primary} label="Primary" />
                        <ColorSwatch color={pairing.colors.secondary} label="Secondary" />
                      </Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {pairing.comment}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    alignItems: 'flex-start',
                    width: '100%',
                    margin: 0,
                  }}
                />
              </Box>
            );
          })}
        </RadioGroup>

        <Box sx={{ mt: 2.5 }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Hover preview delay
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            {`${(hoverPreviewDelayMs / 1000).toFixed(2)}s (${hoverPreviewDelayMs} ms)`}
          </Typography>
          <Slider
            value={hoverPreviewDelayMs}
            onChange={handleHoverDelayChange}
            min={0}
            max={1000}
            step={50}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} ms`}
            aria-label="Hover preview delay in milliseconds"
          />
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Increase the delay to avoid accidental previews when you brush past the sidebar.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            Want more settings?
            <Link
              href={EXTENSION_URLS.FEATURE_REQUEST}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}
            >
              Suggest here.
            </Link>
          </Typography>
          <Button
            size="medium"
            variant="contained"
            onClick={onClose}
            sx={{
              color: theme.palette.common.white,
            }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: 1,
          backgroundColor: color,
          border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.common.white + '33' : theme.palette.common.black + '20'}`,
        }}
      />
      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
        {label}
      </Typography>
    </Box>
  );
}
