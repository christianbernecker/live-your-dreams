# LYD Select Component - Complete Implementation Guide

## Overview

This document provides a complete implementation guide for the LYD Select component, a highly customizable dropdown selection component designed specifically for real estate applications. The component supports single/multi-select, search functionality, grouped options, async loading, and specialized real estate data patterns.

## Architecture Overview

```
/components/select/
├── base/
│   ├── lyd-select-base.js         # Base select class
│   └── lyd-select-utils.js        # Utility functions
├── standard/
│   ├── lyd-select.js              # Main select component
│   ├── lyd-option.js              # Option component
│   └── lyd-option-group.js        # Option group component
├── specialized/
│   ├── lyd-select-property-type.js    # Property type selector
│   ├── lyd-select-location.js         # Location with districts
│   ├── lyd-select-price-range.js      # Price range selector
│   ├── lyd-select-rooms.js            # Room count selector
│   ├── lyd-select-features.js         # Property features
│   └── lyd-select-agent.js            # Agent selector
├── styles/
│   └── select-animations.css      # Dropdown animations
└── index.js                        # Export all components
```

## Phase 1: Base Select Component

### Step 1: Create Base Select Class

```javascript
// lyd-select-base.js
export class LydSelectBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Form association
    this._internals = this.attachInternals ? this.attachInternals() : null;
    
    // State management
    this._value = null;
    this._selectedOptions = [];
    this._isOpen = false;
    this._searchQuery = '';
    this._highlightedIndex = -1;
    this._options = [];
    this._filteredOptions = [];
    this._loading = false;
    this._touched = false;
    this._virtualScrollOffset = 0;
    
    // Refs
    this._triggerElement = null;
    this._dropdownElement = null;
    this._searchInputElement = null;
    this._optionsContainerElement = null;
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return [
      // Core attributes
      'name', 'value', 'placeholder', 'label',
      
      // Configuration
      'multiple', 'searchable', 'clearable', 'disabled', 'readonly', 'required',
      
      // Display options
      'max-height', 'max-items', 'min-chars', 'no-results-text',
      'loading-text', 'placeholder-search', 'show-selected-count',
      
      // Behavior
      'close-on-select', 'auto-select-first', 'virtual-scroll',
      'debounce-search', 'async', 'remote-url',
      
      // Styling
      'size', 'variant', 'state', 'full-width',
      
      // Icons
      'icon', 'show-chevron', 'show-check'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeOptions();
    this.initializeFormAssociation();
    
    // Setup resize observer for dropdown positioning
    this.setupPositionObserver();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
    }
  }

  // Core styling
  getBaseStyles() {
    return `
      :host {
        --select-height-small: 36px;
        --select-height-medium: 44px;
        --select-height-large: 52px;
        --select-padding-x: 16px;
        --select-font-size-small: 14px;
        --select-font-size-medium: 16px;
        --select-font-size-large: 18px;
        --dropdown-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        --dropdown-max-height: 320px;
        --option-height: 40px;
        --animation-duration: 200ms;
        
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

      /* Container */
      .lyd-select {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        position: relative;
      }

      /* Label */
      .lyd-select__label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 500;
        color: var(--lyd-gray-700);
        line-height: 1.5;
      }

      .lyd-select__label-required {
        color: var(--lyd-error);
      }

      /* Trigger Button */
      .lyd-select__trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: var(--select-height-medium);
        padding: 0 var(--select-padding-x);
        background: var(--lyd-white);
        border: 2px solid var(--lyd-gray-300);
        border-radius: 8px;
        font-family: inherit;
        font-size: var(--select-font-size-medium);
        color: var(--lyd-gray-900);
        cursor: pointer;
        transition: all var(--animation-duration) ease;
        user-select: none;
        outline: none;
      }

      .lyd-select__trigger:hover:not(.is-disabled) {
        border-color: var(--lyd-gray-400);
      }

      .lyd-select__trigger:focus:not(.is-disabled) {
        border-color: var(--lyd-primary);
        box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
      }

      .lyd-select__trigger.is-open {
        border-color: var(--lyd-primary);
        box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
      }

      .lyd-select__trigger.is-disabled {
        background: var(--lyd-gray-50);
        color: var(--lyd-gray-500);
        cursor: not-allowed;
      }

      /* Trigger Content */
      .lyd-select__trigger-value {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        overflow: hidden;
      }

      .lyd-select__trigger-text {
        flex: 1;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lyd-select__trigger-text.is-placeholder {
        color: var(--lyd-gray-400);
      }

      .lyd-select__trigger-tags {
        display: flex;
        gap: 4px;
        flex-wrap: nowrap;
        overflow: hidden;
      }

      .lyd-select__tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        background: var(--lyd-primary-light);
        color: var(--lyd-primary);
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
      }

      .lyd-select__tag-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        background: var(--lyd-primary);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        transition: background var(--animation-duration) ease;
      }

      .lyd-select__tag-remove:hover {
        background: var(--lyd-primary-dark);
      }

      .lyd-select__trigger-count {
        padding: 2px 8px;
        background: var(--lyd-gray-100);
        color: var(--lyd-gray-700);
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      /* Icons */
      .lyd-select__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--lyd-gray-500);
      }

      .lyd-select__icon svg {
        width: 20px;
        height: 20px;
      }

      .lyd-select__chevron {
        transition: transform var(--animation-duration) ease;
      }

      .lyd-select__chevron.is-open {
        transform: rotate(180deg);
      }

      .lyd-select__clear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 4px;
        color: var(--lyd-gray-500);
        cursor: pointer;
        transition: all var(--animation-duration) ease;
      }

      .lyd-select__clear:hover {
        background: var(--lyd-gray-100);
        color: var(--lyd-gray-700);
      }

      /* Dropdown */
      .lyd-select__dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: var(--lyd-white);
        border: 1px solid var(--lyd-gray-200);
        border-radius: 8px;
        box-shadow: var(--dropdown-shadow);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: all var(--animation-duration) ease;
        z-index: 1000;
        min-width: 100%;
        max-width: 100vw;
      }

      .lyd-select__dropdown.is-open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .lyd-select__dropdown.position-top {
        top: auto;
        bottom: calc(100% + 4px);
        transform: translateY(8px);
      }

      .lyd-select__dropdown.position-top.is-open {
        transform: translateY(0);
      }

      /* Search */
      .lyd-select__search {
        padding: 12px;
        border-bottom: 1px solid var(--lyd-gray-200);
      }

      .lyd-select__search-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--lyd-gray-300);
        border-radius: 6px;
        font-family: inherit;
        font-size: 14px;
        outline: none;
        transition: all var(--animation-duration) ease;
      }

      .lyd-select__search-input:focus {
        border-color: var(--lyd-primary);
        box-shadow: 0 0 0 2px rgba(51, 102, 204, 0.1);
      }

      /* Options Container */
      .lyd-select__options {
        max-height: var(--dropdown-max-height);
        overflow-y: auto;
        overscroll-behavior: contain;
      }

      .lyd-select__options::-webkit-scrollbar {
        width: 8px;
      }

      .lyd-select__options::-webkit-scrollbar-track {
        background: var(--lyd-gray-50);
      }

      .lyd-select__options::-webkit-scrollbar-thumb {
        background: var(--lyd-gray-300);
        border-radius: 4px;
      }

      .lyd-select__options::-webkit-scrollbar-thumb:hover {
        background: var(--lyd-gray-400);
      }

      /* Option */
      .lyd-select__option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: var(--option-height);
        padding: 10px 16px;
        cursor: pointer;
        transition: all var(--animation-duration) ease;
        user-select: none;
      }

      .lyd-select__option:hover {
        background: var(--lyd-gray-50);
      }

      .lyd-select__option.is-highlighted {
        background: var(--lyd-gray-100);
      }

      .lyd-select__option.is-selected {
        background: var(--lyd-primary-light);
        color: var(--lyd-primary);
        font-weight: 500;
      }

      .lyd-select__option.is-disabled {
        color: var(--lyd-gray-400);
        cursor: not-allowed;
        pointer-events: none;
      }

      .lyd-select__option-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .lyd-select__option-icon {
        display: flex;
        align-items: center;
        color: var(--lyd-gray-600);
      }

      .lyd-select__option-icon svg {
        width: 20px;
        height: 20px;
      }

      .lyd-select__option-text {
        flex: 1;
      }

      .lyd-select__option-label {
        display: block;
        font-size: 14px;
      }

      .lyd-select__option-description {
        display: block;
        font-size: 12px;
        color: var(--lyd-gray-500);
        margin-top: 2px;
      }

      .lyd-select__option-check {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: var(--lyd-primary);
      }

      .lyd-select__option-check svg {
        width: 16px;
        height: 16px;
      }

      /* Option Group */
      .lyd-select__group {
        border-top: 1px solid var(--lyd-gray-200);
      }

      .lyd-select__group:first-child {
        border-top: none;
      }

      .lyd-select__group-label {
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--lyd-gray-500);
        background: var(--lyd-gray-50);
      }

      /* States */
      .lyd-select__no-results {
        padding: 24px;
        text-align: center;
        color: var(--lyd-gray-500);
        font-size: 14px;
      }

      .lyd-select__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        color: var(--lyd-gray-500);
      }

      .lyd-select__loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--lyd-gray-300);
        border-top-color: var(--lyd-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Helper Text */
      .lyd-select__helper {
        font-size: 12px;
        color: var(--lyd-gray-600);
        margin-top: 4px;
      }

      .lyd-select__helper--error {
        color: var(--lyd-error);
      }

      /* Size Variants */
      :host([size="small"]) .lyd-select__trigger {
        height: var(--select-height-small);
        font-size: var(--select-font-size-small);
      }

      :host([size="large"]) .lyd-select__trigger {
        height: var(--select-height-large);
        font-size: var(--select-font-size-large);
      }

      /* Variant Styles */
      :host([variant="filled"]) .lyd-select__trigger {
        background: var(--lyd-gray-50);
        border-color: transparent;
      }

      :host([variant="filled"]) .lyd-select__trigger:hover:not(.is-disabled) {
        background: var(--lyd-gray-100);
      }

      :host([variant="underline"]) .lyd-select__trigger {
        border: none;
        border-bottom: 2px solid var(--lyd-gray-300);
        border-radius: 0;
        background: transparent;
      }

      /* State Variants */
      :host([state="error"]) .lyd-select__trigger {
        border-color: var(--lyd-error);
      }

      :host([state="success"]) .lyd-select__trigger {
        border-color: var(--lyd-success);
      }

      :host([state="warning"]) .lyd-select__trigger {
        border-color: var(--lyd-warning);
      }

      /* Virtual Scroll */
      .lyd-select__virtual-container {
        position: relative;
        overflow-y: auto;
        max-height: var(--dropdown-max-height);
      }

      .lyd-select__virtual-spacer {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        pointer-events: none;
      }

      .lyd-select__virtual-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
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

      /* Focus Visible */
      .lyd-select__trigger:focus-visible {
        outline: 2px solid var(--lyd-primary);
        outline-offset: 2px;
      }

      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        :host {
          --lyd-white: #1f2937;
          --lyd-gray-50: #111827;
          --lyd-gray-100: #1f2937;
          --lyd-gray-200: #374151;
          --lyd-gray-300: #4b5563;
          --lyd-gray-400: #6b7280;
          --lyd-gray-500: #9ca3af;
          --lyd-gray-600: #d1d5db;
          --lyd-gray-700: #e5e7eb;
          --lyd-gray-900: #f9fafb;
          --dropdown-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
      }

      /* Responsive */
      @media (max-width: 640px) {
        .lyd-select__dropdown {
          position: fixed;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: 16px 16px 0 0;
          max-height: 70vh;
        }

        .lyd-select__dropdown.is-open {
          transform: translateY(0);
        }

        .lyd-select__options {
          max-height: 50vh;
        }
      }
    `;
  }

  // Template rendering
  render() {
    const template = `
      <style>${this.getBaseStyles()}${this.getComponentStyles()}</style>
      <div class="lyd-select">
        ${this.renderLabel()}
        ${this.renderTrigger()}
        ${this.renderDropdown()}
        ${this.renderHelper()}
      </div>
    `;
    
    this.shadowRoot.innerHTML = template;
    this.cacheElements();
    this.updateDisplay();
  }

  renderLabel() {
    const label = this.getAttribute('label');
    if (!label) return '';
    
    const required = this.hasAttribute('required');
    
    return `
      <label class="lyd-select__label">
        <span>${label}</span>
        ${required ? '<span class="lyd-select__label-required">*</span>' : ''}
      </label>
    `;
  }

  renderTrigger() {
    const isOpen = this._isOpen;
    const isDisabled = this.hasAttribute('disabled');
    const placeholder = this.getAttribute('placeholder') || 'Select...';
    
    return `
      <button
        type="button"
        class="lyd-select__trigger ${isOpen ? 'is-open' : ''} ${isDisabled ? 'is-disabled' : ''}"
        aria-haspopup="listbox"
        aria-expanded="${isOpen}"
        aria-labelledby="label-${this.id}"
        ${isDisabled ? 'disabled' : ''}
      >
        <div class="lyd-select__trigger-value">
          ${this.renderTriggerContent()}
        </div>
        ${this.renderTriggerActions()}
      </button>
    `;
  }

  renderTriggerContent() {
    const placeholder = this.getAttribute('placeholder') || 'Select...';
    
    if (this.hasAttribute('multiple')) {
      return this.renderMultipleSelection();
    } else {
      return this.renderSingleSelection();
    }
  }

  renderSingleSelection() {
    const placeholder = this.getAttribute('placeholder') || 'Select...';
    const selectedOption = this._selectedOptions[0];
    
    if (!selectedOption) {
      return `<span class="lyd-select__trigger-text is-placeholder">${placeholder}</span>`;
    }
    
    const icon = selectedOption.getAttribute('icon');
    
    return `
      ${icon ? `<span class="lyd-select__icon">${this.getIcon(icon)}</span>` : ''}
      <span class="lyd-select__trigger-text">${selectedOption.textContent}</span>
    `;
  }

  renderMultipleSelection() {
    const placeholder = this.getAttribute('placeholder') || 'Select...';
    const showCount = this.hasAttribute('show-selected-count');
    
    if (this._selectedOptions.length === 0) {
      return `<span class="lyd-select__trigger-text is-placeholder">${placeholder}</span>`;
    }
    
    if (showCount) {
      return `
        <span class="lyd-select__trigger-text">
          ${this._selectedOptions.length} selected
        </span>
        <span class="lyd-select__trigger-count">
          ${this._selectedOptions.length}
        </span>
      `;
    }
    
    const maxVisible = 3;
    const visibleOptions = this._selectedOptions.slice(0, maxVisible);
    const remainingCount = this._selectedOptions.length - maxVisible;
    
    return `
      <div class="lyd-select__trigger-tags">
        ${visibleOptions.map(option => `
          <span class="lyd-select__tag">
            ${option.textContent}
            <button type="button" class="lyd-select__tag-remove" data-value="${option.value}">
              ${this.getIcon('close-small')}
            </button>
          </span>
        `).join('')}
        ${remainingCount > 0 ? `
          <span class="lyd-select__trigger-count">+${remainingCount}</span>
        ` : ''}
      </div>
    `;
  }

  renderTriggerActions() {
    const parts = [];
    
    // Clear button
    if (this.hasAttribute('clearable') && this._selectedOptions.length > 0) {
      parts.push(`
        <button type="button" class="lyd-select__clear" aria-label="Clear selection">
          ${this.getIcon('close')}
        </button>
      `);
    }
    
    // Chevron
    if (this.getAttribute('show-chevron') !== 'false') {
      parts.push(`
        <span class="lyd-select__icon lyd-select__chevron ${this._isOpen ? 'is-open' : ''}">
          ${this.getIcon('chevron-down')}
        </span>
      `);
    }
    
    return parts.join('');
  }

  renderDropdown() {
    const isOpen = this._isOpen;
    const searchable = this.hasAttribute('searchable');
    
    return `
      <div 
        class="lyd-select__dropdown ${isOpen ? 'is-open' : ''}"
        role="listbox"
        aria-multiselectable="${this.hasAttribute('multiple')}"
      >
        ${searchable ? this.renderSearch() : ''}
        ${this.renderOptions()}
      </div>
    `;
  }

  renderSearch() {
    const placeholder = this.getAttribute('placeholder-search') || 'Search...';
    
    return `
      <div class="lyd-select__search">
        <input
          type="text"
          class="lyd-select__search-input"
          placeholder="${placeholder}"
          aria-label="Search options"
        />
      </div>
    `;
  }

  renderOptions() {
    if (this._loading) {
      return `
        <div class="lyd-select__loading">
          <div class="lyd-select__loading-spinner"></div>
          <span>${this.getAttribute('loading-text') || 'Loading...'}</span>
        </div>
      `;
    }
    
    if (this._filteredOptions.length === 0) {
      return `
        <div class="lyd-select__no-results">
          ${this.getAttribute('no-results-text') || 'No results found'}
        </div>
      `;
    }
    
    if (this.hasAttribute('virtual-scroll')) {
      return this.renderVirtualOptions();
    }
    
    return `
      <div class="lyd-select__options">
        ${this.renderOptionsList()}
      </div>
    `;
  }

  renderOptionsList() {
    let html = '';
    let currentGroup = null;
    
    this._filteredOptions.forEach((option, index) => {
      const group = option.getAttribute('group');
      
      // Render group header if changed
      if (group !== currentGroup) {
        if (currentGroup !== null) {
          html += '</div>'; // Close previous group
        }
        if (group) {
          html += `
            <div class="lyd-select__group">
              <div class="lyd-select__group-label">${group}</div>
          `;
        }
        currentGroup = group;
      }
      
      html += this.renderOption(option, index);
    });
    
    // Close last group if exists
    if (currentGroup) {
      html += '</div>';
    }
    
    return html;
  }

  renderOption(option, index) {
    const value = option.getAttribute('value');
    const icon = option.getAttribute('icon');
    const description = option.getAttribute('description');
    const disabled = option.hasAttribute('disabled');
    const isSelected = this.isOptionSelected(option);
    const isHighlighted = index === this._highlightedIndex;
    const showCheck = this.getAttribute('show-check') !== 'false';
    
    return `
      <div
        class="lyd-select__option ${isSelected ? 'is-selected' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${disabled ? 'is-disabled' : ''}"
        role="option"
        aria-selected="${isSelected}"
        data-value="${value}"
        data-index="${index}"
      >
        <div class="lyd-select__option-content">
          ${icon ? `
            <span class="lyd-select__option-icon">
              ${this.getIcon(icon)}
            </span>
          ` : ''}
          <div class="lyd-select__option-text">
            <span class="lyd-select__option-label">${option.textContent}</span>
            ${description ? `
              <span class="lyd-select__option-description">${description}</span>
            ` : ''}
          </div>
        </div>
        ${isSelected && showCheck ? `
          <span class="lyd-select__option-check">
            ${this.getIcon('check')}
          </span>
        ` : ''}
      </div>
    `;
  }

  renderVirtualOptions() {
    // Virtual scrolling for large lists
    const itemHeight = parseInt(getComputedStyle(this).getPropertyValue('--option-height') || '40');
    const containerHeight = parseInt(getComputedStyle(this).getPropertyValue('--dropdown-max-height') || '320');
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalHeight = this._filteredOptions.length * itemHeight;
    
    const startIndex = Math.floor(this._virtualScrollOffset / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, this._filteredOptions.length);
    
    const visibleOptions = this._filteredOptions.slice(startIndex, endIndex);
    
    return `
      <div class="lyd-select__virtual-container" style="height: ${containerHeight}px;">
        <div class="lyd-select__virtual-spacer" style="height: ${totalHeight}px;"></div>
        <div class="lyd-select__virtual-content" style="transform: translateY(${startIndex * itemHeight}px);">
          ${visibleOptions.map((option, i) => 
            this.renderOption(option, startIndex + i)
          ).join('')}
        </div>
      </div>
    `;
  }

  renderHelper() {
    const helperText = this.getAttribute('helper-text');
    const state = this.getAttribute('state');
    
    if (!helperText) return '';
    
    return `
      <div class="lyd-select__helper ${state ? `lyd-select__helper--${state}` : ''}">
        ${helperText}
      </div>
    `;
  }

  getComponentStyles() {
    // Override in subclasses for additional styles
    return '';
  }

  // Option management
  initializeOptions() {
    this._options = Array.from(this.querySelectorAll('lyd-option'));
    this._filteredOptions = [...this._options];
    
    // Set initial value
    const value = this.getAttribute('value');
    if (value) {
      this.setValue(value);
    }
  }

  filterOptions(query) {
    if (!query) {
      this._filteredOptions = [...this._options];
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this._filteredOptions = this._options.filter(option => {
      const text = option.textContent.toLowerCase();
      const value = option.getAttribute('value').toLowerCase();
      const description = option.getAttribute('description')?.toLowerCase() || '';
      
      return text.includes(lowerQuery) || 
             value.includes(lowerQuery) || 
             description.includes(lowerQuery);
    });
  }

  selectOption(option) {
    if (!option || option.hasAttribute('disabled')) return;
    
    if (this.hasAttribute('multiple')) {
      this.toggleOption(option);
    } else {
      this.setSingleOption(option);
    }
    
    this.updateValue();
    this.updateDisplay();
    this.dispatchChangeEvent();
    
    // Close on select for single selection
    if (!this.hasAttribute('multiple') && this.getAttribute('close-on-select') !== 'false') {
      this.close();
    }
  }

  setSingleOption(option) {
    this._selectedOptions = [option];
  }

  toggleOption(option) {
    const index = this._selectedOptions.indexOf(option);
    
    if (index > -1) {
      this._selectedOptions.splice(index, 1);
    } else {
      this._selectedOptions.push(option);
    }
  }

  isOptionSelected(option) {
    return this._selectedOptions.includes(option);
  }

  updateValue() {
    if (this.hasAttribute('multiple')) {
      this._value = this._selectedOptions.map(o => o.getAttribute('value'));
    } else {
      this._value = this._selectedOptions[0]?.getAttribute('value') || null;
    }
    
    // Update form value
    if (this._internals) {
      const formValue = this.hasAttribute('multiple') 
        ? this._value.join(',') 
        : this._value;
      this._internals.setFormValue(formValue);
    }
  }

  // Event handling
  setupEventListeners() {
    // Trigger click
    this._triggerElement = this.shadowRoot.querySelector('.lyd-select__trigger');
    if (this._triggerElement) {
      this._triggerElement.addEventListener('click', (e) => {
        if (!e.target.closest('.lyd-select__clear, .lyd-select__tag-remove')) {
          this.toggle();
        }
      });
    }
    
    // Clear button
    const clearButton = this.shadowRoot.querySelector('.lyd-select__clear');
    if (clearButton) {
      clearButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clear();
      });
    }
    
    // Tag remove buttons
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.closest('.lyd-select__tag-remove')) {
        e.stopPropagation();
        const value = e.target.closest('.lyd-select__tag-remove').dataset.value;
        this.removeValue(value);
      }
    });
    
    // Option clicks
    this._optionsContainerElement = this.shadowRoot.querySelector('.lyd-select__options, .lyd-select__virtual-container');
    if (this._optionsContainerElement) {
      this._optionsContainerElement.addEventListener('click', (e) => {
        const optionElement = e.target.closest('.lyd-select__option');
        if (optionElement) {
          const value = optionElement.dataset.value;
          const option = this._options.find(o => o.getAttribute('value') === value);
          this.selectOption(option);
        }
      });
    }
    
    // Search input
    this._searchInputElement = this.shadowRoot.querySelector('.lyd-select__search-input');
    if (this._searchInputElement) {
      this._searchInputElement.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
      
      this._searchInputElement.addEventListener('keydown', (e) => {
        this.handleSearchKeydown(e);
      });
    }
    
    // Keyboard navigation
    this._triggerElement?.addEventListener('keydown', (e) => {
      this.handleTriggerKeydown(e);
    });
    
    // Click outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && this._isOpen) {
        this.close();
      }
    });
    
    // Virtual scroll
    if (this.hasAttribute('virtual-scroll') && this._optionsContainerElement) {
      this._optionsContainerElement.addEventListener('scroll', (e) => {
        this._virtualScrollOffset = e.target.scrollTop;
        this.render();
      });
    }
  }

  handleSearch(query) {
    this._searchQuery = query;
    
    // Debounce for async search
    if (this.hasAttribute('async')) {
      clearTimeout(this._searchDebounceTimer);
      const debounce = parseInt(this.getAttribute('debounce-search') || '300');
      
      this._searchDebounceTimer = setTimeout(() => {
        this.performAsyncSearch(query);
      }, debounce);
    } else {
      this.filterOptions(query);
      this.render();
    }
  }

  async performAsyncSearch(query) {
    const minChars = parseInt(this.getAttribute('min-chars') || '1');
    
    if (query.length < minChars) {
      this._filteredOptions = [];
      this.render();
      return;
    }
    
    this._loading = true;
    this.render();
    
    try {
      const url = this.getAttribute('remote-url');
      if (!url) return;
      
      const response = await fetch(`${url}?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Update options based on response
      this.updateRemoteOptions(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      this._loading = false;
      this.render();
    }
  }

  updateRemoteOptions(data) {
    // Clear existing options
    this.innerHTML = '';
    
    // Add new options
    data.forEach(item => {
      const option = document.createElement('lyd-option');
      option.setAttribute('value', item.value);
      option.textContent = item.label;
      
      if (item.icon) option.setAttribute('icon', item.icon);
      if (item.description) option.setAttribute('description', item.description);
      if (item.group) option.setAttribute('group', item.group);
      
      this.appendChild(option);
    });
    
    this.initializeOptions();
  }

  handleTriggerKeydown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!this._isOpen) {
          this.open();
        } else {
          this.navigateOptions(1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this._isOpen) {
          this.open();
        } else {
          this.navigateOptions(-1);
        }
        break;
      case 'Escape':
        if (this._isOpen) {
          e.preventDefault();
          this.close();
        }
        break;
      case 'Home':
        if (this._isOpen) {
          e.preventDefault();
          this._highlightedIndex = 0;
          this.render();
        }
        break;
      case 'End':
        if (this._isOpen) {
          e.preventDefault();
          this._highlightedIndex = this._filteredOptions.length - 1;
          this.render();
        }
        break;
    }
  }

  handleSearchKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.navigateOptions(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateOptions(-1);
        break;
      case 'Enter':
        e.preventDefault();
        if (this._highlightedIndex >= 0) {
          const option = this._filteredOptions[this._highlightedIndex];
          this.selectOption(option);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        this._triggerElement?.focus();
        break;
    }
  }

  navigateOptions(direction) {
    const count = this._filteredOptions.length;
    if (count === 0) return;
    
    if (direction === 1) {
      this._highlightedIndex = this._highlightedIndex < count - 1 
        ? this._highlightedIndex + 1 
        : 0;
    } else {
      this._highlightedIndex = this._highlightedIndex > 0 
        ? this._highlightedIndex - 1 
        : count - 1;
    }
    
    this.render();
    this.scrollToHighlighted();
  }

  scrollToHighlighted() {
    const highlightedElement = this.shadowRoot.querySelector('.lyd-select__option.is-highlighted');
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // Public API
  open() {
    if (this._isOpen || this.hasAttribute('disabled')) return;
    
    this._isOpen = true;
    this._highlightedIndex = -1;
    this.render();
    
    // Focus search if searchable
    if (this._searchInputElement) {
      setTimeout(() => this._searchInputElement.focus(), 100);
    }
    
    this.dispatchEvent(new CustomEvent('lyd-open', { bubbles: true }));
    
    // Update position
    this.updateDropdownPosition();
  }

  close() {
    if (!this._isOpen) return;
    
    this._isOpen = false;
    this._searchQuery = '';
    this.filterOptions('');
    this.render();
    
    this.dispatchEvent(new CustomEvent('lyd-close', { bubbles: true }));
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  clear() {
    this._selectedOptions = [];
    this._value = null;
    this.updateValue();
    this.updateDisplay();
    this.dispatchChangeEvent();
    this.dispatchEvent(new CustomEvent('lyd-clear', { bubbles: true }));
  }

  removeValue(value) {
    const option = this._options.find(o => o.getAttribute('value') === value);
    if (option) {
      this.toggleOption(option);
      this.updateValue();
      this.updateDisplay();
      this.dispatchChangeEvent();
    }
  }

  getValue() {
    return this._value;
  }

  setValue(value) {
    this._selectedOptions = [];
    
    if (this.hasAttribute('multiple')) {
      const values = Array.isArray(value) ? value : value.split(',');
      values.forEach(v => {
        const option = this._options.find(o => o.getAttribute('value') === v.trim());
        if (option) this._selectedOptions.push(option);
      });
    } else {
      const option = this._options.find(o => o.getAttribute('value') === value);
      if (option) this._selectedOptions = [option];
    }
    
    this.updateValue();
    this.updateDisplay();
  }

  // Utility methods
  updateDisplay() {
    if (!this._triggerElement) return;
    this.render();
  }

  updateDropdownPosition() {
    const dropdown = this.shadowRoot.querySelector('.lyd-select__dropdown');
    if (!dropdown) return;
    
    const rect = this._triggerElement.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      dropdown.classList.add('position-top');
    } else {
      dropdown.classList.remove('position-top');
    }
  }

  setupPositionObserver() {
    if ('ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(() => {
        if (this._isOpen) {
          this.updateDropdownPosition();
        }
      });
      
      this._resizeObserver.observe(this);
    }
  }

  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('lyd-change', {
      detail: { value: this._value },
      bubbles: true
    }));
  }

  cacheElements() {
    this._triggerElement = this.shadowRoot.querySelector('.lyd-select__trigger');
    this._dropdownElement = this.shadowRoot.querySelector('.lyd-select__dropdown');
    this._searchInputElement = this.shadowRoot.querySelector('.lyd-select__search-input');
    this._optionsContainerElement = this.shadowRoot.querySelector('.lyd-select__options, .lyd-select__virtual-container');
  }

  cleanup() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    clearTimeout(this._searchDebounceTimer);
  }

  handleAttributeChange(name, value) {
    // Handle specific attribute changes
    switch (name) {
      case 'value':
        this.setValue(value);
        break;
      case 'disabled':
        this.render();
        break;
    }
  }

  // Icon management
  getIcon(name) {
    const icons = {
      'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      'close': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      'close-small': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
      'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      
      // Real estate icons
      'apartment': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>',
      'house': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
      'villa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2v-7l9-6 9 6v7a2 2 0 0 1-2 2zM9 9v12M15 9v12"/></svg>',
      'location': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      'euro': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2.4a9.6 9.6 0 0 0 0 19.2M3 8h12M3 14h9"/></svg>',
      'bedroom': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8H3z"/></svg>',
      'features': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
    };
    
    return icons[name] || '';
  }

  // Form association
  initializeFormAssociation() {
    if (this._internals) {
      this._internals.setFormValue(this._value);
    }
  }
}
```

## Phase 2: Main Select Component

### Step 2: Create Main Select Component

```javascript
// lyd-select.js
import { LydSelectBase } from './lyd-select-base.js';

