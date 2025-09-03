# LYD Input Components - Complete Implementation Guide

## Overview

This document provides a complete implementation guide for creating input components for the LYD Design System, inspired by the Porsche Design System v3. All components are built as Web Components for framework agnosticism and follow WCAG 2.1 AA accessibility standards.

## Architecture Overview

```
/components/inputs/
├── base/
│   ├── lyd-input-base.js          # Base class for all inputs
│   └── lyd-input-validator.js     # Validation utilities
├── standard/
│   ├── lyd-input-text.js          # Text input
│   ├── lyd-input-email.js         # Email input
│   ├── lyd-input-tel.js           # Telephone input
│   ├── lyd-input-url.js           # URL input
│   ├── lyd-input-password.js      # Password input
│   ├── lyd-input-search.js        # Search input
│   ├── lyd-input-number.js        # Number input
│   ├── lyd-input-date.js          # Date input
│   └── lyd-input-time.js          # Time input
├── specialized/
│   ├── lyd-input-price.js         # Price with currency
│   ├── lyd-input-area.js          # Area with units
│   ├── lyd-input-address.js       # Address composite
│   ├── lyd-input-rooms.js         # Room count selector
│   └── lyd-input-energy.js        # Energy rating selector
└── index.js                        # Export all components
```

## Phase 1: Base Component Implementation

### Step 1: Create Base Input Class

