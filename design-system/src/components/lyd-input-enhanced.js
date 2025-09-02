// Live Your Dreams Enhanced Input Component
// Professional inputs with icons, formatting, and real estate optimizations

class LydInputEnhanced extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'label', 'placeholder', 'disabled', 'required', 'error', 'helper', 'icon', 'suffix'];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const disabled = this.hasAttribute('disabled');
    const required = this.hasAttribute('required');
    const error = this.getAttribute('error') || '';
    const helper = this.getAttribute('helper') || '';
    const icon = this.getAttribute('icon') || '';
    const suffix = this.getAttribute('suffix') || '';

    const iconSVG = this.getIconSVG(variant, icon);
    const hasIcon = iconSVG || variant === 'search';
    const hasSuffix = suffix || variant === 'currency' || variant === 'area';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .input-container {
          position: relative;
          width: 100%;
        }
        
        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .input-label--required::after {
          content: ' *';
          color: #ef4444;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-field {
          width: 100%;
          padding: 12px 16px;
          ${hasIcon ? 'padding-left: 44px;' : ''}
          ${hasSuffix ? 'padding-right: 44px;' : ''}
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-family: inherit;
          font-size: 16px;
          background: white;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #0066ff;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }
        
        .input-field:hover:not(:disabled) {
          border-color: #cbd5e1;
        }
        
        .input-field:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .input-field--error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        /* Variant Styles */
        .input-field--search {
          background: rgba(248, 250, 252, 0.95);
          backdrop-filter: blur(8px);
        }
        
        .input-field--currency {
          text-align: right;
          font-weight: 600;
          color: #0066ff;
        }
        
        .input-field--area {
          text-align: right;
          font-weight: 600;
          color: #22c55e;
        }
        
        /* Icon Styling */
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #6b7280;
          pointer-events: none;
        }
        
        /* Suffix Styling */
        .input-suffix {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 500;
          font-size: 14px;
          pointer-events: none;
        }
        
        .input-prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 500;
          font-size: 16px;
          pointer-events: none;
        }
        
        /* Helper and Error Text */
        .input-helper {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        .input-error {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
        }
        
        /* Real Estate Specific */
        .input-field--property {
          border-left: 4px solid #0066ff;
        }
        
        .input-field--location {
          border-left: 4px solid #22c55e;
        }
        
        .input-field--price {
          border-left: 4px solid #f59e0b;
        }
      </style>
      
      <div class="input-container">
        ${label ? `
          <label class="input-label ${required ? 'input-label--required' : ''}">${label}</label>
        ` : ''}
        
        <div class="input-wrapper">
          ${hasIcon && !suffix ? `<div class="input-icon">${iconSVG}</div>` : ''}
          ${variant === 'currency' ? `<div class="input-prefix">€</div>` : ''}
          
          <input 
            type="text"
            class="input-field input-field--${variant} ${error ? 'input-field--error' : ''}"
            placeholder="${placeholder}"
            ${disabled ? 'disabled' : ''}
            ${required ? 'required' : ''}
          />
          
          ${variant === 'area' ? `<div class="input-suffix">m²</div>` : ''}
          ${suffix ? `<div class="input-suffix">${suffix}</div>` : ''}
        </div>
        
        ${error ? `<div class="input-error">${error}</div>` : ''}
        ${helper && !error ? `<div class="input-helper">${helper}</div>` : ''}
      </div>
    `;
  }

  getIconSVG(variant, customIcon) {
    if (customIcon) {
      return this.getCustomIcon(customIcon);
    }
    
    const variantIcons = {
      'search': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>`,
      'currency': '',
      'area': '',
      'default': ''
    };
    
    return variantIcons[variant] || '';
  }

  getCustomIcon(iconName) {
    const icons = {
      'home': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>`,
      'search': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>`,
      'mail': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>`
    };
    
    return icons[iconName] || '';
  }

  addEventListeners() {
    const input = this.shadowRoot.querySelector('.input-field');
    
    input.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('lyd-input-change', {
        detail: { 
          value: e.target.value,
          variant: this.getAttribute('variant')
        },
        bubbles: true
      }));
    });
    
    input.addEventListener('focus', () => {
      this.dispatchEvent(new CustomEvent('lyd-input-focus', {
        bubbles: true
      }));
    });
    
    input.addEventListener('blur', () => {
      this.dispatchEvent(new CustomEvent('lyd-input-blur', {
        bubbles: true
      }));
    });
  }

  // Public API
  get value() {
    return this.shadowRoot.querySelector('.input-field').value;
  }

  set value(val) {
    this.shadowRoot.querySelector('.input-field').value = val;
  }

  focus() {
    this.shadowRoot.querySelector('.input-field').focus();
  }
}

customElements.define('lyd-input-enhanced', LydInputEnhanced);

export default LydInputEnhanced;