export class LydSelect extends LydSelectBase {
  constructor() {
    super();
  }
}

customElements.define('lyd-select', LydSelect);
```

### Step 3: Create Option Component

```javascript
// lyd-option.js
export class LydOption extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'selected', 'disabled', 'icon', 'description', 'group'];
  }

  connectedCallback() {
    // Options don't render themselves, they're rendered by the select
    if (!this.hasAttribute('value')) {
      this.setAttribute('value', this.textContent.trim());
    }
  }
}

customElements.define('lyd-option', LydOption);
```

### Step 4: Create Option Group Component

```javascript
// lyd-option-group.js
export class LydOptionGroup extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'disabled'];
  }

  connectedCallback() {
    // Set group attribute on child options
    const label = this.getAttribute('label');
    if (label) {
      const options = this.querySelectorAll('lyd-option');
      options.forEach(option => {
        option.setAttribute('group', label);
      });
    }
  }
}

customElements.define('lyd-option-group', LydOptionGroup);
```

## Phase 3: Real Estate Specialized Components

### Step 5: Property Type Selector

```javascript
// lyd-select-property-type.js
import { LydSelect } from './lyd-select.js';

export class LydSelectPropertyType extends LydSelect {
  constructor() {
    super();
    this.setAttribute('label', 'Property Type');
    this.setAttribute('placeholder', 'Select property type...');
  }

