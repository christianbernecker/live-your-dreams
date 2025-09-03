// LYD Design System - Main Button Component
import { LYD_ICONS } from '../icons/icon-library.js';

export class LydButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._rippleTimeout = null;
  }

  static get observedAttributes() {
    return [
      'variant',       // primary|secondary|outline|ghost|danger|success
      'size',          // small|medium|large
      'icon',          // icon name from LYD_ICONS
      'icon-position', // left|right
      'loading',       // boolean attribute
      'disabled',      // boolean attribute
      'full-width',    // boolean attribute
      'rounded'        // boolean attribute for pill shape
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
    const button = this.shadowRoot.querySelector('.lyd-button');
    if (button) {
      button.addEventListener('click', (e) => this.handleClick(e));
    }
  }

  handleClick(event) {
    if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Create ripple effect
    this.createRipple(event);

    // Emit custom event
    this.dispatchEvent(new CustomEvent('lyd-click', {
      detail: {
        variant: this.getAttribute('variant'),
        icon: this.getAttribute('icon')
      },
      bubbles: true
    }));
  }

  createRipple(event) {
    const button = this.shadowRoot.querySelector('.lyd-button');
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    this._rippleTimeout = setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  getIconHtml(iconName) {
    const icon = LYD_ICONS[iconName];
    return icon ? icon : '';
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const icon = this.getAttribute('icon');
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const loading = this.hasAttribute('loading');
    const disabled = this.hasAttribute('disabled');
    const fullWidth = this.hasAttribute('full-width');
    const rounded = this.hasAttribute('rounded');

    const classes = [
      'lyd-button',
      `lyd-button--${variant}`,
      `lyd-button--${size}`,
      loading ? 'lyd-button--loading' : '',
      disabled ? 'lyd-button--disabled' : '',
      fullWidth ? 'lyd-button--full-width' : '',
      rounded ? 'lyd-button--rounded' : ''
    ].filter(Boolean).join(' ');

    const iconHtml = icon ? `<span class="icon-wrapper icon-${iconPosition}">${this.getIconHtml(icon)}</span>` : '';
    const loadingSpinner = loading ? '<span class="loading-spinner"></span>' : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${fullWidth ? 'block' : 'inline-block'};
        }

        .lyd-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border: 2px solid transparent;
          border-radius: 8px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          user-select: none;
          white-space: nowrap;
          width: ${fullWidth ? '100%' : 'auto'};
          box-sizing: border-box;
        }

        .lyd-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.2);
        }

        /* Sizes */
        .lyd-button--small {
          padding: 8px 16px;
          font-size: 14px;
          gap: 6px;
        }

        .lyd-button--medium {
          padding: 12px 24px;
          font-size: 16px;
          gap: 8px;
        }

        .lyd-button--large {
          padding: 16px 32px;
          font-size: 18px;
          gap: 10px;
        }

        /* Rounded style */
        .lyd-button--rounded {
          border-radius: 50px;
        }

        /* Variants */
        .lyd-button--primary {
          background: #3366CC;
          color: white;
          border-color: #3366CC;
        }

        .lyd-button--primary:hover:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #2952A3;
          border-color: #2952A3;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(51, 102, 204, 0.3);
        }

        .lyd-button--primary:active:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #1F3D7A;
          border-color: #1F3D7A;
          transform: translateY(0);
        }

        .lyd-button--secondary {
          background: #000066;
          color: white;
          border-color: #000066;
        }

        .lyd-button--secondary:hover:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #000052;
          border-color: #000052;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 102, 0.3);
        }

        .lyd-button--outline {
          background: transparent;
          color: #3366CC;
          border-color: #3366CC;
        }

        .lyd-button--outline:hover:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #3366CC;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(51, 102, 204, 0.2);
        }

        .lyd-button--ghost {
          background: transparent;
          color: #3366CC;
          border-color: transparent;
        }

        .lyd-button--ghost:hover:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #E8F0FE;
          transform: translateY(-1px);
        }

        .lyd-button--danger {
          background: #DC2626;
          color: white;
          border-color: #DC2626;
        }

        .lyd-button--danger:hover:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #B91C1C;
          border-color: #B91C1C;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .lyd-button--success {
          background: #16A34A;
          color: white;
          border-color: #16A34A;
        }

        .lyd-button--success:hover:not(.lyd-button--disabled):not(.lyd-button--loading) {
          background: #15803D;
          border-color: #15803D;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        /* States */
        .lyd-button--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .lyd-button--loading {
          cursor: wait;
        }

        .lyd-button--loading .icon-wrapper,
        .lyd-button--loading slot {
          opacity: 0;
        }

        /* Icon styles */
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .lyd-button--small .icon-wrapper {
          width: 16px;
          height: 16px;
        }

        .lyd-button--large .icon-wrapper {
          width: 24px;
          height: 24px;
        }

        .icon-wrapper svg {
          width: 100%;
          height: 100%;
        }

        .icon-right {
          order: 1;
        }

        /* Loading spinner */
        .loading-spinner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid currentColor;
          border-radius: 50%;
          border-right-color: transparent;
          animation: spin 0.75s linear infinite;
        }

        .lyd-button--small .loading-spinner {
          width: 16px;
          height: 16px;
        }

        .lyd-button--large .loading-spinner {
          width: 24px;
          height: 24px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* Slot content */
        ::slotted(*) {
          display: inline;
        }
      </style>
      <button class="${classes}" ${disabled ? 'disabled' : ''} ${loading ? 'aria-busy="true"' : ''}>
        ${loadingSpinner}
        ${iconPosition === 'left' ? iconHtml : ''}
        <slot></slot>
        ${iconPosition === 'right' ? iconHtml : ''}
      </button>
    `;

    this.setupEventListeners();
  }
}

customElements.define('lyd-button', LydButton);