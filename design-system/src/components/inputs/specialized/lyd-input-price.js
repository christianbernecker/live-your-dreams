// LYD Design System - Price Input Component
import { LydInputBase } from '../base/lyd-input-base.js';

export class LydInputPrice extends LydInputBase {
  constructor() {
    super();
    this._currency = 'EUR';
    this._priceType = 'sale'; // sale, rent, estimate
    this._rawValue = '';
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'currency',
      'price-type',
      'show-currency',
      'format-on-blur',
      'allow-decimals'
    ];
  }

  get currency() {
    return this.getAttribute('currency') || 'EUR';
  }

  set currency(value) {
    this.setAttribute('currency', value);
  }

  get priceType() {
    return this.getAttribute('price-type') || 'sale';
  }

  set priceType(value) {
    this.setAttribute('price-type', value);
  }

  get rawValue() {
    return this._rawValue;
  }

  get numericValue() {
    return this.parsePrice(this._value);
  }

  // Override value getter/setter for price formatting
  get value() {
    return this._value;
  }

  set value(val) {
    this._rawValue = val;
    
    // Format the value for display
    const formattedValue = this.formatPrice(val);
    
    const oldValue = this._value;
    this._value = formattedValue;
    
    if (this._internals) {
      // Store the numeric value for form submission
      this._internals.setFormValue(this.parsePrice(formattedValue).toString());
    }
    
    this.setAttribute('value', formattedValue);
    this.dispatchEvent(new CustomEvent('input', {
      detail: { 
        value: formattedValue, 
        numericValue: this.parsePrice(formattedValue),
        oldValue 
      },
      bubbles: true
    }));
    
    this.validate();
  }

  parsePrice(value) {
    if (!value) return 0;
    
    // Remove currency symbols, spaces, and non-numeric characters except decimal separators
    const cleanValue = value.toString()
      .replace(/[€$£¥₹]/g, '')
      .replace(/[^\d.,\-]/g, '')
      .replace(/,/g, '.');
    
    const numericValue = parseFloat(cleanValue) || 0;
    return numericValue;
  }

  formatPrice(value, options = {}) {
    const numericValue = this.parsePrice(value);
    if (numericValue === 0 && !value) return '';
    
    const currency = options.currency || this.currency;
    const showCurrency = options.showCurrency !== false && this.hasAttribute('show-currency');
    const allowDecimals = this.hasAttribute('allow-decimals');
    
    try {
      const formatter = new Intl.NumberFormat('de-DE', {
        style: showCurrency ? 'currency' : 'decimal',
        currency: showCurrency ? currency : undefined,
        minimumFractionDigits: allowDecimals ? 0 : 0,
        maximumFractionDigits: allowDecimals ? 2 : 0
      });
      
      return formatter.format(numericValue);
    } catch (error) {
      // Fallback formatting
      const formatted = allowDecimals 
        ? numericValue.toFixed(2)
        : Math.round(numericValue).toString();
      
      return showCurrency ? `€ ${formatted}` : formatted;
    }
  }

  handleInput(event) {
    this._dirty = true;
    this._rawValue = event.target.value;
    
    // Allow typing without immediate formatting
    const oldValue = this._value;
    this._value = event.target.value;
    
    this.dispatchEvent(new CustomEvent('input', {
      detail: { 
        value: this._value, 
        numericValue: this.parsePrice(this._value),
        oldValue 
      },
      bubbles: true
    }));
  }

  handleBlur(event) {
    this._touched = true;
    
    // Format on blur if enabled
    if (this.hasAttribute('format-on-blur')) {
      const formatted = this.formatPrice(this._value);
      this._value = formatted;
      event.target.value = formatted;
      
      if (this._internals) {
        this._internals.setFormValue(this.parsePrice(formatted).toString());
      }
    }
    
    this.validate();
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { 
        value: this._value,
        numericValue: this.parsePrice(this._value)
      },
      bubbles: true
    }));
  }

  // Enhanced validation for price inputs
  validate() {
    this._errors = [];
    this._isValid = true;

    const value = this._value;
    const numericValue = this.parsePrice(value);
    const required = this.hasAttribute('required');
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');

    // Required validation
    if (required && (!value || value.trim() === '' || numericValue === 0)) {
      this._errors.push('Price is required');
      this._isValid = false;
    }

    if (value && numericValue > 0) {
      // Minimum price validation
      if (min && numericValue < parseFloat(min)) {
        this._errors.push(`Price must be at least ${this.formatPrice(min)}`);
        this._isValid = false;
      }

      // Maximum price validation
      if (max && numericValue > parseFloat(max)) {
        this._errors.push(`Price cannot exceed ${this.formatPrice(max)}`);
        this._isValid = false;
      }

      // Price type specific validation
      const priceType = this.priceType;
      if (priceType === 'rent' && numericValue < 100) {
        this._errors.push('Rental price seems unusually low');
        this._isValid = false;
      }
      
      if (priceType === 'sale' && numericValue < 1000) {
        this._errors.push('Sale price seems unusually low');
        this._isValid = false;
      }
    }

    // Update form validity
    if (this._internals) {
      if (this._isValid) {
        this._internals.setValidity({});
      } else {
        this._internals.setValidity(
          { customError: true },
          this._errors.join(', ')
        );
      }
    }

    this.updateVisualState();
    return this._isValid;
  }

  getPriceTypeLabel() {
    const types = {
      'sale': 'Purchase Price',
      'rent': 'Monthly Rent',
      'estimate': 'Estimated Value'
    };
    return types[this.priceType] || 'Price';
  }

  getPriceTypeIcon() {
    const icons = {
      'sale': 'home',
      'rent': 'key',
      'estimate': 'euro'
    };
    return icons[this.priceType] || 'euro';
  }

  getInputAttributes() {
    const attrs = super.getInputAttributes();
    
    // Override type to text for better formatting control
    attrs.type = 'text';
    attrs.inputmode = 'decimal';
    attrs.pattern = '[0-9]*[.,]?[0-9]*';
    
    return attrs;
  }

  render() {
    // Set default attributes if not provided
    if (!this.hasAttribute('label')) {
      this.setAttribute('label', this.getPriceTypeLabel());
    }
    
    if (!this.hasAttribute('icon-left')) {
      this.setAttribute('icon-left', this.getPriceTypeIcon());
    }
    
    if (!this.hasAttribute('placeholder')) {
      const placeholder = this.priceType === 'rent' ? '1.500' : '750.000';
      this.setAttribute('placeholder', placeholder);
    }

    // Add currency suffix if show-currency is enabled
    if (this.hasAttribute('show-currency') && !this.hasAttribute('suffix')) {
      this.setAttribute('suffix', this.currency);
    }

    // Call parent render
    super.render();

    // Add price-specific styling
    const style = this.shadowRoot.querySelector('style');
    if (style) {
      style.textContent += `
        .lyd-input--price .lyd-input__field {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .lyd-input__price-type {
          font-size: 12px;
          color: #6B7280;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .lyd-input__price-suggestions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .lyd-input__price-suggestion {
          padding: 4px 8px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          font-size: 12px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lyd-input__price-suggestion:hover {
          border-color: #3366CC;
          color: #3366CC;
        }
      `;
    }

    // Add price suggestions for common values
    this.addPriceSuggestions();
  }

  addPriceSuggestions() {
    const footer = this.shadowRoot.querySelector('.lyd-input__footer');
    if (!footer || this.hasAttribute('hide-suggestions')) return;

    const suggestions = this.getPriceSuggestions();
    if (suggestions.length === 0) return;

    const suggestionsHtml = suggestions.map(price => 
      `<button type="button" class="lyd-input__price-suggestion" data-price="${price}">
        ${this.formatPrice(price, { showCurrency: true })}
      </button>`
    ).join('');

    footer.insertAdjacentHTML('afterend', `
      <div class="lyd-input__price-suggestions">
        ${suggestionsHtml}
      </div>
    `);

    // Add click handlers for suggestions
    this.shadowRoot.querySelectorAll('.lyd-input__price-suggestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const price = e.target.dataset.price;
        this.value = price;
        this.focus();
      });
    });
  }

  getPriceSuggestions() {
    const priceType = this.priceType;
    
    if (priceType === 'rent') {
      return [800, 1200, 1500, 2000, 2500];
    } else if (priceType === 'sale') {
      return [300000, 500000, 750000, 1000000, 1500000];
    }
    
    return [];
  }

  // Public methods
  formatCurrentValue() {
    this.value = this.formatPrice(this._value);
  }

  setNumericValue(numericValue) {
    this.value = numericValue.toString();
  }
}

customElements.define('lyd-input-price', LydInputPrice);