  connectedCallback() {
    // Add default property types
    this.innerHTML = `
      <lyd-option value="apartment" icon="apartment">Apartment</lyd-option>
      <lyd-option value="house" icon="house">House</lyd-option>
      <lyd-option value="penthouse" icon="apartment">Penthouse</lyd-option>
      <lyd-option value="studio" icon="apartment">Studio</lyd-option>
      <lyd-option value="villa" icon="villa">Villa</lyd-option>
      <lyd-option value="duplex" icon="apartment">Duplex</lyd-option>
      <lyd-option value="loft" icon="apartment">Loft</lyd-option>
      <lyd-option value="townhouse" icon="house">Townhouse</lyd-option>
      <lyd-option value="bungalow" icon="house">Bungalow</lyd-option>
      <lyd-option value="commercial" icon="building">Commercial</lyd-option>
      <lyd-option value="land" icon="location">Land/Plot</lyd-option>
      <lyd-option value="garage" icon="garage">Garage/Parking</lyd-option>
    `;
    
    super.connectedCallback();
  }
}

customElements.define('lyd-select-property-type', LydSelectPropertyType);
```

### Step 6: Location Selector with Districts

```javascript
// lyd-select-location.js
import { LydSelect } from './lyd-select.js';

export class LydSelectLocation extends LydSelect {
  constructor() {
    super();
    this.setAttribute('label', 'Location');
    this.setAttribute('placeholder', 'Search locations...');
    this.setAttribute('searchable', '');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'city', 'include-districts'];
  }

  connectedCallback() {
    const city = this.getAttribute('city') || 'Munich';
    
    if (city === 'Munich') {
      this.loadMunichDistricts();
    }
    
    super.connectedCallback();
  }

  loadMunichDistricts() {
    this.innerHTML = `
      <lyd-option-group label="Central Munich">
        <lyd-option value="altstadt" icon="location">Altstadt-Lehel</lyd-option>
        <lyd-option value="ludwigsvorstadt" icon="location">Ludwigsvorstadt-Isarvorstadt</lyd-option>
        <lyd-option value="maxvorstadt" icon="location">Maxvorstadt</lyd-option>
        <lyd-option value="schwabing-west" icon="location">Schwabing-West</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="North Munich">
        <lyd-option value="schwabing-freimann" icon="location">Schwabing-Freimann</lyd-option>
        <lyd-option value="milbertshofen" icon="location">Milbertshofen-Am Hart</lyd-option>
        <lyd-option value="feldmoching" icon="location">Feldmoching-Hasenbergl</lyd-option>
        <lyd-option value="moosach" icon="location">Moosach</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="East Munich">
        <lyd-option value="bogenhausen" icon="location">Bogenhausen</lyd-option>
        <lyd-option value="trudering-riem" icon="location">Trudering-Riem</lyd-option>
        <lyd-option value="berg-am-laim" icon="location">Berg am Laim</lyd-option>
        <lyd-option value="ramersdorf" icon="location">Ramersdorf-Perlach</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="South Munich">
        <lyd-option value="sendling" icon="location">Sendling</lyd-option>
        <lyd-option value="sendling-westpark" icon="location">Sendling-Westpark</lyd-option>
        <lyd-option value="obergiesing" icon="location">Obergiesing-Fasangarten</lyd-option>
        <lyd-option value="untergiesing" icon="location">Untergiesing-Harlaching</lyd-option>
        <lyd-option value="thalkirchen" icon="location">Thalkirchen-Obersendling</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="West Munich">
        <lyd-option value="laim" icon="location">Laim</lyd-option>
        <lyd-option value="schwanthalerhoehe" icon="location">Schwanthalerhöhe</lyd-option>
        <lyd-option value="hadern" icon="location">Hadern</lyd-option>
        <lyd-option value="pasing" icon="location">Pasing-Obermenzing</lyd-option>
        <lyd-option value="aubing" icon="location">Aubing-Lochhausen</lyd-option>
        <lyd-option value="allach" icon="location">Allach-Untermenzing</lyd-option>
      </lyd-option-group>
    `;
  }
}

