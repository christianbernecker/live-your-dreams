// Live Your Dreams Input Component
// Automotive-grade Input for Real Estate

class LydInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['label', 'placeholder', 'type', 'disabled', 'required', 'variant'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector('input');
    if (input) {
      input.addEventListener('input', (e) => {
        this.dispatchEvent(new CustomEvent('lyd-input', {
          bubbles: true,
          composed: true,
          detail: { value: e.target.value }
        }));
      });

      input.addEventListener('focus', () => {
        this.dispatchEvent(new CustomEvent('lyd-focus', {
          bubbles: true,
          composed: true
        }));
      });

      input.addEventListener('blur', () => {
        this.dispatchEvent(new CustomEvent('lyd-blur', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  render() {
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const type = this.getAttribute('type') || 'text';
    const variant = this.getAttribute('variant') || 'default';
    const disabled = this.hasAttribute('disabled');
    const required = this.hasAttribute('required');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
        }
        
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        
        .label--required::after {
          content: ' *';
          color: #dc2626;
        }
        
        .input-container {
          position: relative;
        }
        
        .input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          background: white;
          color: #1f2937;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        
        .input:focus {
          outline: none;
          border-color: #0066ff;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }
        
        .input:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        /* Variants */
        .input--search {
          padding-left: 44px;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>');
          background-repeat: no-repeat;
          background-position: 12px center;
        }
        
        .input--currency::after {
          content: '€';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 600;
        }
        
        .input--area::after {
          content: 'm²';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 14px;
        }
        
        .input--error {
          border-color: #dc2626;
        }
        
        .input--error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        
        /* Mobile */
        @media (max-width: 640px) {
          .input {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
      </style>
      
      <div class="field">
        ${label ? `<label class="label ${required ? 'label--required' : ''}">${label}</label>` : ''}
        <div class="input-container">
          <input 
            class="input input--${variant}"
            type="${type}"
            placeholder="${placeholder}"
            ${disabled ? 'disabled' : ''}
            ${required ? 'required' : ''}
          />
        </div>
      </div>
    `;

    this.setupEventListeners();
  }
}

customElements.define('lyd-input', LydInput);

export { LydInput };
