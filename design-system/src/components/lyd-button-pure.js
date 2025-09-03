// LYD Design System - Pure Icon Button Component
import { LYD_ICONS } from '../icons/icon-library.js';

export class LydButtonPure extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._rippleTimeout = null;
  }

  static get observedAttributes() {
    return ['icon', 'size', 'disabled', 'variant'];
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
    const button = this.shadowRoot.querySelector('.lyd-button-pure');
    if (button) {
      button.addEventListener('click', (e) => this.handleClick(e));
    }
  }

  handleClick(event) {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Create ripple effect
    this.createRipple(event);

    // Emit custom event
    this.dispatchEvent(new CustomEvent('lyd-click', {
      detail: {
        icon: this.getAttribute('icon'),
        variant: this.getAttribute('variant')
      },
      bubbles: true
    }));
  }

  createRipple(event) {
    const button = this.shadowRoot.querySelector('.lyd-button-pure');
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
    const icon = this.getAttribute('icon');
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');
    const variant = this.getAttribute('variant') || 'default';

    if (!icon) {
      console.warn('lyd-button-pure requires an icon attribute');
      return;
    }

    const classes = [
      'lyd-button-pure',
      `lyd-button-pure--${size}`,
      `lyd-button-pure--${variant}`,
      disabled ? 'lyd-button-pure--disabled' : ''
    ].filter(Boolean).join(' ');

    const iconHtml = this.getIconHtml(icon);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .lyd-button-pure {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: none;
          border-radius: 50%;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          user-select: none;
        }

        .lyd-button-pure:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.2);
        }

        /* Sizes */
        .lyd-button-pure--small {
          padding: 6px;
        }

        .lyd-button-pure--small .icon-wrapper {
          width: 16px;
          height: 16px;
        }

        .lyd-button-pure--medium {
          padding: 8px;
        }

        .lyd-button-pure--medium .icon-wrapper {
          width: 20px;
          height: 20px;
        }

        .lyd-button-pure--large {
          padding: 12px;
        }

        .lyd-button-pure--large .icon-wrapper {
          width: 24px;
          height: 24px;
        }

        /* Variants */
        .lyd-button-pure--default {
          color: #6b7280;
        }

        .lyd-button-pure--default:hover:not(.lyd-button-pure--disabled) {
          background: #f3f4f6;
          color: #374151;
          transform: scale(1.05);
        }

        .lyd-button-pure--primary {
          color: #3366CC;
        }

        .lyd-button-pure--primary:hover:not(.lyd-button-pure--disabled) {
          background: #E8F0FE;
          color: #2952A3;
          transform: scale(1.05);
        }

        .lyd-button-pure--danger {
          color: #DC2626;
        }

        .lyd-button-pure--danger:hover:not(.lyd-button-pure--disabled) {
          background: #FEF2F2;
          color: #B91C1C;
          transform: scale(1.05);
        }

        .lyd-button-pure--success {
          color: #16A34A;
        }

        .lyd-button-pure--success:hover:not(.lyd-button-pure--disabled) {
          background: #F0FDF4;
          color: #15803D;
          transform: scale(1.05);
        }

        /* States */
        .lyd-button-pure--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Icon styles */
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .icon-wrapper svg {
          width: 100%;
          height: 100%;
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.1);
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
      </style>
      <button class="${classes}" ${disabled ? 'disabled' : ''} aria-label="${icon} button">
        <span class="icon-wrapper">${iconHtml}</span>
      </button>
    `;

    this.setupEventListeners();
  }
}

customElements.define('lyd-button-pure', LydButtonPure);