customElements.define('lyd-select-location', LydSelectLocation);
```

### Step 7: Price Range Selector

```javascript
// lyd-select-price-range.js
import { LydSelect } from './lyd-select.js';

export class LydSelectPriceRange extends LydSelect {
  constructor() {
    super();
    this.setAttribute('label', 'Price Range');
    this.setAttribute('placeholder', 'Select price range...');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'type', 'currency'];
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'sale';
    const currency = this.getAttribute('currency') || 'EUR';
    
    if (type === 'sale') {
      this.loadSalePrices(currency);
    } else {
      this.loadRentPrices(currency);
    }
    
    super.connectedCallback();
  }

  loadSalePrices(currency) {
    const symbol = currency === 'EUR' ? '€' : '$';
    
    this.innerHTML = `
      <lyd-option value="0-250000" icon="euro">Up to ${symbol}250,000</lyd-option>
      <lyd-option value="250000-500000" icon="euro">${symbol}250,000 - ${symbol}500,000</lyd-option>
      <lyd-option value="500000-750000" icon="euro">${symbol}500,000 - ${symbol}750,000</lyd-option>
      <lyd-option value="750000-1000000" icon="euro">${symbol}750,000 - ${symbol}1,000,000</lyd-option>
      <lyd-option value="1000000-1500000" icon="euro">${symbol}1,000,000 - ${symbol}1,500,000</lyd-option>
      <lyd-option value="1500000-2000000" icon="euro">${symbol}1,500,000 - ${symbol}2,000,000</lyd-option>
      <lyd-option value="2000000-3000000" icon="euro">${symbol}2,000,000 - ${symbol}3,000,000</lyd-option>
      <lyd-option value="3000000-5000000" icon="euro">${symbol}3,000,000 - ${symbol}5,000,000</lyd-option>
      <lyd-option value="5000000+" icon="euro">${symbol}5,000,000+</lyd-option>
    `;
  }

  loadRentPrices(currency) {
    const symbol = currency === 'EUR' ? '€' : '$';
    
    this.innerHTML = `
      <lyd-option value="0-500" icon="euro">Up to ${symbol}500</lyd-option>
      <lyd-option value="500-750" icon="euro">${symbol}500 - ${symbol}750</lyd-option>
      <lyd-option value="750-1000" icon="euro">${symbol}750 - ${symbol}1,000</lyd-option>
      <lyd-option value="1000-1500" icon="euro">${symbol}1,000 - ${symbol}1,500</lyd-option>
      <lyd-option value="1500-2000" icon="euro">${symbol}1,500 - ${symbol}2,000</lyd-option>
      <lyd-option value="2000-2500" icon="euro">${symbol}2,000 - ${symbol}2,500</lyd-option>
      <lyd-option value="2500-3500" icon="euro">${symbol}2,500 - ${symbol}3,500</lyd-option>
      <lyd-option value="3500-5000" icon="euro">${symbol}3,500 - ${symbol}5,000</lyd-option>
      <lyd-option value="5000+" icon="euro">${symbol}5,000+</lyd-option>
    `;
  }
}