```javascript
// lyd-input-base.js
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

  // Getters and setters
  get value() {
    return this._value;
  }

  set value(val) {
    const newValue = String(val || '');
    if (this._value !== newValue) {
      this._value = newValue;
      this.updateInternalValue();
      this.validate();
      this.dispatchEvent(new CustomEvent('lyd-change', {
        detail: { value: newValue },
        bubbles: true
      }));
    }
  }

  get form() {
    return this._internals?.form;
  }

  get validity() {
    return this._internals?.validity || this.inputElement?.validity;
  }

  get validationMessage() {
    return this._internals?.validationMessage || this.inputElement?.validationMessage;
  }

  // Core styling
  getBaseStyles() {
    return `
      :host {
        --input-height-small: 36px;
        --input-height-medium: 44px;
        --input-height-large: 52px;
        --input-padding-x: 16px;
        --input-font-size-small: 14px;
        --input-font-size-medium: 16px;
        --input-font-size-large: 18px;
        
        display: block;
        font-family: var(--lyd-font-primary);
        position: relative;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host([full-width]) {
        width: 100%;
      }

      * {
        box-sizing: border-box;
      }

      .lyd-input {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }

      /* Label styles */
      .lyd-input__label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 500;
        color: var(--lyd-gray-700);
        line-height: 1.5;
      }

      .lyd-input__label-text {
        flex: 1;
      }

      .lyd-input__label-required {
        color: var(--lyd-error);
        font-weight: 400;
      }

      .lyd-input__label-optional {
        color: var(--lyd-gray-500);
        font-size: 12px;
        font-weight: 400;
      }

      /* Container styles */
      .lyd-input__container {
        position: relative;
        display: flex;
        align-items: center;
        background: var(--lyd-white);
        border: 2px solid var(--lyd-gray-300);
        border-radius: 8px;
        transition: all 0.2s ease;
        overflow: hidden;
        height: var(--input-height-medium);
      }

      .lyd-input__container:hover:not(.is-disabled):not(.is-readonly) {
        border-color: var(--lyd-gray-400);
      }

      .lyd-input__container:focus-within:not(.is-disabled):not(.is-readonly) {
        border-color: var(--lyd-primary);
        box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
      }

      /* Field styles */
      .lyd-input__field {
        flex: 1;
        padding: 0 var(--input-padding-x);
        border: none;
        outline: none;
        background: transparent;
        font-family: inherit;
        font-size: var(--input-font-size-medium);
        color: var(--lyd-gray-900);
        height: 100%;
        min-width: 0;
        width: 100%;
      }

      .lyd-input__field::placeholder {
        color: var(--lyd-gray-400);
      }

      .lyd-input__field::-webkit-inner-spin-button,
      .lyd-input__field::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .lyd-input__field[type="number"] {
        -moz-appearance: textfield;
      }

      /* State modifiers */
      .lyd-input__container.is-disabled {
        background: var(--lyd-gray-50);
        cursor: not-allowed;
      }

      .lyd-input__container.is-disabled .lyd-input__field {
        color: var(--lyd-gray-500);
        cursor: not-allowed;
      }

      .lyd-input__container.is-readonly .lyd-input__field {
        cursor: default;
      }

      .lyd-input__container.has-error {
        border-color: var(--lyd-error);
      }

      .lyd-input__container.has-error:focus-within {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
      }

      .lyd-input__container.has-success {
        border-color: var(--lyd-success);
      }

      .lyd-input__container.has-warning {
        border-color: var(--lyd-warning);
      }

      /* Size variants */
      :host([size="small"]) .lyd-input__container {
        height: var(--input-height-small);
      }

      :host([size="small"]) .lyd-input__field {
        font-size: var(--input-font-size-small);
      }

      :host([size="large"]) .lyd-input__container {
        height: var(--input-height-large);
      }

      :host([size="large"]) .lyd-input__field {
        font-size: var(--input-font-size-large);
      }

      /* Variant styles */
      :host([variant="filled"]) .lyd-input__container {
        background: var(--lyd-gray-50);
        border-color: transparent;
      }

      :host([variant="filled"]) .lyd-input__container:hover:not(.is-disabled) {
        background: var(--lyd-gray-100);
      }

      :host([variant="underline"]) .lyd-input__container {
        border: none;
        border-bottom: 2px solid var(--lyd-gray-300);
        border-radius: 0;
        background: transparent;
      }

      /* Icons and addons */
      .lyd-input__icon,
      .lyd-input__addon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        color: var(--lyd-gray-500);
        flex-shrink: 0;
      }

      .lyd-input__icon svg {
        width: 20px;
        height: 20px;
      }

      .lyd-input__addon {
        background: var(--lyd-gray-50);
        border-right: 1px solid var(--lyd-gray-300);
        font-size: 14px;
        font-weight: 500;
      }

      .lyd-input__addon--suffix {
        border-right: none;
        border-left: 1px solid var(--lyd-gray-300);
      }

      /* Clear button */
      .lyd-input__clear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        margin-right: 4px;
        background: transparent;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: var(--lyd-gray-500);
        transition: all 0.2s ease;
      }

      .lyd-input__clear:hover {
        background: var(--lyd-gray-100);
        color: var(--lyd-gray-700);
      }

      .lyd-input__clear svg {
        width: 16px;
        height: 16px;
      }

      /* Helper text and errors */
      .lyd-input__helper {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-height: 20px;
      }

      .lyd-input__message {
        flex: 1;
        font-size: 12px;
        line-height: 1.5;
        color: var(--lyd-gray-600);
      }

      .lyd-input__message--error {
        color: var(--lyd-error);
      }

      .lyd-input__message--success {
        color: var(--lyd-success);
      }

      .lyd-input__message--warning {
        color: var(--lyd-warning);
      }

      .lyd-input__counter {
        font-size: 12px;
        color: var(--lyd-gray-500);
        white-space: nowrap;
      }

      .lyd-input__counter--exceeded {
        color: var(--lyd-error);
      }

      /* Floating label */
      :host([label-position="floating"]) .lyd-input__label {
        position: absolute;
        top: 50%;
        left: var(--input-padding-x);
        transform: translateY(-50%);
        transition: all 0.2s ease;
        pointer-events: none;
        background: var(--lyd-white);
        padding: 0 4px;
        z-index: 1;
      }

      :host([label-position="floating"]) .lyd-input__container:focus-within ~ .lyd-input__label,
      :host([label-position="floating"]) .lyd-input__container.has-value ~ .lyd-input__label {
        top: 0;
        transform: translateY(-50%);
        font-size: 12px;
        color: var(--lyd-primary);
      }

      /* Loading state */
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .lyd-input__loading {
        animation: spin 1s linear infinite;
      }

      /* Accessibility */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Focus visible */
      .lyd-input__field:focus-visible {
        outline: none;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        :host {
          --lyd-white: #1f2937;
          --lyd-gray-50: #111827;
          --lyd-gray-100: #1f2937;
          --lyd-gray-300: #4b5563;
          --lyd-gray-400: #6b7280;
          --lyd-gray-500: #9ca3af;
          --lyd-gray-600: #d1d5db;
          --lyd-gray-700: #e5e7eb;
          --lyd-gray-900: #f9fafb;
        }
      }
    `;
  }

  // Template rendering
  render() {
    const template = `
      <style>${this.getBaseStyles()}${this.getComponentStyles()}</style>
      <div class="lyd-input">
        ${this.renderLabel()}
        <div class="lyd-input__container ${this.getContainerClasses()}">
          ${this.renderLeadingContent()}
          ${this.renderField()}
          ${this.renderTrailingContent()}
        </div>
        ${this.renderHelper()}
      </div>
    `;
    
    this.shadowRoot.innerHTML = template;
    this.cacheElements();
    this.updateFieldValue();
  }

  renderLabel() {
    const label = this.getAttribute('label');
    if (!label) return '';
    
    const required = this.hasAttribute('required');
    const labelPosition = this.getAttribute('label-position') || 'top';
    
    return `
      <label class="lyd-input__label" for="input-${this.id}">
        <span class="lyd-input__label-text">${label}</span>
        ${required ? '<span class="lyd-input__label-required">*</span>' : '<span class="lyd-input__label-optional">(optional)</span>'}
      </label>
    `;
  }

  renderField() {
    // Override in subclasses for specific input types
    return `
      <input
        type="${this.getAttribute('type') || 'text'}"
        class="lyd-input__field"
        id="input-${this.id}"
        ${this.getFieldAttributes()}
      />
    `;
  }

  renderLeadingContent() {
    const parts = [];
    
    const prefix = this.getAttribute('prefix');
    if (prefix) {
      parts.push(`<span class="lyd-input__addon">${prefix}</span>`);
    }
    
    const iconLeft = this.getAttribute('icon-left');
    if (iconLeft) {
      parts.push(`<span class="lyd-input__icon">${this.getIcon(iconLeft)}</span>`);
    }
    
    return parts.join('');
  }

  renderTrailingContent() {
    const parts = [];
    
    if (this.hasAttribute('clearable') && this.value) {
      parts.push(`
        <button type="button" class="lyd-input__clear" aria-label="Clear input">
          ${this.getIcon('close')}
        </button>
      `);
    }
    
    const iconRight = this.getAttribute('icon-right');
    if (iconRight) {
      parts.push(`<span class="lyd-input__icon">${this.getIcon(iconRight)}</span>`);
    }
    
    const suffix = this.getAttribute('suffix');
    if (suffix) {
      parts.push(`<span class="lyd-input__addon lyd-input__addon--suffix">${suffix}</span>`);
    }
    
    return parts.join('');
  }

  renderHelper() {
    const parts = [];
    
    // Error message takes priority
    if (this._errors.length > 0) {
      parts.push(`
        <div class="lyd-input__helper">
          <span class="lyd-input__message lyd-input__message--error" role="alert">
            ${this._errors[0]}
          </span>
        </div>
      `);
    } else {
      const description = this.getAttribute('description');
      const helperText = this.getAttribute('helper-text');
      const message = description || helperText;
      
      if (message) {
        parts.push(`
          <div class="lyd-input__helper">
            <span class="lyd-input__message">${message}</span>
          </div>
        `);
      }
    }
    
    // Character counter
    if (this.hasAttribute('show-counter') && this.hasAttribute('maxlength')) {
      const maxLength = parseInt(this.getAttribute('maxlength'));
      const currentLength = this.value.length;
      const exceeded = currentLength > maxLength;
      
      parts.push(`
        <span class="lyd-input__counter ${exceeded ? 'lyd-input__counter--exceeded' : ''}">
          ${currentLength}/${maxLength}
        </span>
      `);
    }
    
    return parts.join('');
  }

  // Utility methods
  getFieldAttributes() {
    const attrs = [];
    
    // Basic attributes
    if (this.hasAttribute('name')) attrs.push(`name="${this.getAttribute('name')}"`);
    if (this.hasAttribute('placeholder')) attrs.push(`placeholder="${this.getAttribute('placeholder')}"`);
    if (this.hasAttribute('disabled')) attrs.push('disabled');
    if (this.hasAttribute('readonly')) attrs.push('readonly');
    if (this.hasAttribute('required')) attrs.push('required');
    
    // Validation attributes
    if (this.hasAttribute('pattern')) attrs.push(`pattern="${this.getAttribute('pattern')}"`);
    if (this.hasAttribute('minlength')) attrs.push(`minlength="${this.getAttribute('minlength')}"`);
    if (this.hasAttribute('maxlength')) attrs.push(`maxlength="${this.getAttribute('maxlength')}"`);
    if (this.hasAttribute('min')) attrs.push(`min="${this.getAttribute('min')}"`);
    if (this.hasAttribute('max')) attrs.push(`max="${this.getAttribute('max')}"`);
    if (this.hasAttribute('step')) attrs.push(`step="${this.getAttribute('step')}"`);
    
    // Other attributes
    if (this.hasAttribute('autocomplete')) attrs.push(`autocomplete="${this.getAttribute('autocomplete')}"`);
    if (this.hasAttribute('spellcheck')) attrs.push(`spellcheck="${this.getAttribute('spellcheck')}"`);
    
    // ARIA attributes
    attrs.push(`aria-invalid="${!this._isValid}"`);
    if (this.getAttribute('description')) {
      attrs.push(`aria-describedby="helper-${this.id}"`);
    }
    
    return attrs.join(' ');
  }

  getContainerClasses() {
    const classes = [];
    
    if (this.hasAttribute('disabled')) classes.push('is-disabled');
    if (this.hasAttribute('readonly')) classes.push('is-readonly');
    if (this.value) classes.push('has-value');
    
    const state = this.getAttribute('state');
    if (state && state !== 'default') {
      classes.push(`has-${state}`);
    }
    
    return classes.join(' ');
  }

  getComponentStyles() {
    // Override in subclasses for additional styles
    return '';
  }

  // Event handling
  setupEventListeners() {
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (!input) return;
    
    // Input events
    input.addEventListener('input', (e) => {
      this.value = e.target.value;
      this._dirty = true;
      this.dispatchEvent(new CustomEvent('lyd-input', {
        detail: { value: e.target.value },
        bubbles: true
      }));
    });
    
    // Change event
    input.addEventListener('change', (e) => {
      this.value = e.target.value;
      this.validate();
    });
    
    // Focus events
    input.addEventListener('focus', () => {
      this.dispatchEvent(new CustomEvent('lyd-focus', { bubbles: true }));
    });
    
    input.addEventListener('blur', () => {
      this._touched = true;
      this.validate();
      this.dispatchEvent(new CustomEvent('lyd-blur', { bubbles: true }));
    });
    
    // Clear button
    const clearButton = this.shadowRoot.querySelector('.lyd-input__clear');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clear();
      });
    }
  }

  // Public methods
  focus() {
    this.inputElement?.focus();
  }

  blur() {
    this.inputElement?.blur();
  }

  clear() {
    this.value = '';
    this.inputElement.value = '';
    this._errors = [];
    this.render();
    this.dispatchEvent(new CustomEvent('lyd-clear', { bubbles: true }));
  }

  validate() {
    this._errors = [];
    this._isValid = true;
    
    // Native validation
    if (this.inputElement && !this.inputElement.checkValidity()) {
      this._errors.push(this.inputElement.validationMessage);
      this._isValid = false;
    }
    
    // Custom validation
    const customError = this.customValidate();
    if (customError) {
      this._errors.push(customError);
      this._isValid = false;
    }
    
    // Update form validity
    if (this._internals) {
      if (this._isValid) {
        this._internals.setValidity({});
      } else {
        this._internals.setValidity(
          { customError: true },
          this._errors[0],
          this.inputElement
        );
      }
    }
    
    this.render();
    return this._isValid;
  }

  customValidate() {
    // Override in subclasses for custom validation
    return null;
  }

  // Form association
  initializeFormAssociation() {
    if (this._internals) {
      this._internals.setFormValue(this.value);
    }
  }

  updateInternalValue() {
    if (this._internals) {
      this._internals.setFormValue(this.value);
    }
    
    if (this.inputElement) {
      this.inputElement.value = this.value;
    }
  }

  // Lifecycle
  cacheElements() {
    this.inputElement = this.shadowRoot.querySelector('.lyd-input__field');
  }

  updateFieldValue() {
    if (this.inputElement && this.value) {
      this.inputElement.value = this.value;
    }
  }

  cleanup() {
    // Remove event listeners if needed
  }

  // Icon management
  getIcon(name) {
    // Real estate specific icons
    const icons = {
      'close': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'mail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
      'phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      'calendar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      'clock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      'eye': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
      'eye-off': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>',
      'link': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      'euro': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2.4a9.6 9.6 0 0 0 0 19.2M3 8h12M3 14h9"/></svg>',
      'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
      'building': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>',
      'location': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      'area': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M9 3v18"/></svg>',
      'bedroom': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8H3z"/><path d="M7 13v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>',
      'bathroom': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12H3v9h18v-9h-2M5 12h14v9H5z"/><path d="M7 12V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7"/></svg>',
      'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
      'plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
      'minus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>'
    };
    
    return icons[name] || '';
  }
}

// Register base class
customElements.define('lyd-input-base', LydInputBase);
```

