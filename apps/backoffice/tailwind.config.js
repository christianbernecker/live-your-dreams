/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 
          DEFAULT: 'var(--lds-color-primary)', 
          deep: 'var(--lds-color-secondary)' 
        },
        success: 'var(--lds-color-success)', 
        warning: 'var(--lds-color-warning)', 
        error: 'var(--lds-color-error)', 
        info: 'var(--lds-color-info)'
      },
      borderRadius: { 
        sm: 'var(--lds-radius-sm)', 
        md: 'var(--lds-radius-md)', 
        lg: 'var(--lds-radius-lg)' 
      },
      boxShadow: { 
        sm: 'var(--lds-shadow-sm)', 
        md: 'var(--lds-shadow-md)', 
        lg: 'var(--lds-shadow-lg)' 
      }
    }
  },
  plugins: []
};
