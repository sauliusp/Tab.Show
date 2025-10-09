export interface ColorPairingColors {
  background: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
}

export interface ColorPairing {
  id: string;
  name: string;
  comment: string;
  colors: ColorPairingColors;
}

export const COLOR_PAIRINGS: ColorPairing[] = [
  {
    id: 'charcoal-violet-amber',
    name: 'Charcoal Violet + Amber',
    comment: 'Authoritative base with upbeat, clear call-to-action accents.',
    colors: {
      background: '#F4F4FA',
      primary: '#2C2A4A',
      secondary: '#F4A259',
      textPrimary: '#1F1C3D',
      textSecondary: '#5E5A80',
      textDisabled: '#A6A3C2',
    },
  },
  {
    id: 'ink-porcelain-signal-blue',
    name: 'Ink Black + Signal Blue',
    comment: 'Crisp contrast with a dependable, modern tech accent.',
    colors: {
      background: '#F8FAFC',
      primary: '#1F2933',
      secondary: '#2563EB',
      textPrimary: '#111827',
      textSecondary: '#4B5563',
      textDisabled: '#9CA3AF',
    },
  },
  {
    id: 'graphite-soft-clay-electric-coral',
    name: 'Graphite + Electric Coral',
    comment: 'Warm neutrals with coral bursts to draw quick focus.',
    colors: {
      background: '#FCF7F4',
      primary: '#2D2A32',
      secondary: '#FF6B6B',
      textPrimary: '#201A1E',
      textSecondary: '#6B5E64',
      textDisabled: '#B3A6AD',
    },
  },
  {
    id: 'midnight-teal-mist-citrine',
    name: 'Midnight Teal + Citrine',
    comment: 'Sophisticated teal foundation with bright citrine highlights.',
    colors: {
      background: '#F2F5F7',
      primary: '#124559',
      secondary: '#F4B41A',
      textPrimary: '#152026',
      textSecondary: '#4A5B65',
      textDisabled: '#8A99A4',
    },
  },
  {
    id: 'slate-spruce-seafoam',
    name: 'Slate Stone + Seafoam',
    comment: 'Balanced slate core with calm spruce and seafoam cues.',
    colors: {
      background: '#F5F7FA',
      primary: '#35424C',
      secondary: '#3BA99C',
      textPrimary: '#1F2933',
      textSecondary: '#52606D',
      textDisabled: '#98A1B0',
    },
  },
  {
    id: 'mocha-rose-quartz',
    name: 'Mocha + Rose Quartz',
    comment: 'Boutique warmth where mocha depth meets rose quartz softness.',
    colors: {
      background: '#F9F4F1',
      primary: '#4B3A33',
      secondary: '#D97D7D',
      textPrimary: '#322723',
      textSecondary: '#6E5B53',
      textDisabled: '#B9A49A',
    },
  },
];

export const DEFAULT_COLOR_PAIRING_ID = COLOR_PAIRINGS[0].id;

export function getDefaultColorPairing(): ColorPairing {
  return COLOR_PAIRINGS[0];
}

export function getColorPairingById(pairingId: string): ColorPairing {
  return COLOR_PAIRINGS.find((pairing) => pairing.id === pairingId) ?? getDefaultColorPairing();
}