## Phase 2: Standard Input Components

### Step 2.1: Text Input

```javascript
// lyd-input-text.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputText extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'text');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'capitalize', 'lowercase', 'uppercase'];
  }

  customValidate() {
    const value = this.value.trim();
    
    // Check for profanity in property descriptions (optional)
    if (this.getAttribute('name') === 'property-title' && value.length < 10) {
      return 'Property title must be at least 10 characters';
    }
    
    return null;
  }

  handleAttributeChange(name, value) {
    super.handleAttributeChange(name, value);
    
    if (['capitalize', 'lowercase', 'uppercase'].includes(name)) {
      this.transformText();
    }
  }

  transformText() {
    if (!this.inputElement) return;
    
    let value = this.inputElement.value;
    
    if (this.hasAttribute('capitalize')) {
      value = value.replace(/\b\w/g, l => l.toUpperCase());
    } else if (this.hasAttribute('lowercase')) {
      value = value.toLowerCase();
    } else if (this.hasAttribute('uppercase')) {
      value = value.toUpperCase();
    }
    
    this.inputElement.value = value;
    this._value = value;
  }
}

customElements.define('lyd-input-text', LydInputText);
```

### Step 2.2: Email Input

```javascript
// lyd-input-email.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputEmail extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'email');
    this.setAttribute('autocomplete', 'email');
    this.setAttribute('spellcheck', 'false');
    this.setAttribute('autocapitalize', 'off');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'multiple', 'validate-domain'];
  }

  renderField() {
    return `
      <input
        type="email"
        class="lyd-input__field"
        id="input-${this.id}"
        ${this.getFieldAttributes()}
        ${this.hasAttribute('multiple') ? 'multiple' : ''}
      />
    `;
  }

  customValidate() {
    const value = this.value.trim();
    if (!value) return null;
    
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (this.hasAttribute('multiple')) {
      const emails = value.split(',').map(e => e.trim());
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          return `Invalid email format: ${email}`;
        }
      }
    } else {
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    // Domain validation for real estate agents
    if (this.hasAttribute('validate-domain')) {
      const allowedDomains = this.getAttribute('validate-domain').split(',');
      const domain = value.split('@')[1];
      
      if (!allowedDomains.includes(domain)) {
        return `Email domain must be one of: ${allowedDomains.join(', ')}`;
      }
    }
    
    return null;
  }
}

customElements.define('lyd-input-email', LydInputEmail);
```

### Step 2.3: Telephone Input

```javascript
// lyd-input-tel.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputTel extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'tel');
    this.setAttribute('autocomplete', 'tel');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'country-code', 'format'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.applyPhoneFormat();
  }

  applyPhoneFormat() {
    const format = this.getAttribute('format') || 'international';
    const countryCode = this.getAttribute('country-code') || 'DE';
    
    if (format === 'national' && countryCode === 'DE') {
      // German phone format
      this.setAttribute('placeholder', '089 12345678');
      this.setAttribute('pattern', '^[0-9]{3,5}[\\s-]?[0-9]{6,8}$');
    } else if (format === 'international') {
      this.setAttribute('placeholder', '+49 89 12345678');
      this.setAttribute('pattern', '^\\+?[1-9]\\d{1,14}$');
    }
  }

  customValidate() {
    const value = this.value.replace(/[\s-()]/g, '');
    if (!value) return null;
    
    const countryCode = this.getAttribute('country-code') || 'DE';
    
    if (countryCode === 'DE') {
      // German phone validation
      if (value.startsWith('+49')) {
        if (value.length !== 13) {
          return 'German phone numbers must be 11 digits after +49';
        }
      } else if (value.startsWith('0')) {
        if (value.length < 10 || value.length > 12) {
          return 'German phone numbers must be 10-12 digits';
        }
      } else {
        return 'Phone number must start with +49 or 0';
      }
    }
    
    return null;
  }

  formatPhoneNumber(value) {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // German format
    if (cleaned.startsWith('49')) {
      const match = cleaned.match(/^(49)(\d{2,4})(\d+)$/);
      if (match) {
        return `+${match[1]} ${match[2]} ${match[3]}`;
      }
    } else if (cleaned.startsWith('0')) {
      const match = cleaned.match(/^(0\d{2,4})(\d+)$/);
      if (match) {
        return `${match[1]} ${match[2]}`;
      }
    }
    
    return value;
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (input) {
      input.addEventListener('blur', () => {
        if (this.value) {
          this.value = this.formatPhoneNumber(this.value);
          input.value = this.value;
        }
      });
    }
  }
}

customElements.define('lyd-input-tel', LydInputTel);
```

