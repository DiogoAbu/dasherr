import { Theme } from '../types';

const theme: Theme = {
  $theme: 'dark',

  $bgColor: '#222429',
  $bgColorContrast: '#4d515c',

  $textColor: '#ffffff',
  $textColorContrast: '#333333',
  $textColorFaded: '#bcbdbe',

  $listItemHeight: 60,
  $listItemIconHeight: 42,

  $statusBarStyle: 'light-content',
  $statusBarBgColor: 'rgba(0,0,0,0.3)',
  $statusBarTranslucent: true,

  $tabFontSize: '$fontSizeSx',
  $tabActiveColor: '$brandInfo',
  $tabInactiveColor: '$textColorFaded',
  $tabActiveBgColor: '#3a3d42',
  $tabInactiveBgColor: '#3a3d42',
  $tabBorderTopColor: '#7c7e82',

  $brandDefault: '#3b3b48',
  $brandPrimary: '#9973e6',
  $brandSuccess: '#94cc5c',
  $brandInfo: '#62b1d9',
  $brandWarning: '#e6bb67',
  $brandDanger: '#e67c67',

  $brandDefaultText: '#ffffff',
  $brandPrimaryText: '#ffffff',
  $brandSuccessText: '#ffffff',
  $brandInfoText: '#ffffff',
  $brandWarningText: '#ffffff',
  $brandDangerText: '#ffffff',

  $pressColor: '$brandPrimary',

  $textShadowColor: 'rgba(0,0,0,0.6)',
  $textShadowRadius: 24,
  $textShadowOffset: { width: 0, height: 1 },

  $fontSize: 15,
  $fontSizeMx: '$fontSize * 3',
  $fontSizeSx: '$fontSize * 2',
  $fontSizeXx: '$fontSize * 1.8',
  $fontSizeXl: '$fontSize * 1.5',
  $fontSizeLg: '$fontSize * 1.25',
  $fontSizeSm: '$fontSize * 0.85',
  $fontSizeXs: '$fontSize * 0.7',
  $fontSizeSs: '$fontSize * 0.5',
};

export default theme;
