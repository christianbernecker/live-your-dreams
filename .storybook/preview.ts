import type { Preview } from '@storybook/web-components';

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
        brandImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMjAwMCA3MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InRleHRHcmFkaWVudCIgeDE9IjAiIHkxPSIyNTAiIHgyPSIwIiB5Mj0iNjAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMzY2Q0M7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDA2NjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSIzNzAiIHk9IjU2MCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNjAiIGZvbnQtd2VpZ2h0PSI1MDAiIGxldHRlci1zcGFjaW5nPSIyNXB4IiBmaWxsPSJ1cmwoI3RleHRHcmFkaWVudCkiPkxZRDwvdGV4dD4KPHR4dCB4PSIxMDY1IiB5PSI1NjAiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iMzAwIiBsZXR0ZXItc3BhY2luZz0iMnB4IiBmaWxsPSJ1cmwoI3RleHRHcmFkaWVudCkiPkxJVkUgWU9VUiBEUkVBTVM8L3RleHQ+Cjwvc3ZnPgo=',
        colorPrimary: '#0066ff',
        colorSecondary: '#004299'
      }
    }
  },
};

export default preview;

