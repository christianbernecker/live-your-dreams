// LYD Design System - Luxury Button Component
// Ultra-moderne Buttons mit Glassmorphism, Micro-Animationen und Premium-Effekten

import { LYD_LUXURY_ICONS } from '../icons/luxury-icon-library.js';

export class LydLuxuryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._rippleTimeout = null;
  }

  static get observedAttributes() {
    return [
      'variant',       // primary|secondary|outline|ghost|luxury|glass
      'size',          // small|medium|large|xl
      'icon',          // icon name from LYD_LUXURY_ICONS
      'icon-position', // left|right
      'loading',       // boolean attribute
      'disabled',      // boolean attribute
      'full-width',    // boolean attribute
      'animate'        // boolean attribute for micro-animations
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    if (this._rippleTimeout) {
      clearTimeout(this._rippleTimeout);
    }
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector('.luxury-button');
    if (button) {
      button.addEventListener('click', (e) => this.handleClick(e));
      button.addEventListener('mousedown', (e) => this.createRipple(e));
    }
  }

  handleClick(event) {
    if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
      event.preventDefault();
      return;
    }

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('lyd-click', {
      detail: {
        variant: this.getAttribute('variant'),
        icon: this.getAttribute('icon')
      },
      bubbles: true
    }));
  }

  createRipple(event) {
    if (this.hasAttribute('disabled') || this.hasAttribute('loading')) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    `;

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    this._rippleTimeout = setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const icon = this.getAttribute('icon');
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const isLoading = this.hasAttribute('loading');
    const isDisabled = this.hasAttribute('disabled');
    const isFullWidth = this.hasAttribute('full-width');
    const hasAnimation = this.hasAttribute('animate');

    const iconSvg = icon ? LYD_LUXURY_ICONS[icon] : null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${isFullWidth ? 'block' : 'inline-block'};
          width: ${isFullWidth ? '100%' : 'auto'};
        }

        .luxury-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          outline: none;
          width: ${isFullWidth ? '100%' : 'auto'};
          backdrop-filter: blur(10px);
          
          /* Size variants */
          ${size === 'small' ? `
            padding: 8px 16px;
            font-size: 13px;
            min-height: 36px;
          ` : size === 'large' ? `
            padding: 16px 32px;
            font-size: 16px;
            min-height: 52px;
          ` : size === 'xl' ? `
            padding: 20px 40px;
            font-size: 18px;
            min-height: 60px;
            border-radius: 16px;
          ` : `
            padding: 12px 24px;
            font-size: 14px;
            min-height: 44px;
          `}
          
          /* Variant styles */
          ${variant === 'primary' ? `
            background: linear-gradient(135deg, #3366CC 0%, #0066ff 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(51, 102, 204, 0.3);
          ` : variant === 'secondary' ? `
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
          ` : variant === 'outline' ? `
            background: rgba(255, 255, 255, 0.8);
            color: #3366CC;
            border: 1.5px solid #3366CC;
            backdrop-filter: blur(20px);
          ` : variant === 'ghost' ? `
            background: rgba(255, 255, 255, 0.1);
            color: #374151;
            backdrop-filter: blur(10px);
          ` : variant === 'luxury' ? `
            background: linear-gradient(135deg, #000066 0%, #1a1a2e 50%, #16213e 100%);
            color: #ffffff;
            box-shadow: 0 8px 32px rgba(0, 0, 102, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ` : variant === 'glass' ? `
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(20px);
            color: #1f2937;
            box-shadow: 0 8px 32px rgba(31, 41, 55, 0.12);
          ` : `
            background: linear-gradient(135deg, #3366CC 0%, #0066ff 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(51, 102, 204, 0.3);
          `}
        }

        .luxury-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          ${variant === 'primary' ? `
            box-shadow: 0 8px 25px rgba(51, 102, 204, 0.4);
            background: linear-gradient(135deg, #2952A3 0%, #0052cc 100%);
          ` : variant === 'secondary' ? `
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          ` : variant === 'outline' ? `
            background: rgba(51, 102, 204, 0.05);
            border-color: #2952A3;
            box-shadow: 0 8px 25px rgba(51, 102, 204, 0.15);
          ` : variant === 'ghost' ? `
            background: rgba(255, 255, 255, 0.2);
            color: #3366CC;
          ` : variant === 'luxury' ? `
            box-shadow: 0 12px 40px rgba(0, 0, 102, 0.5);
            background: linear-gradient(135deg, #000052 0%, #0f0f23 50%, #0d1526 100%);
          ` : variant === 'glass' ? `
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 12px 40px rgba(31, 41, 55, 0.15);
          ` : ''}
        }

        .luxury-button:active:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
        }

        .luxury-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .luxury-button:focus-visible {
          outline: 2px solid #3366CC;
          outline-offset: 2px;
        }

        .icon {
          width: ${size === 'small' ? '16px' : size === 'large' ? '20px' : size === 'xl' ? '24px' : '18px'};
          height: ${size === 'small' ? '16px' : size === 'large' ? '20px' : size === 'xl' ? '24px' : '18px'};
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ${hasAnimation ? `
        .luxury-button:hover .icon {
          transform: scale(1.1) ${icon === 'arrow-right' ? 'translateX(2px)' : icon === 'arrow-left' ? 'translateX(-2px)' : ''};
        }
        ` : ''}

        .loading-spinner {
          width: ${size === 'small' ? '16px' : size === 'large' ? '20px' : size === 'xl' ? '24px' : '18px'};
          height: ${size === 'small' ? '16px' : size === 'large' ? '20px' : size === 'xl' ? '24px' : '18px'};
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: luxury-spin 1s linear infinite;
        }

        @keyframes luxury-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes ripple-animation {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        /* Luxury glow effect */
        ${variant === 'luxury' ? `
        .luxury-button::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #3366CC, #6366f1, #3366CC);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .luxury-button:hover::before {
          opacity: 0.7;
          animation: luxury-glow 2s ease-in-out infinite;
        }
        
        @keyframes luxury-glow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        ` : ''}
      </style>
      
      <button class="luxury-button" ${isDisabled ? 'disabled' : ''}>
        ${isLoading ? `
          <div class="loading-spinner"></div>
        ` : `
          ${iconSvg && iconPosition === 'left' ? `<div class="icon">${iconSvg}</div>` : ''}
          <slot></slot>
          ${iconSvg && iconPosition === 'right' ? `<div class="icon">${iconSvg}</div>` : ''}
        `}
      </button>
    `;
  }
}

customElements.define('lyd-luxury-button', LydLuxuryButton);
