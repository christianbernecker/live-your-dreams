// Live Your Dreams Card Component
// Property showcase cards with automotive-grade styling

class LydCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'hoverable', 'clickable'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  setupEventListeners() {
    if (this.hasAttribute('clickable')) {
      this.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('lyd-card-click', {
          bubbles: true,
          composed: true
        }));
      });
      this.style.cursor = 'pointer';
    }
  }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const hoverable = this.hasAttribute('hoverable');
    const clickable = this.hasAttribute('clickable');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        
        /* Variants */
        .card--default {
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .card--elevated {
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .card--glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        .card--outlined {
          border: 2px solid #e5e7eb;
          box-shadow: none;
        }
        
        /* Interactive States */
        .card--hoverable:hover {
          transform: translateY(-2px);
        }
        
        .card--hoverable.card--default:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }
        
        .card--hoverable.card--elevated:hover {
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
        }
        
        .card--hoverable.card--glass:hover {
          backdrop-filter: blur(24px);
          border-color: rgba(0, 102, 255, 0.3);
        }
        
        .card--clickable {
          cursor: pointer;
        }
        
        .card--clickable:active {
          transform: scale(0.98);
        }
        
        .card--clickable:focus-visible {
          outline: 2px solid #0066ff;
          outline-offset: 2px;
        }
        
        /* Content Slots */
        ::slotted(.card-header) {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        ::slotted(.card-footer) {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        ::slotted(.card-image) {
          margin: -24px -24px 16px -24px;
          border-radius: 12px 12px 0 0;
          width: calc(100% + 48px);
          height: 200px;
          object-fit: cover;
        }
        
        ::slotted(.price) {
          font-size: 24px;
          font-weight: 700;
          color: #0066ff;
        }
        
        ::slotted(.property-meta) {
          color: #6b7280;
          font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
          .card {
            padding: 16px;
          }
          
          ::slotted(.card-image) {
            margin: -16px -16px 12px -16px;
            width: calc(100% + 32px);
          }
        }
      </style>
      
      <div class="card card--${variant} ${hoverable ? 'card--hoverable' : ''} ${clickable ? 'card--clickable' : ''}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('lyd-card', LydCard);

export { LydCard };
