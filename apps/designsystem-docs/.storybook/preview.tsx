import type { Preview } from '@storybook/react';
import { LdsProvider } from '@liveyourdreams/design-system-react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <LdsProvider theme="light" locale="de">
        <Story />
      </LdsProvider>
    ),
  ],
};

export default preview;
