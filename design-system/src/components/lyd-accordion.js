// Live Your Dreams Accordion Component
// Professional accordion with smooth animations and accessibility

class LydAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  static get observedAttributes() {
    return ['open', 'disabled', 'variant'];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    
    // Set initial state
    if (this.hasAttribute('open')) {
      this.isOpen = true;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      this.isOpen = newValue !== null;
    }
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 8px;
        }
        
        .accordion {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .accordion--elevated {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .accordion--glass {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          transition: background-color 0.2s ease;
        }
        
        .accordion-header:hover:not(:disabled) {
          background: #f9fafb;
        }
        
        .accordion-header:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .accordion-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .accordion-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: #6b7280;
        }
        
        .accordion-icon--open {
          transform: rotate(180deg);
        }
        
        .accordion-content {
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .accordion-content--closed {
          max-height: 0;
          opacity: 0;
        }
        
        .accordion-content--open {
          max-height: 1000px;
          opacity: 1;
        }
        
        .accordion-body {
          padding: 0 24px 24px;
          color: #4b5563;
          line-height: 1.6;
        }
        
        /* Focus styles for accessibility */
        .accordion-header:focus {
          outline: 2px solid #0066ff;
          outline-offset: 2px;
        }
        
        /* Real Estate specific styling */
        .accordion--property {
          border-left: 4px solid #0066ff;
        }
        
        .accordion--lead {
          border-left: 4px solid #22c55e;
        }
        
        .accordion--warning {
          border-left: 4px solid #f59e0b;
        }
      </style>
      
      <div class="accordion accordion--${variant}">
        <button 
          class="accordion-header"
          ${disabled ? 'disabled' : ''}
          aria-expanded="${this.isOpen}"
          aria-controls="accordion-content"
        >
          <h3 class="accordion-title">
            <slot name="title">Accordion Title</slot>
          </h3>
          <svg 
            class="accordion-icon ${this.isOpen ? 'accordion-icon--open' : ''}"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div 
          class="accordion-content ${this.isOpen ? 'accordion-content--open' : 'accordion-content--closed'}"
          id="accordion-content"
          role="region"
          aria-labelledby="accordion-header"
        >
          <div class="accordion-body">
            <slot name="content">Accordion content goes here...</slot>
          </div>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    const header = this.shadowRoot.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
      if (!this.hasAttribute('disabled')) {
        this.toggle();
      }
    });
    
    // Keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!this.hasAttribute('disabled')) {
          this.toggle();
        }
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('lyd-accordion-toggle', {
      detail: { 
        open: this.isOpen,
        accordion: this
      },
      bubbles: true
    }));
    
    this.render();
  }

  // Public API methods
  open() {
    if (!this.isOpen) {
      this.toggle();
    }
  }

  close() {
    if (this.isOpen) {
      this.toggle();
    }
  }
}

customElements.define('lyd-accordion', LydAccordion);

export default LydAccordion;
