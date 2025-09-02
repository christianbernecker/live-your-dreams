import '../src/lyd-button.js';

export default {
  title: 'LYD Components/Button',
  component: 'lyd-button',
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

export const Primary = {
  args: {
    variant: 'primary'
  },
  render: (args) => {
    return `
      <lyd-button 
        variant="${args.variant}" 
        size="${args.size}"
        ${args.disabled ? 'disabled' : ''}
        ${args.loading ? 'loading' : ''}
      >
        Schedule Viewing
      </lyd-button>
    `;
  }
};

export const AllVariants = () => `
  <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 20px; background: #f8fafc;">
    <lyd-button variant="primary">Primary Button</lyd-button>
    <lyd-button variant="secondary">Secondary Button</lyd-button>
    <lyd-button variant="outline">Outline Button</lyd-button>
  </div>
`;

export const AllSizes = () => `
  <div style="display: flex; gap: 16px; align-items: center; padding: 20px;">
    <lyd-button variant="primary" size="small">Small</lyd-button>
    <lyd-button variant="primary" size="medium">Medium</lyd-button>
    <lyd-button variant="primary" size="large">Large</lyd-button>
  </div>
`;

export const RealEstateActions = () => `
  <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px; max-width: 300px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h3 style="margin: 0 0 16px 0; color: #0066ff; font-family: Inter, sans-serif;">Property Actions</h3>
    
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
    
    <lyd-button variant="secondary" disabled>
      Unavailable
    </lyd-button>
  </div>
`;

export const Interactive = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false
  },
  render: (args) => {
    return `
      <div style="padding: 20px;">
        <lyd-button 
          variant="${args.variant}" 
          size="${args.size}"
          ${args.disabled ? 'disabled' : ''}
          ${args.loading ? 'loading' : ''}
        >
          Interactive Button
        </lyd-button>
      </div>
    `;
  }
};