### Step 2.4: URL Input

```javascript
// lyd-input-url.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputUrl extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'url');
    this.setAttribute('spellcheck', 'false');
    this.setAttribute('autocapitalize', 'off');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'protocols', 'auto-prefix'];
  }

  customValidate() {
    const value = this.value.trim();
    if (!value) return null;
    
    // Check allowed protocols
    const allowedProtocols = this.getAttribute('protocols')?.split(',') || ['http', 'https'];
    const protocolRegex = new RegExp(`^(${allowedProtocols.join('|')})://`);
    
    if (!protocolRegex.test(value)) {
      if (this.hasAttribute('auto-prefix')) {
        // Auto-add https:// if missing
        this.value = `https://${value}`;
        this.inputElement.value = this.value;
        return null;
      }
      return `URL must start with: ${allowedProtocols.join('://, ')}://`;
    }
    
    // Validate URL format
    try {
      new URL(value);
    } catch {
      return 'Please enter a valid URL';
    }
    
    return null;
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (input && this.hasAttribute('auto-prefix')) {
      input.addEventListener('blur', () => {
        const value = this.value.trim();
        if (value && !value.match(/^https?:\/\//)) {
          this.value = `https://${value}`;
          input.value = this.value;
        }
      });
    }
  }
}

customElements.define('lyd-input-url', LydInputUrl);
```

### Step 2.5: Password Input

```javascript
// lyd-input-password.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputPassword extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'password');
    this.setAttribute('autocomplete', 'current-password');
    this._isVisible = false;
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes, 
      'show-toggle', 
      'show-strength', 
      'min-strength',
      'require-uppercase',
      'require-lowercase', 
      'require-number',
      'require-special'
    ];
  }

  getComponentStyles() {
    return `
      .lyd-input__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        margin-right: 8px;
        background: transparent;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: var(--lyd-gray-500);
        transition: all 0.2s ease;
      }

      .lyd-input__toggle:hover {
        background: var(--lyd-gray-100);
        color: var(--lyd-gray-700);
      }

      .lyd-input__toggle svg {
        width: 20px;
        height: 20px;
      }

      .lyd-input__strength {
        display: flex;
        gap: 4px;
        margin-top: 8px;
      }

      .lyd-input__strength-bar {
        flex: 1;
        height: 4px;
        background: var(--lyd-gray-200);
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      .lyd-input__strength-bar.active {
        background: var(--strength-color);
      }

      .lyd-input__strength--weak {
        --strength-color: var(--lyd-error);
      }

      .lyd-input__strength--medium {
        --strength-color: var(--lyd-warning);
      }

      .lyd-input__strength--strong {
        --strength-color: var(--lyd-success);
      }

      .lyd-input__requirements {
        margin-top: 8px;
        font-size: 12px;
      }

      .lyd-input__requirement {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--lyd-gray-600);
        margin-top: 4px;
      }

      .lyd-input__requirement.met {
        color: var(--lyd-success);
      }

      .lyd-input__requirement svg {
        width: 12px;
        height: 12px;
      }
    `;
  }

  renderField() {
    return `
      <input
        type="${this._isVisible ? 'text' : 'password'}"
        class="lyd-input__field"
        id="input-${this.id}"
        ${this.getFieldAttributes()}
      />
    `;
  }

  renderTrailingContent() {
    const parts = [];
    
    // Toggle visibility button
    if (this.hasAttribute('show-toggle')) {
      parts.push(`
        <button 
          type="button" 
          class="lyd-input__toggle" 
          aria-label="${this._isVisible ? 'Hide password' : 'Show password'}"
        >
          ${this.getIcon(this._isVisible ? 'eye-off' : 'eye')}
        </button>
      `);
    }
    
    parts.push(super.renderTrailingContent());
    return parts.join('');
  }

  renderHelper() {
    let helperContent = super.renderHelper();
    
    // Add strength indicator
    if (this.hasAttribute('show-strength') && this.value) {
      const strength = this.calculateStrength();
      const strengthClass = strength <= 33 ? 'weak' : strength <= 66 ? 'medium' : 'strong';
      
      helperContent += `
        <div class="lyd-input__strength lyd-input__strength--${strengthClass}">
          <div class="lyd-input__strength-bar ${strength > 0 ? 'active' : ''}"></div>
          <div class="lyd-input__strength-bar ${strength > 33 ? 'active' : ''}"></div>
          <div class="lyd-input__strength-bar ${strength > 66 ? 'active' : ''}"></div>
        </div>
      `;
    }
    
    // Show requirements
    if (this.showRequirements()) {
      const requirements = this.getRequirements();
      helperContent += `
        <div class="lyd-input__requirements">
          ${requirements.map(req => `
            <div class="lyd-input__requirement ${req.met ? 'met' : ''}">
              ${this.getIcon(req.met ? 'check' : 'minus')}
              ${req.label}
            </div>
          `).join('')}
        </div>
      `;
    }
    
    return helperContent;
  }

  calculateStrength() {
    const value = this.value;
    if (!value) return 0;
    
    let strength = 0;
    
    // Length
    if (value.length >= 8) strength += 25;
    if (value.length >= 12) strength += 25;
    
    // Character types
    if (/[a-z]/.test(value)) strength += 12.5;
    if (/[A-Z]/.test(value)) strength += 12.5;
    if (/[0-9]/.test(value)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(value)) strength += 12.5;
    
    return Math.min(100, strength);
  }

  getRequirements() {
    const value = this.value || '';
    const requirements = [];
    
    const minLength = parseInt(this.getAttribute('minlength') || '8');
    requirements.push({
      label: `At least ${minLength} characters`,
      met: value.length >= minLength
    });
    
    if (this.hasAttribute('require-uppercase')) {
      requirements.push({
        label: 'One uppercase letter',
        met: /[A-Z]/.test(value)
      });
    }
    
    if (this.hasAttribute('require-lowercase')) {
      requirements.push({
        label: 'One lowercase letter',
        met: /[a-z]/.test(value)
      });
    }
    
    if (this.hasAttribute('require-number')) {
      requirements.push({
        label: 'One number',
        met: /[0-9]/.test(value)
      });
    }
    
    if (this.hasAttribute('require-special')) {
      requirements.push({
        label: 'One special character',
        met: /[^a-zA-Z0-9]/.test(value)
      });
    }
    
    return requirements;
  }

  showRequirements() {
    return this.hasAttribute('require-uppercase') ||
           this.hasAttribute('require-lowercase') ||
           this.hasAttribute('require-number') ||
           this.hasAttribute('require-special');
  }

  customValidate() {
    const value = this.value;
    if (!value) return null;
    
    // Check minimum strength
    if (this.hasAttribute('min-strength')) {
      const minStrength = parseInt(this.getAttribute('min-strength'));
      const strength = this.calculateStrength();
      
      if (strength < minStrength) {
        return 'Password is too weak';
      }
    }
    
    // Check requirements
    const requirements = this.getRequirements();
    const unmet = requirements.filter(r => !r.met);
    
    if (unmet.length > 0) {
      return `Password must have: ${unmet.map(r => r.label.toLowerCase()).join(', ')}`;
    }
    
    return null;
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    // Toggle visibility
    const toggleButton = this.shadowRoot.querySelector('.lyd-input__toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this._isVisible = !this._isVisible;
        this.render();
        
        // Maintain focus
        const input = this.shadowRoot.querySelector('.lyd-input__field');
        const cursorPosition = input.selectionStart;
        input.focus();
        input.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }
}

