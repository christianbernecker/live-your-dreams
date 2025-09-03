// LYD Design System - Button Tile Component
import { LYD_ICONS } from '../icons/icon-library.js';

export class LydButtonTile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._rippleTimeout = null;
  }

  static get observedAttributes() {
    return ['icon', 'label', 'description', 'disabled', 'variant', 'size'];
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
    const button = this.shadowRoot.querySelector('.lyd-button-tile');
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
        label: this.getAttribute('label'),
        description: this.getAttribute('description')
      },
      bubbles: true
    }));
  }

  createRipple(event) {
    const button = this.shadowRoot.querySelector('.lyd-button-tile');
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
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const disabled = this.hasAttribute('disabled');
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'medium';

    const classes = [
      'lyd-button-tile',
      `lyd-button-tile--${variant}`,
      `lyd-button-tile--${size}`,
      disabled ? 'lyd-button-tile--disabled' : ''
    ].filter(Boolean).join(' ');

    const iconHtml = icon ? this.getIconHtml(icon) : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 200px;
        }

        .lyd-button-tile {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 120px;
          padding: 24px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          text-align: center;
          box-sizing: border-box;
        }

        .lyd-button-tile:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.2);
        }

        /* Sizes */
        .lyd-button-tile--small {
          min-height: 100px;
          padding: 16px 12px;
        }

        .lyd-button-tile--small .icon-wrapper {
          width: 32px;
          height: 32px;
          margin-bottom: 8px;
        }

        .lyd-button-tile--small .tile-label {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .lyd-button-tile--small .tile-description {
          font-size: 12px;
        }

        .lyd-button-tile--medium {
          min-height: 120px;
          padding: 24px 16px;
        }

        .lyd-button-tile--medium .icon-wrapper {
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
        }

        .lyd-button-tile--medium .tile-label {
          font-size: 16px;
          margin-bottom: 6px;
        }

        .lyd-button-tile--medium .tile-description {
          font-size: 14px;
        }

        .lyd-button-tile--large {
          min-height: 160px;
          padding: 32px 20px;
        }

        .lyd-button-tile--large .icon-wrapper {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
        }

        .lyd-button-tile--large .tile-label {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .lyd-button-tile--large .tile-description {
          font-size: 16px;
        }

        /* Variants */
        .lyd-button-tile--default {
          border-color: #e5e7eb;
          color: #374151;
        }

        .lyd-button-tile--default:hover:not(.lyd-button-tile--disabled) {
          border-color: #3366CC;
          background: #f8faff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(51, 102, 204, 0.15);
        }

        .lyd-button-tile--default .icon-wrapper {
          color: #3366CC;
        }

        .lyd-button-tile--primary {
          border-color: #3366CC;
          background: #f8faff;
          color: #1e40af;
        }

        .lyd-button-tile--primary:hover:not(.lyd-button-tile--disabled) {
          border-color: #2952A3;
          background: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(51, 102, 204, 0.2);
        }

        .lyd-button-tile--primary .icon-wrapper {
          color: #3366CC;
        }

        .lyd-button-tile--outline {
          border-color: #d1d5db;
          background: transparent;
          color: #374151;
        }

        .lyd-button-tile--outline:hover:not(.lyd-button-tile--disabled) {
          border-color: #3366CC;
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .lyd-button-tile--outline .icon-wrapper {
          color: #6b7280;
        }

        .lyd-button-tile--outline:hover:not(.lyd-button-tile--disabled) .icon-wrapper {
          color: #3366CC;
        }

        /* States */
        .lyd-button-tile--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        /* Icon styles */
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
          color: #3366CC;
          flex-shrink: 0;
        }

        .icon-wrapper svg {
          width: 100%;
          height: 100%;
        }

        /* Text styles */
        .tile-label {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
          margin: 0 0 6px 0;
          color: inherit;
        }

        .tile-description {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          color: #6b7280;
          opacity: 0.8;
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(51, 102, 204, 0.2);
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

        /* Responsive */
        @media (max-width: 768px) {
          :host {
            width: 100%;
            max-width: 300px;
          }
        }
      </style>
      <button class="${classes}" ${disabled ? 'disabled' : ''}>
        ${iconHtml ? `<div class="icon-wrapper">${iconHtml}</div>` : ''}
        ${label ? `<div class="tile-label">${label}</div>` : ''}
        ${description ? `<div class="tile-description">${description}</div>` : ''}
        <slot></slot>
      </button>
    `;

    this.setupEventListeners();
  }
}

customElements.define('lyd-button-tile', LydButtonTile);



