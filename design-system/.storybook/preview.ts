import type { Preview } from '@storybook/html';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: {
        base: 'light',
        brandTitle: 'Live Your Dreams Design System',
        brandUrl: 'https://liveyourdreams.online',
        colorPrimary: '#0066ff',
        colorSecondary: '#004299'
      }
    }
  },
};

export default preview;