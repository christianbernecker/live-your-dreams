// LYD Design System - Base Input Component
import { LYD_ICONS } from '../../icons/icon-library.js';

export class LydInputBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Form association API
    this._internals = this.attachInternals ? this.attachInternals() : null;
    
    // Internal state
    this._value = '';
    this._touched = false;
    this._dirty = false;
    this._errors = [];
    this._isValid = true;
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return [
      // Core attributes
      'type', 'name', 'value', 'placeholder',
      
      // Label & description
      'label', 'label-position', 'description', 'helper-text',
      
      // Validation
      'required', 'disabled', 'readonly', 'pattern',
      'min', 'max', 'minlength', 'maxlength', 'step',
      
      // Visual
      'variant', 'size', 'state', 'full-width',
      
      // Icons & addons
      'icon-left', 'icon-right', 'prefix', 'suffix',
      
      // Features
      'clearable', 'show-counter', 'autofocus',
      'autocomplete', 'spellcheck', 'mask'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeFormAssociation();
    
    if (this.hasAttribute('autofocus')) {
      this.focus();
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
      this.render();
    }
  }

  // Form Association API
  initializeFormAssociation() {
    if (this._internals) {
      const value = this.getAttribute('value') || '';
      this._internals.setFormValue(value);
    }
  }

  get form() {
    return this._internals ? this._internals.form : null;
  }

  get name() {
    return this.getAttribute('name');
  }

  get type() {
    return this.getAttribute('type') || 'text';
  }

  get value() {
    return this._value;
  }

  set value(val) {
    const oldValue = this._value;
    this._value = val;
    
    if (this._internals) {
      this._internals.setFormValue(val);
    }
    
    this.setAttribute('value', val);
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: val, oldValue },
      bubbles: true
    }));
    
    this.validate();
  }

  get validity() {
    return this._internals ? this._internals.validity : { valid: this._isValid };
  }

  get validationMessage() {
    return this._internals ? this._internals.validationMessage : this._errors.join(', ');
  }

  // Validation
  validate() {
    this._errors = [];
    this._isValid = true;

    const value = this._value;
    const required = this.hasAttribute('required');
    const pattern = this.getAttribute('pattern');
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const minlength = this.getAttribute('minlength');
    const maxlength = this.getAttribute('maxlength');

    // Required validation
    if (required && (!value || value.trim() === '')) {
      this._errors.push('This field is required');
      this._isValid = false;
    }

    if (value) {
      // Pattern validation
      if (pattern && !new RegExp(pattern).test(value)) {
        this._errors.push('Please match the requested format');
        this._isValid = false;
      }

      // Length validation
      if (minlength && value.length < parseInt(minlength)) {
        this._errors.push(`Minimum ${minlength} characters required`);
        this._isValid = false;
      }

      if (maxlength && value.length > parseInt(maxlength)) {
        this._errors.push(`Maximum ${maxlength} characters allowed`);
        this._isValid = false;
      }

      // Numeric validation
      if ((min || max) && this.type === 'number') {
        const numValue = parseFloat(value);
        if (min && numValue < parseFloat(min)) {
          this._errors.push(`Value must be at least ${min}`);
          this._isValid = false;
        }
        if (max && numValue > parseFloat(max)) {
          this._errors.push(`Value must be at most ${max}`);
          this._isValid = false;
        }
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

  updateVisualState() {
    const input = this.shadowRoot?.querySelector('.lyd-input__field');
    if (input) {
      input.classList.toggle('lyd-input__field--invalid', !this._isValid && this._touched);
      input.classList.toggle('lyd-input__field--valid', this._isValid && this._touched && this._value);
    }
  }

  // Event Handlers
  setupEventListeners() {
    const input = this.shadowRoot?.querySelector('.lyd-input__field');
    if (input) {
      input.addEventListener('input', (e) => this.handleInput(e));
      input.addEventListener('blur', (e) => this.handleBlur(e));
      input.addEventListener('focus', (e) => this.handleFocus(e));
      input.addEventListener('change', (e) => this.handleChange(e));
    }

    const clearButton = this.shadowRoot?.querySelector('.lyd-input__clear');
    if (clearButton) {
      clearButton.addEventListener('click', () => this.clear());
    }
  }

  handleInput(event) {
    this._dirty = true;
    this.value = event.target.value;
  }

  handleBlur(event) {
    this._touched = true;
    this.validate();
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { value: this._value },
      bubbles: true
    }));
  }

  handleFocus(event) {
    this.dispatchEvent(new CustomEvent('focus', {
      detail: { value: this._value },
      bubbles: true
    }));
  }

  handleChange(event) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this._value },
      bubbles: true
    }));
  }

  handleAttributeChange(name, value) {
    switch (name) {
      case 'value':
        if (this._value !== value) {
          this._value = value;
          if (this._internals) {
            this._internals.setFormValue(value);
          }
        }
        break;
      case 'disabled':
        if (this._internals) {
          this._internals.setFormValue(this._value, value === null ? undefined : 'disabled');
        }
        break;
    }
  }

  // Public Methods
  focus() {
    const input = this.shadowRoot?.querySelector('.lyd-input__field');
    if (input) input.focus();
  }

  blur() {
    const input = this.shadowRoot?.querySelector('.lyd-input__field');
    if (input) input.blur();
  }

  clear() {
    this.value = '';
    this.focus();
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

  // Utility Methods
  getIconHtml(iconName) {
    return LYD_ICONS[iconName] || '';
  }

  getInputAttributes() {
    const attrs = {
      type: this.type,
      value: this._value,
      placeholder: this.getAttribute('placeholder') || '',
      disabled: this.hasAttribute('disabled'),
      readonly: this.hasAttribute('readonly'),
      required: this.hasAttribute('required'),
      autocomplete: this.getAttribute('autocomplete') || 'off',
      spellcheck: this.getAttribute('spellcheck') || 'false'
    };

    // Add validation attributes
    const pattern = this.getAttribute('pattern');
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const minlength = this.getAttribute('minlength');
    const maxlength = this.getAttribute('maxlength');
    const step = this.getAttribute('step');

    if (pattern) attrs.pattern = pattern;
    if (min) attrs.min = min;
    if (max) attrs.max = max;
    if (minlength) attrs.minlength = minlength;
    if (maxlength) attrs.maxlength = maxlength;
    if (step) attrs.step = step;

    return attrs;
  }

  // Render Method
  render() {
    const label = this.getAttribute('label');
    const description = this.getAttribute('description');
    const helperText = this.getAttribute('helper-text');
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'medium';
    const state = this.getAttribute('state') || 'default';
    const fullWidth = this.hasAttribute('full-width');
    const iconLeft = this.getAttribute('icon-left');
    const iconRight = this.getAttribute('icon-right');
    const prefix = this.getAttribute('prefix');
    const suffix = this.getAttribute('suffix');
    const clearable = this.hasAttribute('clearable');
    const showCounter = this.hasAttribute('show-counter');
    const maxlength = this.getAttribute('maxlength');

    const inputAttrs = this.getInputAttributes();
    const inputAttrString = Object.entries(inputAttrs)
      .filter(([key, value]) => value !== false && value !== null && value !== undefined)
      .map(([key, value]) => value === true ? key : `${key}="${value}"`)
      .join(' ');

    const classes = [
      'lyd-input',
      `lyd-input--${variant}`,
      `lyd-input--${size}`,
      `lyd-input--${state}`,
      fullWidth ? 'lyd-input--full-width' : '',
      this.hasAttribute('disabled') ? 'lyd-input--disabled' : '',
      this.hasAttribute('readonly') ? 'lyd-input--readonly' : '',
      iconLeft ? 'lyd-input--has-icon-left' : '',
      iconRight ? 'lyd-input--has-icon-right' : '',
      prefix ? 'lyd-input--has-prefix' : '',
      suffix ? 'lyd-input--has-suffix' : ''
    ].filter(Boolean).join(' ');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${fullWidth ? 'block' : 'inline-block'};
          width: ${fullWidth ? '100%' : 'auto'};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .lyd-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .lyd-input__label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .lyd-input__label--required::after {
          content: ' *';
          color: #DC2626;
        }

        .lyd-input__description {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 8px;
        }

        .lyd-input__wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .lyd-input__field {
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

        .lyd-input__field:focus {
          outline: none;
          border-color: #3366CC;
          box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
        }

        .lyd-input__field::placeholder {
          color: #9CA3AF;
        }

        /* Sizes */
        .lyd-input--small .lyd-input__field {
          padding: 8px 12px;
          font-size: 14px;
        }

        .lyd-input--large .lyd-input__field {
          padding: 16px 20px;
          font-size: 18px;
        }

        /* States */
        .lyd-input__field--invalid {
          border-color: #DC2626;
        }

        .lyd-input__field--invalid:focus {
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .lyd-input__field--valid {
          border-color: #16A34A;
        }

        .lyd-input--disabled .lyd-input__field {
          background: #F9FAFB;
          color: #6B7280;
          cursor: not-allowed;
        }

        .lyd-input--readonly .lyd-input__field {
          background: #F9FAFB;
        }

        /* Icons */
        .lyd-input__icon {
          position: absolute;
          width: 20px;
          height: 20px;
          color: #6B7280;
          pointer-events: none;
        }

        .lyd-input__icon--left {
          left: 12px;
        }

        .lyd-input__icon--right {
          right: 12px;
        }

        .lyd-input--has-icon-left .lyd-input__field {
          padding-left: 44px;
        }

        .lyd-input--has-icon-right .lyd-input__field {
          padding-right: 44px;
        }

        /* Prefix/Suffix */
        .lyd-input__addon {
          padding: 12px 16px;
          background: #F9FAFB;
          border: 2px solid #E5E7EB;
          color: #6B7280;
          font-size: 16px;
          white-space: nowrap;
        }

        .lyd-input__prefix {
          border-right: none;
          border-radius: 8px 0 0 8px;
        }

        .lyd-input__suffix {
          border-left: none;
          border-radius: 0 8px 8px 0;
        }

        .lyd-input--has-prefix .lyd-input__field {
          border-left: none;
          border-radius: 0 8px 8px 0;
        }

        .lyd-input--has-suffix .lyd-input__field {
          border-right: none;
          border-radius: 8px 0 0 8px;
        }

        /* Clear button */
        .lyd-input__clear {
          position: absolute;
          right: 12px;
          width: 20px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6B7280;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .lyd-input__clear:hover {
          background: #F3F4F6;
          color: #374151;
        }

        /* Footer */
        .lyd-input__footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          min-height: 20px;
        }

        .lyd-input__helper {
          font-size: 12px;
          color: #6B7280;
        }

        .lyd-input__error {
          font-size: 12px;
          color: #DC2626;
        }

        .lyd-input__counter {
          font-size: 12px;
          color: #6B7280;
          flex-shrink: 0;
        }
      </style>

      <div class="${classes}">
        ${label ? `
          <label class="lyd-input__label ${this.hasAttribute('required') ? 'lyd-input__label--required' : ''}">
            ${label}
          </label>
        ` : ''}
        
        ${description ? `<div class="lyd-input__description">${description}</div>` : ''}
        
        <div class="lyd-input__wrapper">
          ${prefix ? `<div class="lyd-input__addon lyd-input__prefix">${prefix}</div>` : ''}
          
          ${iconLeft ? `<div class="lyd-input__icon lyd-input__icon--left">${this.getIconHtml(iconLeft)}</div>` : ''}
          
          <input class="lyd-input__field" ${inputAttrString} />
          
          ${clearable && this._value ? `
            <button class="lyd-input__clear" type="button" aria-label="Clear input">
              ${this.getIconHtml('close')}
            </button>
          ` : ''}
          
          ${iconRight ? `<div class="lyd-input__icon lyd-input__icon--right">${this.getIconHtml(iconRight)}</div>` : ''}
          
          ${suffix ? `<div class="lyd-input__addon lyd-input__suffix">${suffix}</div>` : ''}
        </div>
        
        <div class="lyd-input__footer">
          <div>
            ${!this._isValid && this._touched && this._errors.length > 0 ? `
              <div class="lyd-input__error">${this._errors[0]}</div>
            ` : helperText ? `
              <div class="lyd-input__helper">${helperText}</div>
            ` : ''}
          </div>
          
          ${showCounter && maxlength ? `
            <div class="lyd-input__counter">${this._value.length}/${maxlength}</div>
          ` : ''}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  cleanup() {
    // Clean up any resources
  }
}