customElements.define('lyd-select-price-range', LydSelectPriceRange);
```

### Step 8: Room Count Selector

```javascript
// lyd-select-rooms.js
import { LydSelect } from './lyd-select.js';

export class LydSelectRooms extends LydSelect {
  constructor() {
    super();
    this.setAttribute('label', 'Number of Rooms');
    this.setAttribute('placeholder', 'Select room count...');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'min', 'max', 'allow-half'];
  }

  connectedCallback() {
    const min = parseInt(this.getAttribute('min') || '1');
    const max = parseInt(this.getAttribute('max') || '10');
    const allowHalf = this.hasAttribute('allow-half');
    
    this.generateRoomOptions(min, max, allowHalf);
    super.connectedCallback();
  }

  generateRoomOptions(min, max, allowHalf) {
    let html = '';
    
    for (let i = min; i <= max; i++) {
      const label = i === 1 ? '1 Room' : `${i} Rooms`;
      html += `<lyd-option value="${i}" icon="bedroom">${label}</lyd-option>`;
      
      if (allowHalf && i < max) {
        html += `<lyd-option value="${i}.5" icon="bedroom">${i}.5 Rooms</lyd-option>`;
      }
    }
    
    html += `<lyd-option value="${max}+" icon="bedroom">${max}+ Rooms</lyd-option>`;
    
    this.innerHTML = html;
  }
}

