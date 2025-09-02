import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button';

const meta: Meta = {
  title: 'LYD Components/Button',
  component: 'lyd-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: { type: 'boolean' }
    },
    loading: {
      control: { type: 'boolean' }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => html`
    <lyd-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Schedule Viewing
    </lyd-button>
  `
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px;">
      <lyd-button variant="primary">Primary Button</lyd-button>
      <lyd-button variant="secondary">Secondary Button</lyd-button>
      <lyd-button variant="outline">Outline Button</lyd-button>
    </div>
  `
};

export const RealEstateActions: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px; max-width: 300px;">
      <lyd-button variant="primary" size="large">
        🏠 Schedule Property Viewing
      </lyd-button>
      <lyd-button variant="secondary">
        ❤️ Add to Favorites
      </lyd-button>
      <lyd-button variant="outline">
        📄 Download Exposé
      </lyd-button>
      <lyd-button variant="outline" loading>
        Processing...
      </lyd-button>
    </div>
  `
};

