// Live Your Dreams Grid System
// Professional Grid Component inspired by Porsche Design System

class LydGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'gap', 'align-items', 'justify-content'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'basic';
    const gap = this.getAttribute('gap') || 'medium';
    const alignItems = this.getAttribute('align-items') || 'stretch';
    const justifyContent = this.getAttribute('justify-content') || 'start';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 2560px;
          min-width: 320px;
          margin: 0 auto;
          padding: 0 16px;
        }
        
        .grid {
          display: grid;
          width: 100%;
          box-sizing: border-box;
        }
        
        /* Grid Gaps - Fluid Sizing */
        .grid--gap-small {
          gap: clamp(12px, 2vw, 16px);
        }
        
        .grid--gap-medium {
          gap: clamp(16px, 3vw, 24px);
        }
        
        .grid--gap-large {
          gap: clamp(24px, 4vw, 32px);
        }
        
        /* Grid Variants - Porsche System Adapted */
        
        /* Narrow Grid - 4 content + 2 safe zone columns */
        .grid--narrow {
          grid-template-columns: 
            1fr 
            repeat(4, minmax(0, 1fr)) 
            1fr;
          max-width: 640px;
        }
        
        /* Basic Grid - Mobile: 6+2, Desktop: 12+2 columns */
        .grid--basic {
          grid-template-columns: 
            1fr 
            repeat(6, minmax(0, 1fr)) 
            1fr;
        }
        
        @media (min-width: 760px) {
          .grid--basic {
            grid-template-columns: 
              1fr 
              repeat(12, minmax(0, 1fr)) 
              1fr;
          }
        }
        
        /* Extended Grid - 14+2 columns on desktop */
        .grid--extended {
          grid-template-columns: 
            1fr 
            repeat(6, minmax(0, 1fr)) 
            1fr;
        }
        
        @media (min-width: 760px) {
          .grid--extended {
            grid-template-columns: 
              1fr 
              repeat(14, minmax(0, 1fr)) 
              1fr;
          }
        }
        
        /* Wide Grid - 16+2 columns on desktop */
        .grid--wide {
          grid-template-columns: 
            1fr 
            repeat(6, minmax(0, 1fr)) 
            1fr;
        }
        
        @media (min-width: 760px) {
          .grid--wide {
            grid-template-columns: 
              1fr 
              repeat(16, minmax(0, 1fr)) 
              1fr;
          }
        }
        
        /* Full Grid - Edge to edge */
        .grid--full {
          grid-template-columns: repeat(8, minmax(0, 1fr));
          padding: 0;
        }
        
        @media (min-width: 760px) {
          .grid--full {
            grid-template-columns: repeat(18, minmax(0, 1fr));
          }
        }
        
        /* Alignment Options */
        .grid--align-start {
          align-items: start;
        }
        
        .grid--align-center {
          align-items: center;
        }
        
        .grid--align-end {
          align-items: end;
        }
        
        .grid--align-stretch {
          align-items: stretch;
        }
        
        /* Justification Options */
        .grid--justify-start {
          justify-content: start;
        }
        
        .grid--justify-center {
          justify-content: center;
        }
        
        .grid--justify-end {
          justify-content: end;
        }
        
        .grid--justify-between {
          justify-content: space-between;
        }
        
        /* Responsive Padding */
        @media (min-width: 480px) {
          :host {
            padding: 0 24px;
          }
        }
        
        @media (min-width: 1024px) {
          :host {
            padding: 0 32px;
          }
        }
        
        @media (min-width: 1440px) {
          :host {
            padding: 0 48px;
          }
        }
        
        /* Debug Mode */
        :host([debug]) .grid {
          position: relative;
        }
        
        :host([debug]) .grid::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            to right,
            rgba(0, 102, 255, 0.1) 0,
            rgba(0, 102, 255, 0.1) calc(100% / var(--columns) - var(--gap)),
            transparent calc(100% / var(--columns) - var(--gap)),
            transparent calc(100% / var(--columns))
          );
          pointer-events: none;
          z-index: 1000;
        }
      </style>
      
      <div class="grid grid--${variant} grid--gap-${gap} grid--align-${alignItems} grid--justify-${justifyContent}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('lyd-grid', LydGrid);

// Grid Item Component
class LydGridItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['span', 'start', 'end', 'offset'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const span = this.getAttribute('span') || 'auto';
    const start = this.getAttribute('start') || 'auto';
    const end = this.getAttribute('end') || 'auto';
    const offset = this.getAttribute('offset') || '0';

    // Parse span (e.g., "1-6" for mobile-desktop responsive)
    const [mobileSpan, desktopSpan] = span.includes('-') ? span.split('-') : [span, span];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          grid-column-start: ${start !== 'auto' ? parseInt(start) + 1 : 'auto'};
          grid-column-end: ${end !== 'auto' ? parseInt(end) + 1 : 'auto'};
        }
        
        /* Span handling */
        ${span !== 'auto' && !span.includes('-') ? `
          :host {
            grid-column: span ${span};
          }
        ` : ''}
        
        /* Responsive span */
        ${span.includes('-') ? `
          :host {
            grid-column: span ${mobileSpan};
          }
          
          @media (min-width: 760px) {
            :host {
              grid-column: span ${desktopSpan};
            }
          }
        ` : ''}
        
        /* Offset */
        ${offset !== '0' ? `
          :host {
            margin-left: calc(${offset} * (100% / var(--grid-columns, 12)));
          }
        ` : ''}
        
        .item {
          width: 100%;
          height: 100%;
        }
      </style>
      
      <div class="item">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('lyd-grid-item', LydGridItem);

export { LydGrid, LydGridItem };