customElements.define('lyd-select-rooms', LydSelectRooms);
```

### Step 9: Property Features Multi-Select

```javascript
// lyd-select-features.js
import { LydSelect } from './lyd-select.js';

export class LydSelectFeatures extends LydSelect {
  constructor() {
    super();
    this.setAttribute('label', 'Property Features');
    this.setAttribute('placeholder', 'Select features...');
    this.setAttribute('multiple', '');
    this.setAttribute('show-selected-count', '');
  }

  connectedCallback() {
    this.loadFeatures();
    super.connectedCallback();
  }

  loadFeatures() {
    this.innerHTML = `
      <lyd-option-group label="Outdoor">
        <lyd-option value="balcony" icon="features">Balcony</lyd-option>
        <lyd-option value="terrace" icon="features">Terrace</lyd-option>
        <lyd-option value="garden" icon="features">Garden</lyd-option>
        <lyd-option value="roof-terrace" icon="features">Roof Terrace</lyd-option>
        <lyd-option value="loggia" icon="features">Loggia</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="Parking">
        <lyd-option value="garage" icon="features">Garage</lyd-option>
        <lyd-option value="parking-space" icon="features">Parking Space</lyd-option>
        <lyd-option value="underground-parking" icon="features">Underground Parking</lyd-option>
        <lyd-option value="carport" icon="features">Carport</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="Building Features">
        <lyd-option value="elevator" icon="features">Elevator</lyd-option>
        <lyd-option value="barrier-free" icon="features">Barrier-Free</lyd-option>
        <lyd-option value="guest-toilet" icon="features">Guest Toilet</lyd-option>
        <lyd-option value="cellar" icon="features">Cellar</lyd-option>
        <lyd-option value="storage" icon="features">Storage Room</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="Amenities">
        <lyd-option value="fitted-kitchen" icon="features">Fitted Kitchen</lyd-option>
        <lyd-option value="fireplace" icon="features">Fireplace</lyd-option>
        <lyd-option value="sauna" icon="features">Sauna</lyd-option>
        <lyd-option value="pool" icon="features">Swimming Pool</lyd-option>
        <lyd-option value="air-conditioning" icon="features">Air Conditioning</lyd-option>
        <lyd-option value="floor-heating" icon="features">Floor Heating</lyd-option>
      </lyd-option-group>
      
      <lyd-option-group label="Security">
        <lyd-option value="alarm-system" icon="features">Alarm System</lyd-option>
        <lyd-option value="video-intercom" icon="features">Video Intercom</lyd-option>
        <lyd-option value="concierge" icon="features">Concierge Service</lyd-option>
      </lyd-option-group>
    `;
  }
}

