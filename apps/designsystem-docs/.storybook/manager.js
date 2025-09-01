import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'Live Your Dreams Design System',
  brandUrl: 'https://liveyourdreams.de',
  brandTarget: '_self',
  
  // Colors
  colorPrimary: '#3366CC',
  colorSecondary: '#000066',
  
  // UI
  appBg: '#F8FAFF',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E8F0FE',
  appBorderRadius: 12,
  
  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  
  // Text colors
  textColor: '#0F172A',
  textInverseColor: '#FFFFFF',
  
  // Toolbar default and active colors
  barTextColor: '#64748B',
  barSelectedColor: '#3366CC',
  barBg: '#FFFFFF',
  
  // Form colors
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputTextColor: '#0F172A',
  inputBorderRadius: 8,
});

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  selectedPanel: 'controls',
  showNav: true,
  showPanel: true,
  showToolbar: true,
});

// Add custom manager head
document.title = 'LYD Design System';

// Add favicon
const link = document.querySelector("link[rel~='icon']");
if (!link) {
  const newLink = document.createElement('link');
  newLink.rel = 'icon';
  newLink.href = '/favicon.ico';
  document.head.appendChild(newLink);
}