customElements.define('lyd-input-password', LydInputPassword);
```

### Step 2.6: Search Input

```javascript
// lyd-input-search.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputSearch extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'search');
    this.setAttribute('autocomplete', 'off');
    this._searchDebounceTimer = null;
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'debounce',
      'min-chars',
      'show-suggestions',
      'loading'
    ];
  }

  getComponentStyles() {
    return `
      .lyd-input__search-icon {
        animation: none;
      }

      .lyd-input__container.is-loading .lyd-input__search-icon {
        animation: spin 1s linear infinite;
      }

      .lyd-input__suggestions {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        max-height: 300px;
        overflow-y: auto;
        background: var(--lyd-white);
        border: 1px solid var(--lyd-gray-300);
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 100;
      }

      .lyd-input__suggestion {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--lyd-gray-100);
        transition: background 0.2s ease;
      }

      .lyd-input__suggestion:last-child {
        border-bottom: none;
      }

      .lyd-input__suggestion:hover,
      .lyd-input__suggestion.highlighted {
        background: var(--lyd-gray-50);
      }

      .lyd-input__suggestion-match {
        font-weight: 600;
        color: var(--lyd-primary);
      }

      .lyd-input__no-results {
        padding: 16px;
        text-align: center;
        color: var(--lyd-gray-500);
        font-size: 14px;
      }
    `;
  }

  renderLeadingContent() {
    // Always show search icon on the left
    return `
      <span class="lyd-input__icon lyd-input__search-icon">
        ${this.getIcon('search')}
      </span>
    `;
  }

  renderField() {
    return `
      <input
        type="search"
        class="lyd-input__field"
        id="input-${this.id}"
        ${this.getFieldAttributes()}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="${this._showSuggestions}"
        aria-controls="suggestions-${this.id}"
      />
    `;
  }

  renderSuggestions() {
    if (!this.hasAttribute('show-suggestions') || !this._suggestions) {
      return '';
    }
    
    if (this._suggestions.length === 0) {
      return `
        <div class="lyd-input__suggestions" id="suggestions-${this.id}">
          <div class="lyd-input__no-results">No results found</div>
        </div>
      `;
    }
    
    return `
      <div class="lyd-input__suggestions" id="suggestions-${this.id}" role="listbox">
        ${this._suggestions.map((item, index) => `
          <div 
            class="lyd-input__suggestion" 
            role="option"
            data-index="${index}"
            aria-selected="${index === this._highlightedIndex}"
          >
            ${this.highlightMatch(item.label, this.value)}
          </div>
        `).join('')}
      </div>
    `;
  }

  highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="lyd-input__suggestion-match">$1</span>');
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (!input) return;
    
    // Debounced search
    input.addEventListener('input', (e) => {
      const debounce = parseInt(this.getAttribute('debounce') || '300');
      
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = setTimeout(() => {
        this.performSearch(e.target.value);
      }, debounce);
    });
    
    // Keyboard navigation for suggestions
    input.addEventListener('keydown', (e) => {
      if (!this._showSuggestions || !this._suggestions) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigateSuggestions(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateSuggestions(-1);
          break;
        case 'Enter':
          if (this._highlightedIndex >= 0) {
            e.preventDefault();
            this.selectSuggestion(this._highlightedIndex);
          }
          break;
        case 'Escape':
          this.closeSuggestions();
          break;
      }
    });
    
    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeSuggestions();
      }
    });
  }

  performSearch(query) {
    const minChars = parseInt(this.getAttribute('min-chars') || '2');
    
    if (query.length < minChars) {
      this.closeSuggestions();
      return;
    }
    
    // Show loading state
    this.setAttribute('loading', 'true');
    
    // Dispatch search event
    this.dispatchEvent(new CustomEvent('lyd-search', {
      detail: { query },
      bubbles: true
    }));
    
    // In real implementation, this would call an API
    // For demo, simulate search results
    setTimeout(() => {
      this._suggestions = this.generateMockSuggestions(query);
      this._showSuggestions = true;
      this._highlightedIndex = -1;
      this.removeAttribute('loading');
      this.render();
    }, 500);
  }

  generateMockSuggestions(query) {
    // Mock real estate search suggestions
    const suggestions = [
      { label: 'Modern apartment in Munich', value: 'prop-001' },
      { label: 'Family house with garden', value: 'prop-002' },
      { label: 'Luxury penthouse downtown', value: 'prop-003' },
      { label: 'Cozy studio near university', value: 'prop-004' },
      { label: 'Office space in business district', value: 'prop-005' }
    ];
    
    return suggestions.filter(s => 
      s.label.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }

  navigateSuggestions(direction) {
    const maxIndex = this._suggestions.length - 1;
    
    if (direction === 1) {
      this._highlightedIndex = this._highlightedIndex < maxIndex 
        ? this._highlightedIndex + 1 
        : 0;
    } else {
      this._highlightedIndex = this._highlightedIndex > 0 
        ? this._highlightedIndex - 1 
        : maxIndex;
    }
    
    this.updateHighlightedSuggestion();
  }

  updateHighlightedSuggestion() {
    const suggestions = this.shadowRoot.querySelectorAll('.lyd-input__suggestion');
    suggestions.forEach((el, index) => {
      el.classList.toggle('highlighted', index === this._highlightedIndex);
    });
  }

  selectSuggestion(index) {
    const suggestion = this._suggestions[index];
    if (suggestion) {
      this.value = suggestion.label;
      this.inputElement.value = suggestion.label;
      this.closeSuggestions();
      
      this.dispatchEvent(new CustomEvent('lyd-select', {
        detail: suggestion,
        bubbles: true
      }));
    }
  }

  closeSuggestions() {
    this._showSuggestions = false;
    this._suggestions = null;
    this._highlightedIndex = -1;
    this.render();
  }
}