customElements.define('lyd-select-features', LydSelectFeatures);
```

### Step 10: Agent Selector

```javascript
// lyd-select-agent.js
import { LydSelect } from './lyd-select.js';

export class LydSelectAgent extends LydSelect {
  constructor() {
    super();
    this.setAttribute('label', 'Assigned Agent');
    this.setAttribute('placeholder', 'Select agent...');
    this.setAttribute('searchable', '');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'team-id', 'show-avatar', 'show-status'];
  }

  connectedCallback() {
    // In production, this would load from API
    this.loadAgents();
    super.connectedCallback();
  }

  async loadAgents() {
    // Mock data - replace with API call
    const agents = [
      { id: 'agent-1', name: 'Max Mustermann', status: 'available', specialization: 'Residential Sales' },
      { id: 'agent-2', name: 'Anna Schmidt', status: 'busy', specialization: 'Luxury Properties' },
      { id: 'agent-3', name: 'Thomas Weber', status: 'available', specialization: 'Commercial Real Estate' },
      { id: 'agent-4', name: 'Sarah Meyer', status: 'available', specialization: 'Rentals' },
      { id: 'agent-5', name: 'Michael Wagner', status: 'offline', specialization: 'New Developments' }
    ];
    
    this.innerHTML = agents.map(agent => `
      <lyd-option 
        value="${agent.id}"
        description="${agent.specialization}"
        ${agent.status === 'offline' ? 'disabled' : ''}
      >
        ${agent.name} ${this.getAttribute('show-status') ? `(${agent.status})` : ''}
      </lyd-option>
    `).join('');
  }

  getComponentStyles() {
    return `
      .lyd-select__option-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--lyd-gray-200);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: var(--lyd-gray-700);
      }

      .lyd-select__option-status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-left: 8px;
      }

      .lyd-select__option-status--available {
        background: var(--lyd-success);
      }

      .lyd-select__option-status--busy {
        background: var(--lyd-warning);
      }

      .lyd-select__option-status--offline {
        background: var(--lyd-gray-400);
      }
    `;
  }
}

