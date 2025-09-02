// Live Your Dreams Button Component
// Automotive-grade Web Component

class LydButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading'];
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this.handleClick.bind(this));
  }

  attributeChangedCallback() {
    this.render();
  }

  handleClick(event) {
    if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
      event.preventDefault();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('lyd-click', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
        }
        
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        
        /* Variants */
        .button--primary {
          background: #0066ff;
          color: white;
        }
        
        .button--primary:hover:not(:disabled) {
          background: #0052cc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }
        
        .button--secondary {
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }
        
        .button--secondary:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        
        .button--outline {
          background: transparent;
          color: #0066ff;
          border: 2px solid #0066ff;
        }
        
        .button--outline:hover:not(:disabled) {
          background: #0066ff;
          color: white;
        }
        
        /* Sizes */
        .button--small {
          padding: 8px 16px;
          font-size: 14px;
          height: 32px;
        }
        
        .button--medium {
          padding: 12px 24px;
          font-size: 16px;
          height: 40px;
        }
        
        .button--large {
          padding: 16px 32px;
          font-size: 18px;
          height: 48px;
        }
        
        /* States */
        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .button--loading::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-radius: 50%;
          border-right-color: transparent;
          animation: spin 0.75s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Mobile */
        @media (max-width: 640px) {
          .button {
            min-height: 44px;
          }
        }
      </style>
      
      <button 
        class="button button--${variant} button--${size} ${loading ? 'button--loading' : ''}"
        ${disabled || loading ? 'disabled' : ''}
      >
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('lyd-button', LydButton);

export { LydButton };
