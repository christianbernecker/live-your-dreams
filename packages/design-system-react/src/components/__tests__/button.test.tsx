import { render, screen } from '@testing-library/react';
import { LdsButton } from '../button';

describe('LdsButton', () => {
  it('renders with default props', () => {
    render(<LdsButton>Click me</LdsButton>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });
  
  it('renders with primary variant', () => {
    render(<LdsButton variant="primary">Primary</LdsButton>);
    
    const button = screen.getByRole('button', { name: 'Primary' });
    expect(button).toHaveClass('bg-brand', 'text-white');
  });
  
  it('renders with secondary variant', () => {
    render(<LdsButton variant="secondary">Secondary</LdsButton>);
    
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-gray-100', 'text-gray-900');
  });
  
  it('renders with different sizes', () => {
    render(
      <>
        <LdsButton size="sm">Small</LdsButton>
        <LdsButton size="md">Medium</LdsButton>
        <LdsButton size="lg">Large</LdsButton>
      </>
    );
    
    expect(screen.getByRole('button', { name: 'Small' })).toHaveClass('px-3', 'py-1.5', 'text-sm');
    expect(screen.getByRole('button', { name: 'Medium' })).toHaveClass('px-4', 'py-2', 'text-sm');
    expect(screen.getByRole('button', { name: 'Large' })).toHaveClass('px-6', 'py-3', 'text-base');
  });
  
  it('handles disabled state', () => {
    render(<LdsButton disabled>Disabled</LdsButton>);
    
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });
});