customElements.define('lyd-select-agent', LydSelectAgent);
```

## Phase 4: Export All Components

### Step 11: Create Index File

```javascript
// index.js
// Base components
export { LydSelectBase } from './base/lyd-select-base.js';
export { LydSelect } from './standard/lyd-select.js';
export { LydOption } from './standard/lyd-option.js';
export { LydOptionGroup } from './standard/lyd-option-group.js';

// Specialized components
export { LydSelectPropertyType } from './specialized/lyd-select-property-type.js';
export { LydSelectLocation } from './specialized/lyd-select-location.js';
export { LydSelectPriceRange } from './specialized/lyd-select-price-range.js';
export { LydSelectRooms } from './specialized/lyd-select-rooms.js';
export { LydSelectFeatures } from './specialized/lyd-select-features.js';
export { LydSelectAgent } from './specialized/lyd-select-agent.js';

// Auto-register all components
import './standard/lyd-select.js';
import './standard/lyd-option.js';
import './standard/lyd-option-group.js';
import './specialized/lyd-select-property-type.js';
import './specialized/lyd-select-location.js';
import './specialized/lyd-select-price-range.js';
import './specialized/lyd-select-rooms.js';
import './specialized/lyd-select-features.js';
import './specialized/lyd-select-agent.js';
```

## Usage Examples

### Basic Single Select

```html
<lyd-select 
  name="property-type"
  label="Property Type"
  placeholder="Choose property type..."
  required
>
  <lyd-option value="apartment">Apartment</lyd-option>
  <lyd-option value="house">House</lyd-option>
  <lyd-option value="villa">Villa</lyd-option>
</lyd-select>
```

### Multi-Select with Search

```html
<lyd-select 
  name="features"
  label="Property Features"
  placeholder="Select features..."
  multiple
  searchable
  clearable
  show-selected-count
>
  <lyd-option value="balcony">Balcony</lyd-option>
  <lyd-option value="garage">Garage</lyd-option>
  <lyd-option value="elevator">Elevator</lyd-option>
  <lyd-option value="garden">Garden</lyd-option>
</lyd-select>
```

### Grouped Options

```html
<lyd-select 
  name="location"
  label="Location"
  placeholder="Search locations..."
  searchable
>
  <lyd-option-group label="Central Munich">
    <lyd-option value="altstadt">Altstadt-Lehel</lyd-option>
    <lyd-option value="maxvorstadt">Maxvorstadt</lyd-option>
  </lyd-option-group>
  
  <lyd-option-group label="North Munich">
    <lyd-option value="schwabing">Schwabing</lyd-option>
    <lyd-option value="milbertshofen">Milbertshofen</lyd-option>
  </lyd-option-group>
</lyd-select>
```

### Async Remote Data

```html
<lyd-select 
  name="agent"
  label="Assign to Agent"
  placeholder="Search agents..."
  searchable
  async
  remote-url="/api/agents"
  min-chars="2"
  debounce-search="500"
  loading-text="Loading agents..."
  no-results-text="No agents found"
>
</lyd-select>
```

### Specialized Components

```html
<!-- Property Type Selector -->
<lyd-select-property-type name="type"></lyd-select-property-type>

<!-- Location with Districts -->
<lyd-select-location name="location" city="Munich"></lyd-select-location>

<!-- Price Range -->
<lyd-select-price-range name="price" type="sale" currency="EUR"></lyd-select-price-range>

<!-- Room Count -->
<lyd-select-rooms name="rooms" min="1" max="8" allow-half></lyd-select-rooms>

<!-- Property Features -->
<lyd-select-features name="features"></lyd-select-features>

<!-- Agent Assignment -->
<lyd-select-agent name="agent" show-status></lyd-select-agent>
```

### Next.js Integration

```typescript
// app/components/PropertySearchForm.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function PropertySearchForm() {
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // Import web components
    import('@lyd/design-system/components/select');
    
    // Add event listeners
    const handleSelectChange = (e: CustomEvent) => {
      console.log('Selection changed:', e.detail.value);
    };
    
    formRef.current?.addEventListener('lyd-change', handleSelectChange);
    
    return () => {
      formRef.current?.removeEventListener('lyd-change', handleSelectChange);
    };
  }, []);
  
  return (
    <form ref={formRef}>
      <lyd-select-property-type name="type" />
      <lyd-select-location name="location" city="Munich" />
      <lyd-select-price-range name="price" type="sale" />
      <lyd-select-rooms name="rooms" />
      <lyd-select-features name="features" />
    </form>
  );
}
```

## Testing Checklist

### Functional Tests
- [ ] Single selection works correctly
- [ ] Multi-selection adds/removes items
- [ ] Search filters options correctly
- [ ] Keyboard navigation (Arrow keys, Enter, Escape)
- [ ] Clear button removes all selections
- [ ] Grouped options display correctly
- [ ] Virtual scrolling handles large lists (1000+ items)
- [ ] Async loading fetches remote data
- [ ] Form submission includes select values

### Accessibility Tests
- [ ] ARIA attributes properly set
- [ ] Keyboard fully navigable
- [ ] Screen reader announces selections
- [ ] Focus states visible
- [ ] High contrast mode compatible
- [ ] Touch targets minimum 44x44px

### Performance Tests
- [ ] Component loads in < 50ms
- [ ] Search debouncing prevents excessive calls
- [ ] Virtual scroll maintains 60fps
- [ ] Memory usage stable with large datasets

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Responsive Design
- [ ] Mobile: Full-screen dropdown
- [ ] Tablet: Standard dropdown
- [ ] Desktop: Position-aware dropdown
- [ ] Touch interactions work smoothly

This complete implementation guide provides all the necessary code and patterns to build a professional, accessible, and feature-rich select component system for the LYD Design System.