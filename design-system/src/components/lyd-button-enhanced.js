// Live Your Dreams Enhanced Button Component
// Professional button with icons, improved styling, and real estate optimizations

class LydButtonEnhanced extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'size', 'loading', 'disabled', 'icon', 'icon-position', 'full-width'];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const loading = this.hasAttribute('loading');
    const disabled = this.hasAttribute('disabled');
    const icon = this.getAttribute('icon') || '';
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const fullWidth = this.hasAttribute('full-width');

    const iconSVG = this.getIconSVG(icon);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${fullWidth ? 'block' : 'inline-block'};
          width: ${fullWidth ? '100%' : 'auto'};
        }
        
        .lyd-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 12px;
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          position: relative;
          overflow: hidden;
          width: ${fullWidth ? '100%' : 'auto'};
        }
        
        .lyd-button:focus {
          outline: 2px solid #0066ff;
          outline-offset: 2px;
        }
        
        /* Sizes */
        .lyd-button--small {
          padding: 8px 16px;
          font-size: 14px;
          min-height: 36px;
        }
        
        .lyd-button--medium {
          padding: 12px 24px;
          font-size: 16px;
          min-height: 44px;
        }
        
        .lyd-button--large {
          padding: 16px 32px;
          font-size: 18px;
          min-height: 52px;
          border-radius: 16px;
        }
        
        /* Primary Variant - Like Screenshot */
        .lyd-button--primary {
          background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
          color: white;
          box-shadow: 
            0 4px 12px rgba(0, 102, 255, 0.3),
            0 2px 4px rgba(0, 102, 255, 0.2);
        }
        
        .lyd-button--primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 20px rgba(0, 102, 255, 0.4),
            0 4px 8px rgba(0, 102, 255, 0.3);
          background: linear-gradient(135deg, #0052cc 0%, #003d99 100%);
        }
        
        .lyd-button--primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);
        }
        
        /* Secondary Variant - Like Screenshot */
        .lyd-button--secondary {
          background: rgba(248, 250, 252, 0.95);
          color: #0066ff;
          border: 1px solid #e2e8f0;
          backdrop-filter: blur(8px);
        }
        
        .lyd-button--secondary:hover:not(:disabled) {
          background: rgba(241, 245, 249, 0.95);
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.1);
        }
        
        /* Outline Variant - Like Screenshot */
        .lyd-button--outline {
          background: transparent;
          color: #0066ff;
          border: 2px solid #0066ff;
          backdrop-filter: blur(8px);
        }
        
        .lyd-button--outline:hover:not(:disabled) {
          background: #0066ff;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }
        
        /* Ghost Variant */
        .lyd-button--ghost {
          background: transparent;
          color: #6b7280;
          border: none;
        }
        
        .lyd-button--ghost:hover:not(:disabled) {
          background: rgba(107, 114, 128, 0.1);
          color: #374151;
        }
        
        /* Disabled State */
        .lyd-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        
        /* Loading State */
        .lyd-button--loading {
          pointer-events: none;
        }
        
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Icon Styling */
        .button-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .lyd-button--small .button-icon {
          width: 16px;
          height: 16px;
        }
        
        .lyd-button--large .button-icon {
          width: 24px;
          height: 24px;
        }
        
        /* Icon Positions */
        .icon-right {
          order: 1;
        }
        
        /* Real Estate Specific Styling */
        .lyd-button--property {
          background: linear-gradient(135deg, #0066ff 0%, #004299 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }
        
        .lyd-button--contact {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }
        
        .lyd-button--warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        /* Micro-interactions */
        .lyd-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        
        .lyd-button:hover::before {
          transform: translateX(100%);
        }
        
        /* Download Animation - Links nach Rechts */
        .lyd-button--download {
          position: relative;
          overflow: hidden;
        }
        
        .lyd-button--download::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            transparent 100%);
          transition: left 2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .lyd-button--download:hover::after {
          left: 100%;
        }
        
        .lyd-button--download.downloading::after {
          left: 100%;
          transition: left 3s linear;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(34, 197, 94, 0.3) 50%, 
            transparent 100%);
        }
        
        /* Progress Bar für Download */
        .download-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: #22c55e;
          width: 0%;
          transition: width 3s linear;
          border-radius: 0 0 12px 12px;
        }
        
        .lyd-button--download.downloading .download-progress {
          width: 100%;
        }
      </style>
      
      <button 
        class="lyd-button lyd-button--${variant} lyd-button--${size} ${loading ? 'lyd-button--loading' : ''}"
        ${disabled ? 'disabled' : ''}
        ${fullWidth ? 'style="width: 100%;"' : ''}
      >
        ${loading ? '<div class="loading-spinner"></div>' : ''}
        ${icon && iconPosition === 'left' ? `<div class="button-icon">${iconSVG}</div>` : ''}
        <span class="button-text"><slot></slot></span>
        ${icon && iconPosition === 'right' ? `<div class="button-icon icon-right">${iconSVG}</div>` : ''}
        ${variant === 'download' ? '<div class="download-progress"></div>' : ''}
      </button>
    `;
  }

  getIconSVG(iconName) {
    const icons = {
      'home': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>`,
      'heart': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>`,
      'download': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>`,
      'search': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>`,
      'phone': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>`,
      'mail': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>`,
      'calendar': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>`,
      'eye': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>`
    };
    
    return icons[iconName] || '';
  }

  addEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', (e) => {
      if (!this.hasAttribute('loading') && !this.hasAttribute('disabled')) {
        
        // Special handling for download buttons
        if (this.getAttribute('variant') === 'download') {
          this.startDownload();
        }
        
        this.dispatchEvent(new CustomEvent('lyd-click', {
          detail: { 
            variant: this.getAttribute('variant'),
            icon: this.getAttribute('icon')
          },
          bubbles: true
        }));
      }
    });
  }

  startDownload() {
    const button = this.shadowRoot.querySelector('button');
    const originalText = this.textContent;
    
    // Add downloading class for animation
    button.classList.add('downloading');
    
    // Change button text
    this.innerHTML = 'Downloading...';
    
    // Simulate download progress
    setTimeout(() => {
      this.innerHTML = 'Download Complete!';
      button.classList.remove('downloading');
      
      // Reset after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
      }, 2000);
    }, 3000);
  }
}

customElements.define('lyd-button-enhanced', LydButtonEnhanced);

export default LydButtonEnhanced;
