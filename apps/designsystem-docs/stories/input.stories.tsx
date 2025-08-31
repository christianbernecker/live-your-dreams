import type { Meta, StoryObj } from '@storybook/react';
import { LdsInput } from '@liveyourdreams/design-system-react';

const meta: Meta<typeof LdsInput> = {
  title: 'Components/Input',
  component: LdsInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'E-Mail-Adresse',
    placeholder: 'ihre.email@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'E-Mail-Adresse',
    placeholder: 'ihre.email@example.com',
    error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    value: 'invalid-email',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Passwort',
    type: 'password',
    hint: 'Mindestens 8 Zeichen, ein Großbuchstabe und eine Zahl',
  },
};

export const Required: Story = {
  args: {
    label: 'Objekttitel',
    placeholder: 'z.B. Moderne 3-Zimmer-Wohnung in Schwabing',
    required: true,
  },
};
