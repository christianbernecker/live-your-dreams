// Live Your Dreams Button Pro - Porsche-Quality Component
// Advanced Web Component with Configurator Interface

class LydButtonPro extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.ripples = [];
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'icon', 'icon-position', 'theme'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setupRippleEffect();
  }

  attributeChangedCallback() {
    this.render();
  }

  setupEventListeners() {
    this.addEventListener('click', this.handleClick.bind(this));
    this.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  setupRippleEffect() {
    this.addEventListener('mousedown', (e) => {
      if (this.hasAttribute('disabled') || this.hasAttribute('loading')) return;
      
      const button = this.shadowRoot.querySelector('.button');
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (x - 10) + 'px';
      ripple.style.top = (y - 10) + 'px';
      
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  }

  handleClick(event) {
    if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
      event.preventDefault();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('lyd-click', {
      bubbles: true,
      composed: true,
      detail: { 
        variant: this.getAttribute('variant'),
        size: this.getAttribute('size'),
        timestamp: Date.now()
      }
    }));
  }

  handleMouseEnter() {
    if (!this.hasAttribute('disabled')) {
      this.shadowRoot.querySelector('.button').classList.add('button--hover');
    }
  }

  handleMouseLeave() {
    this.shadowRoot.querySelector('.button')?.classList.remove('button--hover');
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const theme = this.getAttribute('theme') || 'light';
    const icon = this.getAttribute('icon') || '';
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');

    this.shadowRoot.innerHTML = `
      <style>
        @import url('/src/styles/lyd-typography.css');
        
        :host {
          display: inline-block;
          font-family: var(--lyd-font-family-brand);
          --button-primary: #0066ff;
          --button-primary-hover: #0052cc;
          --button-primary-active: #004299;
          --button-secondary: #f8fafc;
          --button-secondary-hover: #f1f5f9;
          --button-outline: transparent;
          --button-outline-border: #0066ff;
          --button-ghost: transparent;
          --button-text-primary: #ffffff;
          --button-text-secondary: #1f2937;
          --button-text-outline: #0066ff;
          --button-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          --button-shadow-hover: 0 4px 12px rgba(0, 102, 255, 0.25);
          --button-shadow-active: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .button {
          /* Reset */
          all: unset;
          
          /* Layout */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          
          /* Typography */
          font-family: inherit;
          font-weight: var(--lyd-font-weight-semibold);
          text-decoration: none;
          white-space: nowrap;
          user-select: none;
          
          /* Styling */
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          
          /* Animations */
          transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateZ(0);
          will-change: transform, box-shadow, background-color;
        }
        
        /* Sizes - Enhanced Touch Targets */
        .button--small {
          height: 32px;
          padding: 0 16px;
          font-size: var(--lyd-font-size-sm);
          border-radius: 6px;
        }
        
        .button--medium {
          height: 44px;
          padding: 0 24px;
          font-size: var(--lyd-font-size-base);
          border-radius: 8px;
        }
        
        .button--large {
          height: 56px;
          padding: 0 32px;
          font-size: var(--lyd-font-size-lg);
          border-radius: 12px;
          font-weight: var(--lyd-font-weight-bold);
        }
        
        /* Variants - Porsche-inspired */
        .button--primary {
          background: linear-gradient(135deg, var(--button-primary) 0%, var(--button-primary-active) 100%);
          color: var(--button-text-primary);
          box-shadow: var(--button-shadow);
        }
        
        .button--primary:hover:not(.button--disabled):not(.button--loading) {
          background: linear-gradient(135deg, var(--button-primary-hover) 0%, var(--button-primary) 100%);
          box-shadow: var(--button-shadow-hover);
          transform: translateY(-1px) scale(1.02);
        }
        
        .button--primary:active:not(.button--disabled):not(.button--loading) {
          background: linear-gradient(135deg, var(--button-primary-active) 0%, var(--button-primary-hover) 100%);
          box-shadow: var(--button-shadow-active);
          transform: translateY(0) scale(0.98);
        }
        
        .button--secondary {
          background: var(--button-secondary);
          color: var(--button-text-secondary);
          border-color: #e5e7eb;
          box-shadow: var(--button-shadow);
        }
        
        .button--secondary:hover:not(.button--disabled):not(.button--loading) {
          background: var(--button-secondary-hover);
          border-color: #d1d5db;
          box-shadow: var(--button-shadow-hover);
          transform: translateY(-1px);
        }
        
        .button--outline {
          background: var(--button-outline);
          color: var(--button-text-outline);
          border-color: var(--button-outline-border);
          border-width: 2px;
          box-shadow: inset 0 0 0 0 var(--button-outline-border);
          transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .button--outline:hover:not(.button--disabled):not(.button--loading) {
          color: var(--button-text-primary);
          box-shadow: inset 200px 0 0 0 var(--button-outline-border);
          transform: scale(1.02);
        }
        
        .button--ghost {
          background: var(--button-ghost);
          color: var(--button-text-outline);
          border-color: transparent;
        }
        
        .button--ghost:hover:not(.button--disabled):not(.button--loading) {
          background: rgba(0, 102, 255, 0.1);
          transform: translateY(-1px);
        }
        
        /* States */
        .button--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
          transform: none !important;
          box-shadow: none !important;
        }
        
        .button--loading {
          cursor: wait;
          color: transparent;
        }
        
        .button--loading::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid currentColor;
          border-radius: 50%;
          border-right-color: transparent;
          animation: spin 0.75s linear infinite;
        }
        
        /* Focus - Enhanced Accessibility */
        .button:focus-visible {
          outline: 2px solid var(--button-outline-border);
          outline-offset: 2px;
          box-shadow: var(--button-shadow-hover), 0 0 0 4px rgba(0, 102, 255, 0.2);
        }
        
        /* Ripple Effect */
        .ripple {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Icon Support */
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .button--small .icon {
          width: 16px;
          height: 16px;
        }
        
        .button--large .icon {
          width: 24px;
          height: 24px;
        }
        
        /* Hover Enhancement */
        .button--hover {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
        
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        
        /* Theme Support */
        :host([theme="dark"]) {
          --button-primary: #0066ff;
          --button-secondary: #374151;
          --button-text-secondary: #f9fafb;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 640px) {
          .button {
            min-height: 44px;
          }
          
          .button--small {
            min-height: 40px;
          }
          
          .button--large {
            min-height: 48px;
          }
        }
        
        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .button {
            border-width: 2px;
          }
          
          .button--outline {
            border-width: 3px;
          }
        }
        
        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .button,
          .button::after,
          .ripple {
            animation: none;
            transition: none;
          }
          
          .button:hover {
            transform: none;
          }
        }
      </style>
      
      <button 
        class="button button--${variant} button--${size}"
        ${disabled ? 'disabled' : ''}
        ${loading ? 'aria-busy="true"' : ''}
        aria-disabled="${disabled}"
        type="button"
      >
        ${icon && iconPosition === 'left' ? `<span class="icon">${this.getIcon(icon)}</span>` : ''}
        <span class="button-text">
          <slot></slot>
        </span>
        ${icon && iconPosition === 'right' ? `<span class="icon">${this.getIcon(icon)}</span>` : ''}
      </button>
    `;
  }

  getIcon(iconName) {
    const icons = {
      home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
      heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
      download: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`
    };
    
    return icons[iconName] || '';
  }
}

customElements.define('lyd-button-pro', LydButtonPro);

export { LydButtonPro };
