import { t, formatNumber, type MessageKey } from '../i18n';
import React from 'react';
import { Box, Typography, IconButton, RadioGroup, FormControlLabel, Radio, Button, Slider, ToggleButton, ToggleButtonGroup, Drawer, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import LocalCafeOutlined from '@mui/icons-material/LocalCafeOutlined';
import BrightnessAutoRounded from '@mui/icons-material/BrightnessAutoRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import { useColorScheme } from '../contexts/ColorSchemeContext';
import { useUserSettings } from '../contexts/UserSettingsContext';
import { EXTENSION_URLS } from '../parameters';
import type { AppearanceMode } from '../services/UserSettingsService';

const pairingMessages: Record<string, { name: MessageKey; description: MessageKey }> = {
  'charcoal-violet-amber': { name: 'panelPairVioletAmber', description: 'panelPairVioletAmberDescription' },
  'ink-porcelain-signal-blue': { name: 'panelPairInkBlue', description: 'panelPairInkBlueDescription' },
  'graphite-soft-clay-electric-coral': { name: 'panelPairGraphiteCoral', description: 'panelPairGraphiteCoralDescription' },
  'midnight-teal-mist-citrine': { name: 'panelPairTealCitrine', description: 'panelPairTealCitrineDescription' },
  'slate-spruce-seafoam': { name: 'panelPairSlateSeafoam', description: 'panelPairSlateSeafoamDescription' },
  'mocha-rose-quartz': { name: 'panelPairMochaRose', description: 'panelPairMochaRoseDescription' },
};

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const theme = useTheme();
  const { colorPairingId, availablePairings, setColorPairingById, resolvedMode } = useColorScheme();
  const {
    hoverPreviewDelayMs, setHoverPreviewDelayMs, appearanceMode, setAppearanceMode,
    keepPanelOpen, setKeepPanelOpen, hoverPreviewEnabled, setHoverPreviewEnabled,
  } = useUserSettings();
  const version = typeof browser !== 'undefined' ? browser.runtime?.getManifest?.().version : undefined;
  const localPageUrl = (page: 'welcome' | 'whats-new') => {
    const path = `/pages/${page}/index.html` as const;
    return typeof browser !== 'undefined' && browser.runtime?.getURL ? browser.runtime.getURL(path) : path;
  };

  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorPairingById(event.target.value);
  };

  const handleHoverDelayChange = (_event: Event, value: number | number[]) => {
    const delayMs = Array.isArray(value) ? value[0] : value;
    if (delayMs !== undefined) setHoverPreviewDelayMs(delayMs);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': 'settings-overlay-title',
          onKeyDown: (event: React.KeyboardEvent) => {
            event.stopPropagation();
            if (event.key === 'Escape') {
              event.preventDefault();
              onClose();
            }
          },
          sx: {
            width: 360,
            maxWidth: '100%',
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        },
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
          {t('panelSettings')}
        </Typography>
        <IconButton aria-label={t('panelCloseSettings')} onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, overflowY: 'auto' }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            {t('panelTabSwitching')}
          </Typography>
          <FormControlLabel
            control={<Switch checked={keepPanelOpen} onChange={(_event, checked) => setKeepPanelOpen(checked)} size="small" />}
            label={<Typography variant="body2">{t('panelKeepOpen')}</Typography>}
            sx={{ alignItems: 'flex-start', ml: -0.5, mr: 0 }}
          />
          <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, mt: 0.5 }}>
            {t('panelKeepOpenDescription')}
          </Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <FormControlLabel
            control={<Switch checked={hoverPreviewEnabled} onChange={(_event, checked) => setHoverPreviewEnabled(checked)} size="small" />}
            label={<Typography variant="body2">{t('panelHoverPreview')}</Typography>}
            sx={{ ml: -0.5, mr: 0 }}
          />
          <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, mt: 0.5 }}>
            {t('panelHoverPreviewDescription')}
          </Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            {t('panelAppearance')}
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={appearanceMode}
            onChange={(_event, value: AppearanceMode | null) => { if (value) setAppearanceMode(value); }}
            aria-label={t('panelAppearanceMode')}
          >
            <ToggleButton value="system" aria-label={t('panelUseSystemAppearance')} sx={{ gap: 0.5, py: 0.8, textTransform: 'none', fontSize: 10.5 }}>
              <BrightnessAutoRounded sx={{ fontSize: 16 }} /> {t('panelSystem')}
            </ToggleButton>
            <ToggleButton value="light" aria-label={t('panelUseLightAppearance')} sx={{ gap: 0.5, py: 0.8, textTransform: 'none', fontSize: 10.5 }}>
              <LightModeRounded sx={{ fontSize: 16 }} /> {t('panelLight')}
            </ToggleButton>
            <ToggleButton value="dark" aria-label={t('panelUseDarkAppearance')} sx={{ gap: 0.5, py: 0.8, textTransform: 'none', fontSize: 10.5 }}>
              <DarkModeRounded sx={{ fontSize: 16 }} /> {t('panelDark')}
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" sx={{ mt: 0.75, display: 'block', color: theme.palette.text.secondary }}>
            {appearanceMode === 'system' ? t(resolvedMode === 'dark' ? 'panelFollowingDark' : 'panelFollowingLight') : t(appearanceMode === 'dark' ? 'panelAlwaysDark' : 'panelAlwaysLight')}
            {' '}{t('panelSystemThemeHint')}
          </Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            {t('panelHoverDelay')}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            {t('panelDelayValue', { seconds: formatNumber(hoverPreviewDelayMs / 1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), milliseconds: hoverPreviewDelayMs })}
          </Typography>
          <Slider
            value={hoverPreviewDelayMs}
            disabled={!hoverPreviewEnabled}
            onChange={handleHoverDelayChange}
            min={0}
            max={1000}
            step={50}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => t('panelMilliseconds', { value })}
            aria-label={t('panelHoverDelayAria')}
          />
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {t('panelHoverDelayHint')}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1.5 }}>
          {t('panelChoosePairing')}
        </Typography>

        <RadioGroup value={colorPairingId} onChange={handleSelectionChange} sx={{ minWidth: 0 }}>
          {availablePairings.map((pairing) => {
            const isActive = pairing.id === colorPairingId;
            const messages = pairingMessages[pairing.id];
            return (
              <Box
                key={pairing.id}
                sx={{
                  border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  minWidth: 0,
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', color: theme.palette.text.primary, overflowWrap: 'anywhere' }}>
                        {messages ? t(messages.name) : pairing.name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, rowGap: 0.75 }}>
                        <ColorSwatch color={pairing.colors.primary} label={t('panelPrimary')} />
                        <ColorSwatch color={pairing.colors.secondary} label={t('panelSecondary')} />
                      </Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {messages ? t(messages.description) : pairing.comment}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    alignItems: 'flex-start',
                    width: '100%',
                    minWidth: 0,
                    margin: 0,
                    '& .MuiRadio-root': { flexShrink: 0 },
                    '& .MuiFormControlLabel-label': { minWidth: 0, flex: 1, overflowWrap: 'anywhere' },
                  }}
                />
              </Box>
            );
          })}
        </RadioGroup>

        <Box sx={{ mt: 1, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
            {t('panelImproveHeading')}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.5, mb: 1.25 }}>
            {t('panelImproveDescription')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
            <Button
              component="a"
              href={EXTENSION_URLS.FEATURE_REQUEST}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              startIcon={<LightbulbRounded sx={{ fontSize: 16 }} />}
              sx={{ minWidth: 0, overflowWrap: 'anywhere', textTransform: 'none', fontSize: 11.5 }}
            >
              {t('panelShareIdea')}
            </Button>
            <Button
              component="a"
              href={EXTENSION_URLS.CHROME_WEB_STORE_REVIEW}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="text"
              startIcon={<StarRounded sx={{ fontSize: 16 }} />}
              sx={{ minWidth: 0, overflowWrap: 'anywhere', textTransform: 'none', fontSize: 11.5, color: theme.palette.text.secondary }}
            >
              {t('panelRate')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2">{version ? t('panelAboutVersion', { version }) : t('panelAbout')}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Button component="a" href={localPageUrl('whats-new')} target="_blank" rel="noopener noreferrer" size="small" sx={{ textTransform: 'none' }}>
              {t('panelWhatsNew')}
            </Button>
            <Button component="a" href={localPageUrl('welcome')} target="_blank" rel="noopener noreferrer" size="small" sx={{ textTransform: 'none' }}>
              {t('panelGettingStarted')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
            {t('panelSupport')}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.5, mb: 1.25 }}>
            {t('panelSupportDescription')}
          </Typography>
          <Button
            component="a"
            href={EXTENSION_URLS.BUY_ME_A_COFFEE}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            size="small"
            variant="contained"
            disableElevation
            startIcon={<LocalCafeOutlined sx={{ fontSize: 18 }} />}
            sx={{
              py: 1,
              textTransform: 'none',
              fontSize: 12,
              fontWeight: 750,
              color: '#302815',
              backgroundColor: '#FFDD80',
              '&:hover': { backgroundColor: '#F5CE62' },
              '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 3 },
            }}
          >
            {t('panelCoffee')}
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1.5,
            mt: 2,
          }}
        >
          <Button
            size="medium"
            variant="contained"
            onClick={onClose}
            sx={{
              color: theme.palette.primary.contrastText,
            }}
          >
            {t('panelDone')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, maxWidth: '100%', gap: 0.75 }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          flexShrink: 0,
          borderRadius: 1,
          backgroundColor: color,
          border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.common.white + '33' : theme.palette.common.black + '20'}`,
        }}
      />
      <Typography variant="caption" sx={{ minWidth: 0, overflowWrap: 'anywhere', color: theme.palette.text.secondary }}>
        {label}
      </Typography>
    </Box>
  );
}