customElements.define('lyd-input-search', LydInputSearch);
```

### Step 2.7: Number Input

```javascript
// lyd-input-number.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputNumber extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'number');
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'show-controls',
      'format',
      'precision',
      'thousands-separator',
      'decimal-separator'
    ];
  }

  getComponentStyles() {
    return `
      .lyd-input__controls {
        display: flex;
        flex-direction: column;
        margin-right: 4px;
      }

      .lyd-input__control {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 50%;
        padding: 0;
        background: transparent;
        border: none;
        color: var(--lyd-gray-500);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .lyd-input__control:hover:not(:disabled) {
        background: var(--lyd-gray-100);
        color: var(--lyd-gray-700);
      }

      .lyd-input__control:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .lyd-input__control svg {
        width: 12px;
        height: 12px;
      }

      .lyd-input__control--increment {
        border-bottom: 1px solid var(--lyd-gray-200);
      }
    `;
  }

  renderTrailingContent() {
    const parts = [];
    
    // Number controls
    if (this.hasAttribute('show-controls')) {
      parts.push(`
        <div class="lyd-input__controls">
          <button 
            type="button" 
            class="lyd-input__control lyd-input__control--increment"
            aria-label="Increase"
            ${this.isMaxReached() ? 'disabled' : ''}
          >
            ${this.getIcon('chevron-up')}
          </button>
          <button 
            type="button" 
            class="lyd-input__control lyd-input__control--decrement"
            aria-label="Decrease"
            ${this.isMinReached() ? 'disabled' : ''}
          >
            ${this.getIcon('chevron-down')}
          </button>
        </div>
      `);
    }
    
    parts.push(super.renderTrailingContent());
    return parts.join('');
  }

  isMaxReached() {
    const max = parseFloat(this.getAttribute('max'));
    const value = parseFloat(this.value);
    return !isNaN(max) && !isNaN(value) && value >= max;
  }

  isMinReached() {
    const min = parseFloat(this.getAttribute('min'));
    const value = parseFloat(this.value);
    return !isNaN(min) && !isNaN(value) && value <= min;
  }

  formatNumber(value) {
    if (!value && value !== 0) return '';
    
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    const precision = parseInt(this.getAttribute('precision') || '2');
    const format = this.getAttribute('format');
    
    if (format === 'currency') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      }).format(num);
    }
    
    if (this.hasAttribute('thousands-separator')) {
      return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      }).format(num);
    }
    
    return num.toFixed(precision);
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    // Increment/decrement controls
    const incrementBtn = this.shadowRoot.querySelector('.lyd-input__control--increment');
    const decrementBtn = this.shadowRoot.querySelector('.lyd-input__control--decrement');
    
    if (incrementBtn) {
      incrementBtn.addEventListener('click', () => this.increment());
    }
    
    if (decrementBtn) {
      decrementBtn.addEventListener('click', () => this.decrement());
    }
    
    // Format on blur
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (input && this.getAttribute('format')) {
      input.addEventListener('blur', () => {
        if (this.value) {
          const formatted = this.formatNumber(this.value);
          input.value = formatted;
        }
      });
    }
    
    // Keyboard shortcuts
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.decrement();
      }
    });
  }

  increment() {
    const step = parseFloat(this.getAttribute('step') || '1');
    const max = parseFloat(this.getAttribute('max'));
    const current = parseFloat(this.value || '0');
    
    const newValue = current + step;
    
    if (!isNaN(max) && newValue > max) {
      this.value = max;
    } else {
      this.value = newValue;
    }
    
    this.inputElement.value = this.value;
    this.render();
  }

  decrement() {
    const step = parseFloat(this.getAttribute('step') || '1');
    const min = parseFloat(this.getAttribute('min'));
    const current = parseFloat(this.value || '0');
    
    const newValue = current - step;
    
    if (!isNaN(min) && newValue < min) {
      this.value = min;
    } else {
      this.value = newValue;
    }
    
    this.inputElement.value = this.value;
    this.render();
  }

  getIcon(name) {
    const additionalIcons = {
      'chevron-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>',
      'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>'
    };
    
    return additionalIcons[name] || super.getIcon(name);
  }
}

customElements.define('lyd-input-number', LydInputNumber);
```

### Step 2.8: Date Input

```javascript
// lyd-input-date.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputDate extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'date');
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'format',
      'locale',
      'show-calendar-icon',
      'disable-past',
      'disable-future',
      'disable-weekends',
      'blocked-dates'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupDateConstraints();
  }

  setupDateConstraints() {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.hasAttribute('disable-past')) {
      this.setAttribute('min', today);
    }
    
    if (this.hasAttribute('disable-future')) {
      this.setAttribute('max', today);
    }
  }

  renderTrailingContent() {
    const parts = [];
    
    // Calendar icon
    if (this.hasAttribute('show-calendar-icon')) {
      parts.push(`
        <span class="lyd-input__icon">
          ${this.getIcon('calendar')}
        </span>
      `);
    }
    
    parts.push(super.renderTrailingContent());
    return parts.join('');
  }

  formatDate(value) {
    if (!value) return '';
    
    const date = new Date(value);
    const format = this.getAttribute('format') || 'DD.MM.YYYY';
    const locale = this.getAttribute('locale') || 'de-DE';
    
    if (format === 'relative') {
      return this.getRelativeTime(date);
    }
    
    // Format for German locale by default
    return date.toLocaleDateString(locale);
  }

  getRelativeTime(date) {
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 0 && days <= 7) return `In ${days} days`;
    if (days < 0 && days >= -7) return `${Math.abs(days)} days ago`;
    
    return this.formatDate(date.toISOString().split('T')[0]);
  }

  customValidate() {
    const value = this.value;
    if (!value) return null;
    
    const date = new Date(value);
    const day = date.getDay();
    
    // Check if weekends are disabled
    if (this.hasAttribute('disable-weekends') && (day === 0 || day === 6)) {
      return 'Weekends are not available';
    }
    
    // Check blocked dates
    if (this.hasAttribute('blocked-dates')) {
      const blockedDates = this.getAttribute('blocked-dates').split(',');
      if (blockedDates.includes(value)) {
        return 'This date is not available';
      }
    }
    
    // Check for real estate specific validations
    if (this.getAttribute('name') === 'viewing-date') {
      const now = new Date();
      const minAdvance = 24 * 60 * 60 * 1000; // 24 hours
      
      if (date - now < minAdvance) {
        return 'Viewings must be scheduled at least 24 hours in advance';
      }
    }
    
    return null;
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (input) {
      // Show formatted date in helper text
      input.addEventListener('change', () => {
        if (this.value && this.getAttribute('format')) {
          const formatted = this.formatDate(this.value);
          this.setAttribute('helper-text', formatted);
          this.render();
        }
      });
    }
  }
}

customElements.define('lyd-input-date', LydInputDate);
```

### Step 2.9: Time Input

```javascript
// lyd-input-time.js
import { LydInputBase } from './lyd-input-base.js';

