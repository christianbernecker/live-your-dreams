import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Live Your Dreams Button Component
 * Automotive-grade button for real estate applications
 */
@customElement('lyd-button')
export class LydButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: "Inter", system-ui, -apple-system, sans-serif;
    }
    
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      /* Styling */
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      
      /* Remove default button styles */
      background: none;
      color: inherit;
    }
    
    /* Variants */
    .button--primary {
      background: #0066ff;
      color: white;
    }
    
    .button--primary:hover {
      background: #0052cc;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
    }
    
    .button--secondary {
      background: #f8fafc;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }
    
    .button--secondary:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    
    .button--outline {
      background: transparent;
      color: #0066ff;
      border: 2px solid #0066ff;
    }
    
    .button--outline:hover {
      background: #0066ff;
      color: white;
    }
    
    /* Sizes */
    .button--small {
      padding: 8px 16px;
      font-size: 14px;
    }
    
    .button--large {
      padding: 16px 32px;
      font-size: 18px;
    }
    
    /* States */
    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .button--loading {
      position: relative;
      color: transparent;
    }
    
    .button--loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-right-color: transparent;
      animation: spin 0.75s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  @property({ type: String })
  variant: 'primary' | 'secondary' | 'outline' = 'primary';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  loading = false;

  render() {
    const classes = [
      'button',
      `button--${this.variant}`,
      `button--${this.size}`,
      this.loading && 'button--loading'
    ].filter(Boolean).join(' ');

    return html`
      <button 
        class="${classes}"
        ?disabled=${this.disabled || this.loading}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('lyd-click', {
      bubbles: true,
      composed: true
    }));
  }
}

