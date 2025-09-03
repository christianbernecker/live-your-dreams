// LYD Design System - Address Input Component
import { LydInputBase } from '../base/lyd-input-base.js';

export class LydInputAddress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Form association API
    this._internals = this.attachInternals ? this.attachInternals() : null;
    
    // Address components
    this._addressData = {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      state: '',
      country: 'Germany'
    };
    
    this._isValid = true;
    this._touched = false;
    this._errors = [];
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return [
      'name', 'required', 'disabled', 'readonly',
      'label', 'description', 'helper-text',
      'variant', 'size', 'full-width',
      'show-map', 'enable-autocomplete', 'country',
      'validate-address', 'compact-mode'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeFormAssociation();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Form Association API
  initializeFormAssociation() {
    if (this._internals) {
      this._internals.setFormValue(this.getFormattedAddress());
    }
  }

  get form() {
    return this._internals ? this._internals.form : null;
  }

  get name() {
    return this.getAttribute('name');
  }

  get value() {
    return this._addressData;
  }

  set value(addressData) {
    if (typeof addressData === 'string') {
      this.parseAddressString(addressData);
    } else if (typeof addressData === 'object') {
      this._addressData = { ...this._addressData, ...addressData };
    }
    
    if (this._internals) {
      this._internals.setFormValue(this.getFormattedAddress());
    }
    
    this.updateInputFields();
    this.validate();
    
    this.dispatchEvent(new CustomEvent('input', {
      detail: { 
        value: this._addressData,
        formattedAddress: this.getFormattedAddress()
      },
      bubbles: true
    }));
  }

  get validity() {
    return this._internals ? this._internals.validity : { valid: this._isValid };
  }

  get validationMessage() {
    return this._internals ? this._internals.validationMessage : this._errors.join(', ');
  }

  // Address parsing and formatting
  parseAddressString(addressString) {
    // Simple address parsing - can be enhanced with more sophisticated logic
    const parts = addressString.split(',').map(part => part.trim());
    
    if (parts.length >= 3) {
      // Assume format: "Street Number, PostalCode City, Country"
      const streetPart = parts[0];
      const cityPart = parts[1];
      const country = parts[2] || 'Germany';
      
      // Extract house number from street
      const streetMatch = streetPart.match(/^(.+?)\s+(\d+[a-zA-Z]?)$/);
      if (streetMatch) {
        this._addressData.street = streetMatch[1];
        this._addressData.houseNumber = streetMatch[2];
      } else {
        this._addressData.street = streetPart;
      }
      
      // Extract postal code and city
      const cityMatch = cityPart.match(/^(\d{5})\s+(.+)$/);
      if (cityMatch) {
        this._addressData.postalCode = cityMatch[1];
        this._addressData.city = cityMatch[2];
      } else {
        this._addressData.city = cityPart;
      }
      
      this._addressData.country = country;
    }
  }

  getFormattedAddress() {
    const { street, houseNumber, postalCode, city, state, country } = this._addressData;
    
    const streetLine = [street, houseNumber].filter(Boolean).join(' ');
    const cityLine = [postalCode, city].filter(Boolean).join(' ');
    const stateLine = state ? `, ${state}` : '';
    const countryLine = country && country !== 'Germany' ? `, ${country}` : '';
    
    return [streetLine, cityLine + stateLine + countryLine].filter(Boolean).join(', ');
  }

  // Validation
  validate() {
    this._errors = [];
    this._isValid = true;

    const required = this.hasAttribute('required');
    const { street, houseNumber, postalCode, city } = this._addressData;

    if (required) {
      if (!street || street.trim() === '') {
        this._errors.push('Street is required');
        this._isValid = false;
      }
      
      if (!city || city.trim() === '') {
        this._errors.push('City is required');
        this._isValid = false;
      }
      
      if (!postalCode || postalCode.trim() === '') {
        this._errors.push('Postal code is required');
        this._isValid = false;
      }
    }

    // Postal code format validation (German format)
    if (postalCode && !/^\d{5}$/.test(postalCode)) {
      this._errors.push('Postal code must be 5 digits');
      this._isValid = false;
    }

    // House number validation
    if (houseNumber && !/^\d+[a-zA-Z]?$/.test(houseNumber)) {
      this._errors.push('Invalid house number format');
      this._isValid = false;
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

  updateVisualState() {
    const inputs = this.shadowRoot?.querySelectorAll('.lyd-address__field');
    if (inputs) {
      inputs.forEach(input => {
        input.classList.toggle('lyd-address__field--invalid', !this._isValid && this._touched);
      });
    }
  }

  // Event Handlers
  setupEventListeners() {
    const inputs = this.shadowRoot?.querySelectorAll('.lyd-address__field');
    if (inputs) {
      inputs.forEach(input => {
        input.addEventListener('input', (e) => this.handleFieldInput(e));
        input.addEventListener('blur', (e) => this.handleFieldBlur(e));
        input.addEventListener('focus', (e) => this.handleFieldFocus(e));
      });
    }

    // Autocomplete functionality
    if (this.hasAttribute('enable-autocomplete')) {
      this.setupAutocomplete();
    }
  }

  handleFieldInput(event) {
    const field = event.target.dataset.field;
    const value = event.target.value;
    
    this._addressData[field] = value;
    
    if (this._internals) {
      this._internals.setFormValue(this.getFormattedAddress());
    }
    
    this.dispatchEvent(new CustomEvent('input', {
      detail: { 
        field,
        value,
        addressData: this._addressData,
        formattedAddress: this.getFormattedAddress()
      },
      bubbles: true
    }));
  }

  handleFieldBlur(event) {
    this._touched = true;
    this.validate();
    
    // Auto-complete postal code lookup
    if (event.target.dataset.field === 'postalCode' && this.hasAttribute('enable-autocomplete')) {
      this.lookupPostalCode(event.target.value);
    }
    
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { 
        field: event.target.dataset.field,
        addressData: this._addressData 
      },
      bubbles: true
    }));
  }

  handleFieldFocus(event) {
    this.dispatchEvent(new CustomEvent('focus', {
      detail: { 
        field: event.target.dataset.field,
        addressData: this._addressData 
      },
      bubbles: true
    }));
  }

  // Autocomplete functionality
  setupAutocomplete() {
    // This would integrate with a geocoding service like Google Maps API
    // For now, we'll implement basic postal code lookup
  }

  async lookupPostalCode(postalCode) {
    if (!/^\d{5}$/.test(postalCode)) return;
    
    // Mock postal code lookup - in real implementation, use a geocoding service
    const postalCodeData = this.getPostalCodeData(postalCode);
    if (postalCodeData) {
      this._addressData.city = postalCodeData.city;
      this._addressData.state = postalCodeData.state;
      this.updateInputFields();
    }
  }

  getPostalCodeData(postalCode) {
    // Mock data - replace with real API call
    const mockData = {
      '80331': { city: 'München', state: 'Bayern' },
      '10115': { city: 'Berlin', state: 'Berlin' },
      '20095': { city: 'Hamburg', state: 'Hamburg' },
      '50667': { city: 'Köln', state: 'Nordrhein-Westfalen' },
      '60311': { city: 'Frankfurt am Main', state: 'Hessen' }
    };
    
    return mockData[postalCode];
  }

  updateInputFields() {
    const inputs = this.shadowRoot?.querySelectorAll('.lyd-address__field');
    if (inputs) {
      inputs.forEach(input => {
        const field = input.dataset.field;
        if (this._addressData[field] !== undefined) {
          input.value = this._addressData[field];
        }
      });
    }
  }

  // Render method
  render() {
    const label = this.getAttribute('label') || 'Address';
    const description = this.getAttribute('description');
    const helperText = this.getAttribute('helper-text');
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'medium';
    const fullWidth = this.hasAttribute('full-width');
    const compactMode = this.hasAttribute('compact-mode');
    const showMap = this.hasAttribute('show-map');
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');

    const fieldClass = `lyd-address__field lyd-address__field--${size}`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${fullWidth ? 'block' : 'inline-block'};
          width: ${fullWidth ? '100%' : 'auto'};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .lyd-address {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .lyd-address__label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .lyd-address__label--required::after {
          content: ' *';
          color: #DC2626;
        }

        .lyd-address__description {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 8px;
        }

        .lyd-address__fields {
          display: grid;
          gap: 12px;
          ${compactMode ? 
            'grid-template-columns: 2fr 1fr; grid-template-areas: "street house" "postal city" "state country";' :
            'grid-template-columns: 1fr; grid-template-areas: "street" "house" "postal" "city" "state" "country";'
          }
        }

        .lyd-address__field-group {
          display: flex;
          gap: 8px;
        }

        .lyd-address__field {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          line-height: 1.5;
          background: white;
          color: #1F2937;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .lyd-address__field:focus {
          outline: none;
          border-color: #3366CC;
          box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
        }

        .lyd-address__field::placeholder {
          color: #9CA3AF;
        }

        .lyd-address__field--small {
          padding: 8px 12px;
          font-size: 14px;
        }

        .lyd-address__field--large {
          padding: 16px 20px;
          font-size: 18px;
        }

        .lyd-address__field--invalid {
          border-color: #DC2626;
        }

        .lyd-address__field--invalid:focus {
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .lyd-address__field:disabled {
          background: #F9FAFB;
          color: #6B7280;
          cursor: not-allowed;
        }

        /* Compact mode specific styles */
        .lyd-address--compact .lyd-address__fields {
          grid-template-columns: 3fr 1fr;
          grid-template-areas: 
            "street house"
            "postal city";
        }

        .lyd-address--compact .lyd-address__street {
          grid-area: street;
        }

        .lyd-address--compact .lyd-address__house {
          grid-area: house;
        }

        .lyd-address--compact .lyd-address__postal {
          grid-area: postal;
        }

        .lyd-address--compact .lyd-address__city {
          grid-area: city;
        }

        /* Map integration */
        .lyd-address__map {
          width: 100%;
          height: 200px;
          border-radius: 8px;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          font-size: 14px;
          margin-top: 16px;
        }

        /* Footer */
        .lyd-address__footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          min-height: 20px;
        }

        .lyd-address__helper {
          font-size: 12px;
          color: #6B7280;
        }

        .lyd-address__error {
          font-size: 12px;
          color: #DC2626;
        }

        .lyd-address__formatted {
          font-size: 12px;
          color: #6B7280;
          background: #F9FAFB;
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 8px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .lyd-address__fields {
            grid-template-columns: 1fr !important;
            grid-template-areas: 
              "street"
              "house"
              "postal"
              "city"
              "state"
              "country" !important;
          }
        }
      </style>

      <div class="lyd-address ${compactMode ? 'lyd-address--compact' : ''}">
        ${label ? `
          <label class="lyd-address__label ${required ? 'lyd-address__label--required' : ''}">
            ${label}
          </label>
        ` : ''}
        
        ${description ? `<div class="lyd-address__description">${description}</div>` : ''}
        
        <div class="lyd-address__fields">
          ${compactMode ? `
            <input 
              class="${fieldClass} lyd-address__street" 
              data-field="street"
              placeholder="Street name"
              value="${this._addressData.street || ''}"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass} lyd-address__house" 
              data-field="houseNumber"
              placeholder="No."
              value="${this._addressData.houseNumber || ''}"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass} lyd-address__postal" 
              data-field="postalCode"
              placeholder="Postal code"
              value="${this._addressData.postalCode || ''}"
              pattern="[0-9]{5}"
              maxlength="5"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass} lyd-address__city" 
              data-field="city"
              placeholder="City"
              value="${this._addressData.city || ''}"
              ${disabled ? 'disabled' : ''}
            />
          ` : `
            <input 
              class="${fieldClass}" 
              data-field="street"
              placeholder="Street name"
              value="${this._addressData.street || ''}"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass}" 
              data-field="houseNumber"
              placeholder="House number"
              value="${this._addressData.houseNumber || ''}"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass}" 
              data-field="postalCode"
              placeholder="Postal code"
              value="${this._addressData.postalCode || ''}"
              pattern="[0-9]{5}"
              maxlength="5"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass}" 
              data-field="city"
              placeholder="City"
              value="${this._addressData.city || ''}"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass}" 
              data-field="state"
              placeholder="State (optional)"
              value="${this._addressData.state || ''}"
              ${disabled ? 'disabled' : ''}
            />
            <input 
              class="${fieldClass}" 
              data-field="country"
              placeholder="Country"
              value="${this._addressData.country || 'Germany'}"
              ${disabled ? 'disabled' : ''}
            />
          `}
        </div>

        ${showMap ? `
          <div class="lyd-address__map">
            Map integration would appear here
          </div>
        ` : ''}

        <div class="lyd-address__formatted">
          ${this.getFormattedAddress() || 'Address will appear here...'}
        </div>
        
        <div class="lyd-address__footer">
          <div>
            ${!this._isValid && this._touched && this._errors.length > 0 ? `
              <div class="lyd-address__error">${this._errors[0]}</div>
            ` : helperText ? `
              <div class="lyd-address__helper">${helperText}</div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  // Public methods
  focus() {
    const firstInput = this.shadowRoot?.querySelector('.lyd-address__field');
    if (firstInput) firstInput.focus();
  }

  clear() {
    this._addressData = {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      state: '',
      country: 'Germany'
    };
    this.updateInputFields();
    if (this._internals) {
      this._internals.setFormValue('');
    }
  }

  checkValidity() {
    return this.validate();
  }

  reportValidity() {
    const isValid = this.validate();
    if (!isValid) {
      this.focus();
    }
    return isValid;
  }

  getAddressComponents() {
    return { ...this._addressData };
  }

  setAddressComponents(components) {
    this.value = components;
  }

  cleanup() {
    // Clean up any resources
  }
}

customElements.define('lyd-input-address', LydInputAddress);