export class LydInputTime extends LydInputBase {
  constructor() {
    super();
    this.setAttribute('type', 'time');
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'format',
      'show-seconds',
      'interval',
      'min-time',
      'max-time',
      'show-clock-icon'
    ];
  }

  renderTrailingContent() {
    const parts = [];
    
    // Clock icon
    if (this.hasAttribute('show-clock-icon')) {
      parts.push(`
        <span class="lyd-input__icon">
          ${this.getIcon('clock')}
        </span>
      `);
    }
    
    parts.push(super.renderTrailingContent());
    return parts.join('');
  }

  renderField() {
    const step = this.getAttribute('interval') 
      ? parseInt(this.getAttribute('interval')) * 60 
      : null;
    
    return `
      <input
        type="time"
        class="lyd-input__field"
        id="input-${this.id}"
        ${this.getFieldAttributes()}
        ${step ? `step="${step}"` : ''}
        ${this.hasAttribute('show-seconds') ? '' : 'step="60"'}
        ${this.getAttribute('min-time') ? `min="${this.getAttribute('min-time')}"` : ''}
        ${this.getAttribute('max-time') ? `max="${this.getAttribute('max-time')}"` : ''}
      />
    `;
  }

  formatTime(value) {
    if (!value) return '';
    
    const format = this.getAttribute('format') || '24h';
    const [hours, minutes, seconds] = value.split(':').map(Number);
    
    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    return value;
  }

  customValidate() {
    const value = this.value;
    if (!value) return null;
    
    // Check business hours for viewings
    if (this.getAttribute('name') === 'viewing-time') {
      const [hours] = value.split(':').map(Number);
      
      if (hours < 9 || hours >= 18) {
        return 'Viewings are only available between 9:00 AM and 6:00 PM';
      }
      
      // Check if it's a weekend (would need date context)
      const dayOfWeek = new Date().getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (hours < 10 || hours >= 16) {
          return 'Weekend viewings are only available between 10:00 AM and 4:00 PM';
        }
      }
    }
    
    return null;
  }

  setupEventListeners() {
    super.setupEventListeners();
    
    const input = this.shadowRoot.querySelector('.lyd-input__field');
    if (input) {
      // Round to nearest interval
      input.addEventListener('change', () => {
        if (this.value && this.hasAttribute('interval')) {
          const interval = parseInt(this.getAttribute('interval'));
          const [hours, minutes] = this.value.split(':').map(Number);
          const totalMinutes = hours * 60 + minutes;
          const roundedMinutes = Math.round(totalMinutes / interval) * interval;
          
          const newHours = Math.floor(roundedMinutes / 60);
          const newMinutes = roundedMinutes % 60;
          
          this.value = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
          input.value = this.value;
        }
        
        // Show formatted time
        if (this.value && this.getAttribute('format')) {
          const formatted = this.formatTime(this.value);
          this.setAttribute('helper-text', formatted);
          this.render();
        }
      });
    }
  }
}

customElements.define('lyd-input-time', LydInputTime);
```

## Phase 3: Real Estate Specialized Components

### Step 3.1: Price Input

```javascript
// lyd-input-price.js
import { LydInputNumber } from './lyd-input-number.js';

export class LydInputPrice extends LydInputNumber {
  constructor() {
    super();
    this.setAttribute('icon-left', 'euro');
    this.setAttribute('thousands-separator', 'true');
    this.setAttribute('precision', '0');
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'currency',
      'price-type',
      'show-per-sqm',
      'area-reference'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupPriceType();
  }

  setupPriceType() {
    const priceType = this.getAttribute('price-type');
    
    if (priceType === 'rent') {
      this.setAttribute('suffix', '/month');
      this.setAttribute('label', this.getAttribute('label') || 'Monthly Rent (Cold)');
    } else if (priceType === 'sale') {
      this.setAttribute('label', this.getAttribute('label') || 'Purchase Price');
    }
  }

  renderHelper() {
    let helperContent = super.renderHelper();
    
    // Show price per square meter
    if (this.hasAttribute('show-per-sqm') && this.value) {
      const areaRef = this.getAttribute('area-reference');
      const area = document.querySelector(`[name="${areaRef}"]`)?.value;
      
      if (area && parseFloat(area) > 0) {
        const pricePerSqm = parseFloat(this.value) / parseFloat(area);
        const formatted = this.formatNumber(pricePerSqm);
        
        helperContent += `
          <div class="lyd-input__helper">
            <span class="lyd-input__message">
              ${formatted} per m²
            </span>
          </div>
        `;
      }
    }
    
    return helperContent;
  }

  customValidate() {
    const baseValidation = super.customValidate();
    if (baseValidation) return baseValidation;
    
    const value = parseFloat(this.value);
    if (!value) return null;
    
    const priceType = this.getAttribute('price-type');
    
    // Real estate price validations
    if (priceType === 'rent') {
      if (value < 100) {
        return 'Rent must be at least €100';
      }
      if (value > 50000) {
        return 'Rent seems unusually high. Please verify.';
      }
    } else if (priceType === 'sale') {
      if (value < 10000) {
        return 'Purchase price must be at least €10,000';
      }
      if (value > 100000000) {
        return 'Purchase price seems unusually high. Please verify.';
      }
    }
    
    return null;
  }
}

customElements.define('lyd-input-price', LydInputPrice);
```

### Step 3.2: Area Input

```javascript
// lyd-input-area.js
import { LydInputNumber } from './lyd-input-number.js';

export class LydInputArea extends LydInputNumber {
  constructor() {
    super();
    this.setAttribute('suffix', 'm²');
    this.setAttribute('step', '0.5');
    this.setAttribute('precision', '1');
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'area-type',
      'unit',
      'show-unit-converter',
      'auto-calculate'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupAreaType();
  }

  setupAreaType() {
    const areaType = this.getAttribute('area-type');
    
    const labels = {
      'living': 'Living Area',
      'plot': 'Plot Size',
      'usable': 'Usable Area',
      'commercial': 'Commercial Area',
      'garden': 'Garden Area',
      'terrace': 'Terrace/Balcony Area',
      'basement': 'Basement Area'
    };
    
    if (areaType && labels[areaType]) {
      this.setAttribute('label', this.getAttribute('label') || labels[areaType]);
    }
    
    // Set appropriate min/max based on type
    if (areaType === 'living') {
      this.setAttribute('min', this.getAttribute('min') || '10');
      this.setAttribute('max', this.getAttribute('max') || '1000');
    } else if (areaType === 'plot') {
      this.setAttribute('min', this.getAttribute('min') || '50');
      this.setAttribute('max', this.getAttribute('max') || '50000');
    }
  }

  convertUnit(value, fromUnit, toUnit) {
    const conversions = {
      'm²': {
        'ft²': 10.764,
        'ha': 0.0001,
        'acre': 0.000247105
      },
      'ft²': {
        'm²': 0.092903,
        'ha': 0.0000092903,
        'acre': 0.0000229568
      },
      'ha': {
        'm²': 10000,
        'ft²': 107639,
        'acre': 2.47105
      },
      'acre': {
        'm²': 4046.86,
        'ft²': 43560,
        'ha': 0.404686
      }
    };
    
    if (fromUnit === toUnit) return value;
    if (!conversions[fromUnit] || !conversions[fromUnit][toUnit]) return value;
    
    return value * conversions[fromUnit][toUnit];
  }

