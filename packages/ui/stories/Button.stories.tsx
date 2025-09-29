import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../src/components/button/Button';

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Button Component

The Button component is the core interactive element of the Live Your Dreams Design System.
It provides consistent styling, behavior, and accessibility across all applications.

## Design System Integration

This component uses the following CSS classes from the Design System:
- \`.lyd-button\` - Base button styles
- \`.primary\`, \`.secondary\`, \`.ghost\`, etc. - Variant styles
- Size modifiers and state styles

## Usage Guidelines

- Use \`primary\` variant for main actions
- Use \`secondary\` for alternative actions  
- Use \`ghost\` for subtle actions
- Always provide meaningful button text or aria-label for icon-only buttons
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'glass'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select', 
      options: ['small', 'default', 'large', 'icon-only'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes button take full width of container',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
  },
  args: { 
    onClick: fn(),
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline', 
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'Glass Button',
  },
};

// Size variations
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon-only',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14m7-7H5"/>
      </svg>
    ),
    children: undefined,
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14m7-7H5"/>
      </svg>
    ),
    children: 'Add Item',
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Design System showcase - all variants together
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="glass">Glass</Button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

