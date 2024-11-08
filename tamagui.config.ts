import { createTamagui } from 'tamagui';

export const config = createTamagui({
  defaultFont: "body",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  media: {},
  mediaQueryDefaultActive: {},
  shorthands: {},
});

export default config;

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}