  customValidate() {
    const baseValidation = super.customValidate();
    if (baseValidation) return baseValidation;
    
    const value = parseFloat(this.value);
    if (!value) return null;
    
    const areaType = this.getAttribute('area-type');
    
    // Area-specific validations
    if (areaType === 'living' && value < 15) {
      return 'Living area must be at least 15 m²';
    }
    
    // Check for unrealistic values
    if (areaType === 'living' && value > 2000) {
      return 'Living area seems unusually large. Please verify.';
    }
    
    if (areaType === 'terrace' && value > 200) {
      return 'Terrace area seems unusually large. Please verify.';
    }
    
    return null;
  }
}

customElements.define('lyd-input-area', LydInputArea);
```

### Step 3.3: Composite Address Input

```javascript
// lyd-input-address.js
export class LydInputAddress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.addressData = {
      street: '',
      houseNumber: '',
      zipCode: '',
      city: '',
      district: '',
      country: 'Germany'
    };
  }

  static get observedAttributes() {
    return [
      'name',
      'required',
      'disabled',
      'show-map',
      'autocomplete-service',
      'validate-address',
      'country'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    if (this.hasAttribute('autocomplete-service')) {
      this.initializeAutocomplete();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--lyd-font-primary);
        }

        .lyd-address {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lyd-address__title {
          font-size: 16px;
          font-weight: 600;
          color: var(--lyd-gray-700);
          margin-bottom: 8px;
        }

        .lyd-address__row {
          display: grid;
          gap: 12px;
        }

        .lyd-address__row--street {
          grid-template-columns: 2fr 1fr;
        }

        .lyd-address__row--location {
          grid-template-columns: 120px 1fr 1fr;
        }

        .lyd-address__row--country {
          grid-template-columns: 1fr;
        }

        .lyd-address__map {
          margin-top: 16px;
          height: 300px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--lyd-gray-300);
          background: var(--lyd-gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lyd-gray-500);
        }

        .lyd-address__validation {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: var(--lyd-gray-50);
          border-radius: 8px;
          font-size: 14px;
        }

        .lyd-address__validation--success {
          background: var(--lyd-success-light);
          color: var(--lyd-success);
        }

        .lyd-address__validation--error {
          background: var(--lyd-error-light);
          color: var(--lyd-error);
        }

        @media (max-width: 640px) {
          .lyd-address__row--street,
          .lyd-address__row--location {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="lyd-address">
        <div class="lyd-address__title">Property Address</div>
        
        <div class="lyd-address__row lyd-address__row--street">
          <lyd-input-text
            name="${this.getAttribute('name')}-street"
            label="Street"
            placeholder="Maximilianstraße"
            icon-left="location"
            ${this.hasAttribute('required') ? 'required' : ''}
            ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          </lyd-input-text>
          
          <lyd-input-text
            name="${this.getAttribute('name')}-number"
            label="House Number"
            placeholder="42a"
            ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          </lyd-input-text>
        </div>
        
        <div class="lyd-address__row lyd-address__row--location">
          <lyd-input-text
            name="${this.getAttribute('name')}-zip"
            label="ZIP Code"
            placeholder="80539"
            pattern="[0-9]{5}"
            maxlength="5"
            ${this.hasAttribute('required') ? 'required' : ''}
            ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          </lyd-input-text>
          
          <lyd-input-text
            name="${this.getAttribute('name')}-city"
            label="City"
            placeholder="Munich"
            ${this.hasAttribute('required') ? 'required' : ''}
            ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          </lyd-input-text>
          
          <lyd-input-text
            name="${this.getAttribute('name')}-district"
            label="District"
            placeholder="Maxvorstadt"
            ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          </lyd-input-text>
        </div>
        
        <div class="lyd-address__row lyd-address__row--country">
          <lyd-input-text
            name="${this.getAttribute('name')}-country"
            label="Country"
            value="${this.getAttribute('country') || 'Germany'}"
            ${this.hasAttribute('required') ? 'required' : ''}
            ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          </lyd-input-text>
        </div>

        ${this.hasAttribute('validate-address') ? this.renderValidation() : ''}
        ${this.hasAttribute('show-map') ? this.renderMap() : ''}
      </div>
    `;
  }

  renderValidation() {
    return `
      <div class="lyd-address__validation" id="validation" style="display: none;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6M12 16h.01"/>
        </svg>
        <span id="validation-message">Validating address...</span>
      </div>
    `;
  }

  renderMap() {
    return `
      <div class="lyd-address__map" id="map">
        <span>Map preview will appear here</span>
      </div>
    `;
  }

  setupEventListeners() {
    const inputs = this.shadowRoot.querySelectorAll('lyd-input-text');
    
    inputs.forEach(input => {
      input.addEventListener('lyd-change', (e) => {
        const field = input.getAttribute('name').split('-').pop();
        this.addressData[field] = e.detail.value;
        
        this.dispatchEvent(new CustomEvent('lyd-address-change', {
          detail: this.addressData,
          bubbles: true
        }));
        
        // Validate address if all required fields are filled
        if (this.hasAttribute('validate-address') && this.isComplete()) {
          this.validateAddress();
        }
        
        // Update map if shown
        if (this.hasAttribute('show-map') && this.isComplete()) {
          this.updateMap();
        }
      });
    });
  }

  initializeAutocomplete() {
    const service = this.getAttribute('autocomplete-service');
    
    // Implementation would integrate with Google Places, Mapbox, or similar
    console.log(`Initializing ${service} autocomplete`);
  }

  isComplete() {
    return this.addressData.street && 
           this.addressData.zipCode && 
           this.addressData.city;
  }

  async validateAddress() {
    const validation = this.shadowRoot.querySelector('#validation');
    const message = this.shadowRoot.querySelector('#validation-message');
    
    if (!validation) return;
    
    validation.style.display = 'flex';
    validation.className = 'lyd-address__validation';
    message.textContent = 'Validating address...';
    
    // Simulate API call
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // Mock validation
      
      if (isValid) {
        validation.className = 'lyd-address__validation lyd-address__validation--success';
        message.textContent = 'Address validated successfully';
      } else {
        validation.className = 'lyd-address__validation lyd-address__validation--error';
        message.textContent = 'Address could not be validated. Please check the details.';
      }
    }, 1000);
  }

  updateMap() {
    // Would integrate with map service
    console.log('Updating map with address:', this.addressData);
  }

  getValue() {
    return this.addressData;
  }

  setValue(data) {
    this.addressData = { ...this.addressData, ...data };
    this.render();
  }
}

customElements.define('lyd-input-address', LydInputAddress);
```

## Phase 4: Documentation Page

### Step 4: Create comprehensive documentation page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Input Components - LYD Design System</title>
    
    <!-- Import all components -->
    <script type="module">
        import './components/inputs/index.js';
    </script>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./styles/design-tokens.css">
    <link rel="stylesheet" href="./styles/documentation.css">
</head>
<body>
    <!-- Documentation page structure as shown in previous examples -->
</body>
</html>
```

## Phase 5: Testing & Implementation Checklist

### Testing Checklist

#### Functional Tests
- [ ] All 9 standard input types work correctly (text, email, tel, url, password, search, number, date, time)