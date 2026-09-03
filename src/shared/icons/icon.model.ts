export const SPRITE_URL = 'assets/icons/icons.svg';

export const ICON_VIEWBOX = {
  'shopping-cart': '0 0 24 24',
  search: '0 0 20 20',
  clear: '0 0 20 20',
  'stock-in': '0 0 16 16',
  'stock-out': '0 0 16 16',
  'empty-box': '0 0 64 64',
  check: '0 0 20 20',
} as const;

export type IconName = keyof typeof ICON_VIEWBOX;
