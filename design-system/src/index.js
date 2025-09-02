// Live Your Dreams Design System
// Main entry point for all Web Components

// Import and register all components
import './components/lyd-button.js';
import './components/lyd-input.js';
import './components/lyd-card.js';
import './components/lyd-grid.js';
import './components/lyd-accordion.js';
import './components/lyd-select.js';
import './components/lyd-modal.js';

// Components are automatically registered via customElements.define()
// No need for re-exports since Web Components are global

// Auto-register all components when imported
console.log('🎯 LYD Design System loaded - Professional Web Components for Real Estate');

// Version info
export const version = '1.0.0';
export const name = 'LYD Design System';

// Component registry for debugging
export const components = {
  'lyd-button': 'Professional button component with variants and loading states',
  'lyd-input': 'Advanced input component with real estate specific variants',
  'lyd-card': 'Flexible card component with glassmorphism effects',
  'lyd-grid': 'Professional grid system inspired by automotive design',
  'lyd-accordion': 'Expandable accordion component with smooth animations',
  'lyd-select': 'Dropdown selection with search and multi-select capabilities',
  'lyd-modal': 'Modal dialog component with overlay and accessibility features'
};

// Utility function for Next.js integration
export const loadLYDComponents = () => {
  if (typeof window !== 'undefined') {
    // Browser environment - components are already registered
    return Promise.resolve();
  }
  // Server environment - no-op
  return Promise.resolve();
};
