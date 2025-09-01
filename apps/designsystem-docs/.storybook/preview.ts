import type { Preview } from '@storybook/react';
import '@liveyourdreams/design-system/dist/index.css';
import '../styles/storybook.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      theme: {
        base: 'light',
        colorPrimary: '#3366CC',
        colorSecondary: '#000066',
        appBg: '#F8FAFF',
        appContentBg: '#FFFFFF',
        textColor: '#0F172A',
      },
      source: {
        type: 'code',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'gray',
          value: '#F8FAFF',
        },
        {
          name: 'dark',
          value: '#0F172A',
        },
        {
          name: 'brand',
          value: '#3366CC',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        wide: {
          name: 'Wide Screen',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            reviewOnFail: true,
          },
          {
            id: 'focus-trap',
            reviewOnFail: true,
          },
        ],
      },
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Design Tokens',
          ['Colors', 'Typography', 'Spacing', 'Shadows'],
          'Components',
          ['Basics', 'Forms', 'Navigation', 'Feedback', 'Layout'],
          'Examples',
        ],
      },
    },
  },
  
  decorators: [
    (Story) => (
      <div className="lds-storybook-wrapper">
        <Story />
      </div>
    ),
  ],
  
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
