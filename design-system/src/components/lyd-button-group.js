// LYD Design System - Button Group Component
export class LydButtonGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['connected', 'orientation', 'size'];
  }

  connectedCallback() {
    this.render();
    this.setupButtons();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
      this.setupButtons();
    }
  }

  setupButtons() {
    // Apply styling to slotted buttons
    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.styleButtons();
      });
      this.styleButtons();
    }
  }

  styleButtons() {
    const buttons = this.querySelectorAll('lyd-button');
    const connected = this.hasAttribute('connected');
    
    buttons.forEach((button, index) => {
      if (connected) {
        // Remove individual button border radius for connected look
        button.style.setProperty('--button-border-radius', '0');
        
        // First button gets left radius
        if (index === 0) {
          button.style.setProperty('--button-border-radius', '8px 0 0 8px');
        }
        
        // Last button gets right radius
        if (index === buttons.length - 1) {
          button.style.setProperty('--button-border-radius', '0 8px 8px 0');
        }
        
        // Single button gets full radius
        if (buttons.length === 1) {
          button.style.setProperty('--button-border-radius', '8px');
        }
        
        // Remove margin between connected buttons
        if (index > 0) {
          button.style.marginLeft = '-2px';
        }
      }
    });
  }

  render() {
    const connected = this.hasAttribute('connected');
    const orientation = this.getAttribute('orientation') || 'horizontal';
    const size = this.getAttribute('size') || 'medium';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          gap: ${connected ? '0' : '8px'};
          flex-direction: ${orientation === 'vertical' ? 'column' : 'row'};
          align-items: ${orientation === 'vertical' ? 'stretch' : 'center'};
        }

        :host([connected]) ::slotted(lyd-button:not(:first-child)) {
          margin-left: -2px;
        }

        :host([connected]) ::slotted(lyd-button:not(:first-child):not(:last-child)) {
          border-radius: 0 !important;
        }

        :host([connected]) ::slotted(lyd-button:first-child) {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }

        :host([connected]) ::slotted(lyd-button:last-child) {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }

        :host([orientation="vertical"]) {
          flex-direction: column;
        }

        :host([orientation="vertical"][connected]) ::slotted(lyd-button:not(:first-child)) {
          margin-left: 0;
          margin-top: -2px;
        }

        :host([orientation="vertical"][connected]) ::slotted(lyd-button:not(:first-child):not(:last-child)) {
          border-radius: 0 !important;
        }

        :host([orientation="vertical"][connected]) ::slotted(lyd-button:first-child) {
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
        }

        :host([orientation="vertical"][connected]) ::slotted(lyd-button:last-child) {
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
        }

        /* Size variants */
        :host([size="small"]) ::slotted(lyd-button) {
          --button-size: small;
        }

        :host([size="large"]) ::slotted(lyd-button) {
          --button-size: large;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('lyd-button-group', LydButtonGroup);



