import type { Meta, StoryObj } from '@storybook/react';
import { Badge, RoleBadge, StatusBadge } from '../src/components/badge/Badge';

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Badge Component

Compact status and label component using Design System \`.luxury-badge\` class.

## Design System Integration

- Uses \`.luxury-badge\` from the Design System
- Supports all Design System color variants
- Includes size variants and interactive states
- Consistent with other UI components

## Usage Guidelines

- Use for status indicators, labels, and tags
- Choose appropriate color variants for semantic meaning
- Keep text concise and scannable
- Use removable badges for filters and tags
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    removable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'secondary',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'With Icon',
    variant: 'primary',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20m10-10H2"/>
      </svg>
    ),
  },
};

export const Removable: Story = {
  args: {
    children: 'Removable',
    variant: 'secondary',
    removable: true,
    onRemove: () => console.log('Badge removed'),
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="xs">XS Badge</Badge>
      <Badge size="sm">SM Badge</Badge>
      <Badge size="md">MD Badge</Badge>
      <Badge size="lg">LG Badge</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusBadge status="active">Active User</StatusBadge>
      <StatusBadge status="inactive">Inactive User</StatusBadge>
      <StatusBadge status="pending">Pending Approval</StatusBadge>
      <StatusBadge status="error">Error State</StatusBadge>
    </div>
  ),
};

export const RoleBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <RoleBadge>Administrator</RoleBadge>
      <RoleBadge>Editor</RoleBadge>
      <RoleBadge>Author</RoleBadge>
      <RoleBadge>Viewer</RoleBadge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

