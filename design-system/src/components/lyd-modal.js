// Live Your Dreams Modal Component
// Professional modal dialog with overlay, animations, and accessibility

class LydModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  static get observedAttributes() {
    return ['open', 'size', 'variant', 'closable'];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    
    // Set initial state
    if (this.hasAttribute('open')) {
      this.isOpen = true;
      this.show();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      this.isOpen = newValue !== null;
      if (this.isOpen) {
        this.show();
      } else {
        this.hide();
      }
    }
    this.render();
  }

  render() {
    const size = this.getAttribute('size') || 'medium';
    const variant = this.getAttribute('variant') || 'default';
    const closable = this.getAttribute('closable') !== 'false';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: ${this.isOpen ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        
        .modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .modal-backdrop--open {
          opacity: 1;
        }
        
        .modal-dialog {
          position: relative;
          background: white;
          border-radius: 16px;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: scale(0.95) translateY(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-dialog--open {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        
        /* Sizes */
        .modal-dialog--small {
          width: 100%;
          max-width: 400px;
        }
        
        .modal-dialog--medium {
          width: 100%;
          max-width: 600px;
        }
        
        .modal-dialog--large {
          width: 100%;
          max-width: 800px;
        }
        
        .modal-dialog--fullscreen {
          width: 100%;
          max-width: 95vw;
          height: 95vh;
          max-height: 95vh;
        }
        
        /* Variants */
        .modal-dialog--glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .modal-dialog--property {
          border-top: 4px solid #0066ff;
        }
        
        .modal-dialog--warning {
          border-top: 4px solid #f59e0b;
        }
        
        .modal-dialog--success {
          border-top: 4px solid #22c55e;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
          margin-bottom: 20px;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-close:focus {
          outline: 2px solid #0066ff;
          outline-offset: 2px;
        }
        
        .modal-close-icon {
          width: 24px;
          height: 24px;
        }
        
        .modal-body {
          padding: 0 24px 24px;
          color: #4b5563;
          line-height: 1.6;
        }
        
        .modal-footer {
          padding: 0 24px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        /* Animations */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes modalFadeOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 640px) {
          :host {
            padding: 8px;
          }
          
          .modal-dialog {
            width: 100%;
            max-width: none;
            margin: 0;
            border-radius: 12px;
          }
          
          .modal-header,
          .modal-body,
          .modal-footer {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      </style>
      
      <div class="modal-backdrop ${this.isOpen ? 'modal-backdrop--open' : ''}" role="presentation"></div>
      
      <div 
        class="modal-dialog modal-dialog--${size} modal-dialog--${variant} ${this.isOpen ? 'modal-dialog--open' : ''}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title">
            <slot name="title">Modal Title</slot>
          </h2>
          ${closable ? `
            <button class="modal-close" aria-label="Close modal">
              <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ` : ''}
        </div>
        
        <div class="modal-body">
          <slot name="content">Modal content goes here...</slot>
        </div>
        
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
    const closeButton = this.shadowRoot.querySelector('.modal-close');
    
    // Close on backdrop click
    backdrop?.addEventListener('click', () => {
      if (this.getAttribute('closable') !== 'false') {
        this.close();
      }
    });
    
    // Close on close button click
    closeButton?.addEventListener('click', () => {
      this.close();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen && this.getAttribute('closable') !== 'false') {
        this.close();
      }
    });
    
    // Prevent dialog click from closing modal
    const dialog = this.shadowRoot.querySelector('.modal-dialog');
    dialog?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  show() {
    this.isOpen = true;
    this.setAttribute('open', '');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.trapFocus();
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('lyd-modal-open', {
      detail: { modal: this },
      bubbles: true
    }));
    
    this.render();
  }

  hide() {
    this.isOpen = false;
    this.removeAttribute('open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    this.restoreFocus();
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('lyd-modal-close', {
      detail: { modal: this },
      bubbles: true
    }));
    
    this.render();
  }

  open() {
    this.show();
  }

  close() {
    this.hide();
  }

  trapFocus() {
    // Store currently focused element
    this.previouslyFocused = document.activeElement;
    
    // Focus first focusable element in modal
    setTimeout(() => {
      const focusableElements = this.shadowRoot.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 100);
  }

  restoreFocus() {
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }
}

customElements.define('lyd-modal', LydModal);

export default LydModal;
