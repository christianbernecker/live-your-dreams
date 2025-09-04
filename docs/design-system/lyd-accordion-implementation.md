# LYD Accordion Component - Complete Implementation Guide

## Overview

This document provides a complete implementation guide for the LYD Accordion component system, designed specifically for real estate applications. The system includes standard accordions, specialized property detail accordions, FAQ sections, document viewers, and timeline displays for viewing schedules.

## Architecture Overview

```
/components/accordion/
├── base/
│   ├── lyd-accordion-base.js       # Base accordion class
│   └── lyd-accordion-utils.js      # Utility functions
├── standard/
│   ├── lyd-accordion.js            # Single accordion
│   ├── lyd-accordion-group.js      # Accordion group
│   └── lyd-accordion-item.js       # Accordion item for groups
├── specialized/
│   ├── lyd-accordion-property.js   # Property details accordion
│   ├── lyd-accordion-floor.js      # Floor plan accordion
│   ├── lyd-accordion-documents.js  # Document viewer accordion
│   ├── lyd-accordion-faq.js        # FAQ accordion
│   ├── lyd-accordion-timeline.js   # Timeline/schedule accordion
│   └── lyd-accordion-features.js   # Property features accordion
├── styles/
│   └── accordion-animations.css    # Expand/collapse animations
└── index.js                         # Export all components
```

## Phase 1: Base Accordion Component

### Step 1: Create Base Accordion Class

```javascript
// lyd-accordion-base.js
export class LydAccordionBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // State management
    this._isOpen = false;
    this._isAnimating = false;
    this._contentHeight = 0;
    this._id = this.generateId();
    
    // Refs
    this._headerElement = null;
    this._contentElement = null;
    this._iconElement = null;
  }

  static get observedAttributes() {
    return [
      // Core
      'heading', 'open', 'disabled',
      
      // Appearance
      'variant', 'size', 'icon', 'icon-position',
      'show-arrow', 'arrow-position', 'flush',
      
      // Behavior
      'animate', 'duration', 'easing',
      'lazy-load', 'stay-open', 'collapsible',
      
      // Advanced
      'sticky', 'sticky-offset', 'expandable-icon',
      'badge', 'badge-variant', 'status',
      
      // Content
      'loading', 'empty-text', 'max-height'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeState();
    
    // Setup mutation observer for content changes
    this.setupContentObserver();
    
    // Setup resize observer for animations
    this.setupResizeObserver();
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
        --accordion-border-color: var(--lyd-gray-300);
        --accordion-bg-color: var(--lyd-white);
        --accordion-header-height: 56px;
        --accordion-padding-x: 24px;
        --accordion-padding-y: 16px;
        --accordion-icon-size: 24px;
        --accordion-animation-duration: 300ms;
        --accordion-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
        
        display: block;
        font-family: var(--lyd-font-primary);
        position: relative;
      }

      :host([hidden]) {
        display: none !important;
      }

      * {
        box-sizing: border-box;
      }

      /* Container */
      .lyd-accordion {
        background: var(--accordion-bg-color);
        border: 1px solid var(--accordion-border-color);
        border-radius: 12px;
        overflow: hidden;
        transition: box-shadow 0.2s ease;
      }

      :host([flush]) .lyd-accordion {
        border-radius: 0;
        border-left: none;
        border-right: none;
      }

      :host([variant="minimal"]) .lyd-accordion {
        border: none;
        background: transparent;
      }

      :host([variant="card"]) .lyd-accordion {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: none;
      }

      :host([variant="card"]):hover .lyd-accordion {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      /* Header */
      .lyd-accordion__header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: var(--accordion-header-height);
        padding: var(--accordion-padding-y) var(--accordion-padding-x);
        background: transparent;
        border: none;
        cursor: pointer;
        width: 100%;
        text-align: left;
        font-family: inherit;
        transition: all 0.2s ease;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .lyd-accordion__header:hover:not(.is-disabled) {
        background: var(--lyd-gray-50);
      }

      .lyd-accordion__header:focus-visible {
        outline: 2px solid var(--lyd-primary);
        outline-offset: -2px;
        z-index: 1;
      }

      .lyd-accordion__header.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .lyd-accordion__header.is-open {
        background: var(--lyd-gray-50);
      }

      :host([variant="minimal"]) .lyd-accordion__header {
        padding-left: 0;
        padding-right: 0;
      }

      :host([sticky]) .lyd-accordion__header {
        position: sticky;
        top: var(--accordion-sticky-offset, 0);
        z-index: 10;
        background: var(--accordion-bg-color);
        border-bottom: 1px solid var(--accordion-border-color);
      }

      /* Header Content */
      .lyd-accordion__header-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .lyd-accordion__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--accordion-icon-size);
        height: var(--accordion-icon-size);
        color: var(--lyd-gray-600);
        flex-shrink: 0;
      }

      .lyd-accordion__icon svg {
        width: 100%;
        height: 100%;
      }

      .lyd-accordion__heading {
        flex: 1;
        font-size: 16px;
        font-weight: 600;
        color: var(--lyd-gray-900);
        line-height: 1.5;
        margin: 0;
        min-width: 0;
      }

      .lyd-accordion__heading-text {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .lyd-accordion__heading-subtitle {
        display: block;
        font-size: 14px;
        font-weight: 400;
        color: var(--lyd-gray-600);
        margin-top: 2px;
      }

      /* Badge */
      .lyd-accordion__badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        background: var(--lyd-gray-100);
        color: var(--lyd-gray-700);
        margin-left: 8px;
      }

      .lyd-accordion__badge--primary {
        background: var(--lyd-primary-light);
        color: var(--lyd-primary);
      }

      .lyd-accordion__badge--success {
        background: var(--lyd-success-light);
        color: var(--lyd-success);
      }

      .lyd-accordion__badge--warning {
        background: var(--lyd-warning-light);
        color: var(--lyd-warning);
      }

      .lyd-accordion__badge--error {
        background: var(--lyd-error-light);
        color: var(--lyd-error);
      }

      /* Status Indicator */
      .lyd-accordion__status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--lyd-gray-400);
        margin-left: 8px;
      }

      .lyd-accordion__status--active {
        background: var(--lyd-success);
      }

      .lyd-accordion__status--pending {
        background: var(--lyd-warning);
        animation: pulse 2s infinite;
      }

      .lyd-accordion__status--error {
        background: var(--lyd-error);
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* Arrow/Chevron */
      .lyd-accordion__arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--accordion-icon-size);
        height: var(--accordion-icon-size);
        color: var(--lyd-gray-500);
        transition: transform var(--accordion-animation-duration) var(--accordion-animation-easing);
        flex-shrink: 0;
      }

      .lyd-accordion__arrow svg {
        width: 20px;
        height: 20px;
      }

      .lyd-accordion__arrow.is-open {
        transform: rotate(180deg);
      }

      :host([arrow-position="left"]) .lyd-accordion__header {
        flex-direction: row-reverse;
      }

      :host([arrow-position="left"]) .lyd-accordion__arrow {
        margin-right: 12px;
        margin-left: 0;
      }

      /* Content */
      .lyd-accordion__content {
        overflow: hidden;
        transition: height var(--accordion-animation-duration) var(--accordion-animation-easing);
        height: 0;
      }

      .lyd-accordion__content.is-open {
        height: auto;
      }

      .lyd-accordion__content.no-animation {
        transition: none;
      }

      .lyd-accordion__content-inner {
        padding: var(--accordion-padding-y) var(--accordion-padding-x);
      }

      :host([variant="minimal"]) .lyd-accordion__content-inner {
        padding-left: 0;
        padding-right: 0;
      }

      :host([flush]) .lyd-accordion__content-inner {
        padding-left: var(--accordion-padding-x);
        padding-right: var(--accordion-padding-x);
      }

      /* Loading State */
      .lyd-accordion__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--lyd-gray-500);
      }

      .lyd-accordion__loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--lyd-gray-300);
        border-top-color: var(--lyd-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-right: 12px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Empty State */
      .lyd-accordion__empty {
        padding: 32px;
        text-align: center;
        color: var(--lyd-gray-500);
        font-size: 14px;
      }

      /* Size Variants */
      :host([size="small"]) {
        --accordion-header-height: 44px;
        --accordion-padding-x: 16px;
        --accordion-padding-y: 12px;
        --accordion-icon-size: 20px;
      }

      :host([size="small"]) .lyd-accordion__heading {
        font-size: 14px;
      }

      :host([size="large"]) {
        --accordion-header-height: 64px;
        --accordion-padding-x: 32px;
        --accordion-padding-y: 20px;
        --accordion-icon-size: 28px;
      }

      :host([size="large"]) .lyd-accordion__heading {
        font-size: 18px;
      }

      /* Nested Accordions */
      ::slotted(lyd-accordion),
      ::slotted(lyd-accordion-group) {
        margin-top: 16px;
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

      /* Print Styles */
      @media print {
        .lyd-accordion__content {
          height: auto !important;
          overflow: visible !important;
        }
        
        .lyd-accordion__arrow {
          display: none;
        }
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        :host {
          --accordion-bg-color: var(--lyd-gray-800);
          --accordion-border-color: var(--lyd-gray-700);
        }

        .lyd-accordion__heading {
          color: var(--lyd-gray-100);
        }

        .lyd-accordion__header:hover:not(.is-disabled) {
          background: var(--lyd-gray-700);
        }

        .lyd-accordion__header.is-open {
          background: var(--lyd-gray-700);
        }
      }

      /* Responsive */
      @media (max-width: 640px) {
        :host {
          --accordion-padding-x: 16px;
          --accordion-padding-y: 12px;
        }
      }
    `;
  }

  // Template rendering
  render() {
    const template = `
      <style>${this.getBaseStyles()}${this.getComponentStyles()}</style>
      <div class="lyd-accordion" part="accordion">
        ${this.renderHeader()}
        ${this.renderContent()}
      </div>
    `;
    
    this.shadowRoot.innerHTML = template;
    this.cacheElements();
    this.updateDisplay();
  }

  renderHeader() {
    const heading = this.getAttribute('heading') || '';
    const subtitle = this.getAttribute('subtitle');
    const icon = this.getAttribute('icon');
    const badge = this.getAttribute('badge');
    const badgeVariant = this.getAttribute('badge-variant');
    const status = this.getAttribute('status');
    const disabled = this.hasAttribute('disabled');
    const showArrow = this.getAttribute('show-arrow') !== 'false';
    
    return `
      <button
        class="lyd-accordion__header ${this._isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}"
        part="header"
        type="button"
        aria-expanded="${this._isOpen}"
        aria-controls="content-${this._id}"
        ${disabled ? 'disabled' : ''}
      >
        <div class="lyd-accordion__header-content">
          ${icon && this.getAttribute('icon-position') !== 'right' ? `
            <span class="lyd-accordion__icon" part="icon">
              ${this.getIcon(icon)}
            </span>
          ` : ''}
          
          <h3 class="lyd-accordion__heading" part="heading">
            <span class="lyd-accordion__heading-text">${heading}</span>
            ${subtitle ? `<span class="lyd-accordion__heading-subtitle">${subtitle}</span>` : ''}
          </h3>
          
          ${icon && this.getAttribute('icon-position') === 'right' ? `
            <span class="lyd-accordion__icon" part="icon">
              ${this.getIcon(icon)}
            </span>
          ` : ''}
          
          ${badge ? `
            <span class="lyd-accordion__badge ${badgeVariant ? `lyd-accordion__badge--${badgeVariant}` : ''}" part="badge">
              ${badge}
            </span>
          ` : ''}
          
          ${status ? `
            <span class="lyd-accordion__status lyd-accordion__status--${status}" part="status"></span>
          ` : ''}
        </div>
        
        ${showArrow ? `
          <span class="lyd-accordion__arrow ${this._isOpen ? 'is-open' : ''}" part="arrow">
            ${this.getIcon('chevron-down')}
          </span>
        ` : ''}
      </button>
    `;
  }

  renderContent() {
    const loading = this.hasAttribute('loading');
    const emptyText = this.getAttribute('empty-text');
    const hasContent = this.hasChildNodes() || this.querySelector('[slot]');
    
    return `
      <div
        class="lyd-accordion__content ${this._isOpen ? 'is-open' : ''}"
        part="content"
        id="content-${this._id}"
        role="region"
        aria-labelledby="header-${this._id}"
      >
        <div class="lyd-accordion__content-inner" part="content-inner">
          ${loading ? this.renderLoading() : ''}
          ${!loading && !hasContent && emptyText ? this.renderEmpty() : ''}
          ${!loading && hasContent ? '<slot></slot>' : ''}
        </div>
      </div>
    `;
  }

  renderLoading() {
    return `
      <div class="lyd-accordion__loading" part="loading">
        <div class="lyd-accordion__loading-spinner"></div>
        <span>Loading...</span>
      </div>
    `;
  }

  renderEmpty() {
    const emptyText = this.getAttribute('empty-text') || 'No content available';
    return `
      <div class="lyd-accordion__empty" part="empty">
        ${emptyText}
      </div>
    `;
  }

  getComponentStyles() {
    // Override in subclasses for additional styles
    return '';
  }

  // Event handling
  setupEventListeners() {
    this._headerElement = this.shadowRoot.querySelector('.lyd-accordion__header');
    
    if (this._headerElement) {
      this._headerElement.addEventListener('click', () => {
        if (!this.hasAttribute('disabled')) {
          this.toggle();
        }
      });
      
      // Keyboard support
      this._headerElement.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!this.hasAttribute('disabled')) {
            this.toggle();
          }
        }
      });
    }
  }

  // State management
  initializeState() {
    // Check initial open state
    if (this.hasAttribute('open')) {
      this._isOpen = true;
      this.updateDisplay();
    }
    
    // Set sticky offset
    const stickyOffset = this.getAttribute('sticky-offset');
    if (stickyOffset) {
      this.style.setProperty('--accordion-sticky-offset', stickyOffset);
    }
  }

  toggle() {
    if (this._isAnimating) return;
    
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  async open() {
    if (this._isOpen || this._isAnimating) return;
    
    this._isAnimating = true;
    this._isOpen = true;
    
    // Dispatch will-open event
    const willOpenEvent = this.dispatchEvent(new CustomEvent('lyd-will-open', {
      bubbles: true,
      cancelable: true
    }));
    
    if (!willOpenEvent) {
      this._isOpen = false;
      this._isAnimating = false;
      return;
    }
    
    // Lazy load content if needed
    if (this.hasAttribute('lazy-load') && !this._contentLoaded) {
      await this.loadContent();
    }
    
    // Update display
    this.setAttribute('open', '');
    this.updateDisplay();
    
    // Animate open
    if (this.hasAttribute('animate') !== false) {
      await this.animateOpen();
    }
    
    this._isAnimating = false;
    
    // Dispatch opened event
    this.dispatchEvent(new CustomEvent('lyd-opened', { bubbles: true }));
  }

  async close() {
    if (!this._isOpen || this._isAnimating) return;
    
    // Check if collapsible
    if (this.getAttribute('collapsible') === 'false') return;
    
    this._isAnimating = true;
    
    // Dispatch will-close event
    const willCloseEvent = this.dispatchEvent(new CustomEvent('lyd-will-close', {
      bubbles: true,
      cancelable: true
    }));
    
    if (!willCloseEvent) {
      this._isAnimating = false;
      return;
    }
    
    this._isOpen = false;
    
    // Animate close
    if (this.hasAttribute('animate') !== false) {
      await this.animateClose();
    }
    
    // Update display
    this.removeAttribute('open');
    this.updateDisplay();
    
    this._isAnimating = false;
    
    // Dispatch closed event
    this.dispatchEvent(new CustomEvent('lyd-closed', { bubbles: true }));
  }

  async animateOpen() {
    const content = this.shadowRoot.querySelector('.lyd-accordion__content');
    if (!content) return;
    
    // Get target height
    content.style.height = 'auto';
    const targetHeight = content.scrollHeight;
    content.style.height = '0';
    
    // Force reflow
    content.offsetHeight;
    
    // Animate to target height
    content.style.height = `${targetHeight}px`;
    
    // Wait for animation
    const duration = parseInt(this.getAttribute('duration') || '300');
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Set to auto for responsive behavior
    content.style.height = 'auto';
  }

  async animateClose() {
    const content = this.shadowRoot.querySelector('.lyd-accordion__content');
    if (!content) return;
    
    // Get current height
    const currentHeight = content.scrollHeight;
    content.style.height = `${currentHeight}px`;
    
    // Force reflow
    content.offsetHeight;
    
    // Animate to 0
    content.style.height = '0';
    
    // Wait for animation
    const duration = parseInt(this.getAttribute('duration') || '300');
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  async loadContent() {
    // Override in subclasses for lazy loading
    this._contentLoaded = true;
  }

  updateDisplay() {
    const header = this.shadowRoot.querySelector('.lyd-accordion__header');
    const content = this.shadowRoot.querySelector('.lyd-accordion__content');
    const arrow = this.shadowRoot.querySelector('.lyd-accordion__arrow');
    
    if (header) {
      header.classList.toggle('is-open', this._isOpen);
      header.setAttribute('aria-expanded', this._isOpen);
    }
    
    if (content) {
      content.classList.toggle('is-open', this._isOpen);
    }
    
    if (arrow) {
      arrow.classList.toggle('is-open', this._isOpen);
    }
  }

  // Observers
  setupContentObserver() {
    if ('MutationObserver' in window) {
      this._contentObserver = new MutationObserver(() => {
        if (this._isOpen) {
          this.updateContentHeight();
        }
      });
      
      this._contentObserver.observe(this, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  setupResizeObserver() {
    if ('ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(() => {
        if (this._isOpen) {
          this.updateContentHeight();
        }
      });
      
      const content = this.shadowRoot.querySelector('.lyd-accordion__content-inner');
      if (content) {
        this._resizeObserver.observe(content);
      }
    }
  }

  updateContentHeight() {
    const content = this.shadowRoot.querySelector('.lyd-accordion__content');
    if (content && this._isOpen && !this._isAnimating) {
      content.style.height = 'auto';
    }
  }

  // Utility methods
  generateId() {
    return `accordion-${Math.random().toString(36).substr(2, 9)}`;
  }

  cacheElements() {
    this._headerElement = this.shadowRoot.querySelector('.lyd-accordion__header');
    this._contentElement = this.shadowRoot.querySelector('.lyd-accordion__content');
    this._iconElement = this.shadowRoot.querySelector('.lyd-accordion__arrow');
  }

  handleAttributeChange(name, value) {
    switch (name) {
      case 'open':
        if (value !== null && !this._isOpen) {
          this.open();
        } else if (value === null && this._isOpen) {
          this.close();
        }
        break;
      case 'heading':
      case 'subtitle':
      case 'icon':
      case 'badge':
      case 'status':
        this.render();
        break;
      case 'disabled':
        this.updateDisplay();
        break;
      case 'sticky-offset':
        this.style.setProperty('--accordion-sticky-offset', value || '0');
        break;
    }
  }

  cleanup() {
    if (this._contentObserver) {
      this._contentObserver.disconnect();
    }
    
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  // Icon management
  getIcon(name) {
    const icons = {
      'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
      'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
      'plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
      'minus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
      
      // Real estate icons
      'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
      'building': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>',
      'floor-plan': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M9 3v18M15 9v12"/></svg>',
      'document': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
      'calendar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      'info': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
      'features': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      'location': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      'euro': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2.4a9.6 9.6 0 0 0 0 19.2M3 8h12M3 14h9"/></svg>',
      'energy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      'question': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>'
    };
    
    return icons[name] || '';
  }
}

// Register base component
customElements.define('lyd-accordion-base', LydAccordionBase);
```

## Phase 2: Standard Accordion Components

### Step 2: Create Standard Accordion

```javascript
// lyd-accordion.js
import { LydAccordionBase } from './lyd-accordion-base.js';

export class LydAccordion extends LydAccordionBase {
  constructor() {
    super();
  }
}

customElements.define('lyd-accordion', LydAccordion);
```

### Step 3: Create Accordion Group

```javascript
// lyd-accordion-group.js
export class LydAccordionGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // State
    this._accordions = [];
    this._openIndex = -1;
  }

  static get observedAttributes() {
    return [
      'allow-multiple', 'auto-close', 'default-open',
      'variant', 'size', 'flush', 'gap',
      'animate', 'duration', 'easing'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupAccordions();
    this.setupEventListeners();
    this.initializeDefaults();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  render() {
    const styles = `
      :host {
        display: block;
        font-family: var(--lyd-font-primary);
      }

      .lyd-accordion-group {
        display: flex;
        flex-direction: column;
        gap: var(--group-gap, 0);
      }

      :host([gap="small"]) .lyd-accordion-group {
        --group-gap: 8px;
      }

      :host([gap="medium"]) .lyd-accordion-group {
        --group-gap: 16px;
      }

      :host([gap="large"]) .lyd-accordion-group {
        --group-gap: 24px;
      }

      :host([flush]) ::slotted(lyd-accordion-item) {
        --accordion-border-radius: 0;
      }

      :host([flush]) ::slotted(lyd-accordion-item:not(:last-child)) {
        --accordion-border-bottom: none;
      }

      ::slotted(lyd-accordion-item) {
        margin: 0 !important;
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="lyd-accordion-group" part="group">
        <slot></slot>
      </div>
    `;
  }

  setupAccordions() {
    this._accordions = Array.from(this.querySelectorAll('lyd-accordion-item, lyd-accordion'));
    
    // Apply group attributes to children
    const variant = this.getAttribute('variant');
    const size = this.getAttribute('size');
    const animate = this.getAttribute('animate');
    const duration = this.getAttribute('duration');
    
    this._accordions.forEach((accordion, index) => {
      if (variant) accordion.setAttribute('variant', variant);
      if (size) accordion.setAttribute('size', size);
      if (animate) accordion.setAttribute('animate', animate);
      if (duration) accordion.setAttribute('duration', duration);
      
      // Set flush styling for connected accordions
      if (this.hasAttribute('flush')) {
        accordion.setAttribute('flush', '');
        
        // Remove border radius for middle items
        if (index > 0 && index < this._accordions.length - 1) {
          accordion.style.setProperty('--accordion-border-radius', '0');
        } else if (index === 0) {
          accordion.style.setProperty('--accordion-border-radius', '12px 12px 0 0');
        } else {
          accordion.style.setProperty('--accordion-border-radius', '0 0 12px 12px');
        }
      }
    });
  }

  setupEventListeners() {
    // Listen for open events from child accordions
    this.addEventListener('lyd-will-open', (e) => {
      if (!this.hasAttribute('allow-multiple')) {
        const openingAccordion = e.target;
        
        // Close other accordions
        this._accordions.forEach(accordion => {
          if (accordion !== openingAccordion && accordion.hasAttribute('open')) {
            accordion.close();
          }
        });
      }
    });
    
    // Track open state
    this.addEventListener('lyd-opened', (e) => {
      const index = this._accordions.indexOf(e.target);
      this._openIndex = index;
      
      this.dispatchEvent(new CustomEvent('lyd-group-change', {
        detail: { index, accordion: e.target },
        bubbles: true
      }));
    });
  }

  initializeDefaults() {
    const defaultOpen = this.getAttribute('default-open');
    
    if (defaultOpen !== null) {
      const indices = defaultOpen.split(',').map(i => parseInt(i.trim()));
      
      indices.forEach(index => {
        if (this._accordions[index]) {
          this._accordions[index].setAttribute('open', '');
        }
      });
    }
  }

  // Public API
  openAll() {
    this._accordions.forEach(accordion => accordion.open());
  }

  closeAll() {
    this._accordions.forEach(accordion => accordion.close());
  }

  openAt(index) {
    if (this._accordions[index]) {
      this._accordions[index].open();
    }
  }

  closeAt(index) {
    if (this._accordions[index]) {
      this._accordions[index].close();
    }
  }

  toggleAt(index) {
    if (this._accordions[index]) {
      this._accordions[index].toggle();
    }
  }

  getOpenIndices() {
    return this._accordions
      .map((accordion, index) => accordion.hasAttribute('open') ? index : -1)
      .filter(index => index !== -1);
  }

  cleanup() {
    // Cleanup if needed
  }
}

customElements.define('lyd-accordion-group', LydAccordionGroup);
```

### Step 4: Create Accordion Item for Groups

```javascript
// lyd-accordion-item.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionItem extends LydAccordion {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Check if part of a group
    this._group = this.closest('lyd-accordion-group');
  }
}

customElements.define('lyd-accordion-item', LydAccordionItem);
```

## Phase 3: Real Estate Specialized Components

### Step 5: Property Details Accordion

```javascript
// lyd-accordion-property.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionProperty extends LydAccordion {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'property-id', 'property-type', 'price', 'area', 'rooms'
    ];
  }

  constructor() {
    super();
    this.setAttribute('icon', 'home');
  }

  connectedCallback() {
    this.updateHeading();
    super.connectedCallback();
    this.loadPropertyDetails();
  }

  updateHeading() {
    const type = this.getAttribute('property-type') || 'Property';
    const price = this.getAttribute('price');
    const area = this.getAttribute('area');
    const rooms = this.getAttribute('rooms');
    
    let heading = type;
    let subtitle = [];
    
    if (price) subtitle.push(`€${this.formatNumber(price)}`);
    if (area) subtitle.push(`${area} m²`);
    if (rooms) subtitle.push(`${rooms} rooms`);
    
    this.setAttribute('heading', heading);
    if (subtitle.length > 0) {
      this.setAttribute('subtitle', subtitle.join(' • '));
    }
  }

  async loadPropertyDetails() {
    if (!this.hasAttribute('property-id')) return;
    
    this.setAttribute('loading', '');
    
    // Simulate API call
    setTimeout(() => {
      this.removeAttribute('loading');
      this.innerHTML = this.renderPropertyContent();
    }, 500);
  }

  renderPropertyContent() {
    return `
      <div class="property-details">
        <div class="property-section">
          <h4>Basic Information</h4>
          <dl>
            <dt>Property Type</dt>
            <dd>${this.getAttribute('property-type') || 'Apartment'}</dd>
            <dt>Living Area</dt>
            <dd>${this.getAttribute('area') || '85'} m²</dd>
            <dt>Rooms</dt>
            <dd>${this.getAttribute('rooms') || '3'}</dd>
            <dt>Floor</dt>
            <dd>2nd Floor</dd>
            <dt>Year Built</dt>
            <dd>2018</dd>
          </dl>
        </div>
        
        <div class="property-section">
          <h4>Price Details</h4>
          <dl>
            <dt>Purchase Price</dt>
            <dd>€${this.formatNumber(this.getAttribute('price') || '450000')}</dd>
            <dt>Price per m²</dt>
            <dd>€${this.formatNumber((this.getAttribute('price') || 450000) / (this.getAttribute('area') || 85))}/m²</dd>
            <dt>Commission</dt>
            <dd>3.57% incl. VAT</dd>
            <dt>Additional Costs</dt>
            <dd>~€${this.formatNumber((this.getAttribute('price') || 450000) * 0.12)}</dd>
          </dl>
        </div>
        
        <style>
          .property-details {
            display: grid;
            gap: 24px;
          }
          
          .property-section h4 {
            margin: 0 0 16px;
            font-size: 14px;
            font-weight: 600;
            color: var(--lyd-gray-700);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .property-section dl {
            display: grid;
            grid-template-columns: 140px 1fr;
            gap: 12px;
            margin: 0;
          }
          
          .property-section dt {
            font-size: 14px;
            color: var(--lyd-gray-600);
          }
          
          .property-section dd {
            font-size: 14px;
            font-weight: 500;
            color: var(--lyd-gray-900);
            margin: 0;
          }
        </style>
      </div>
    `;
  }

  formatNumber(num) {
    return new Intl.NumberFormat('de-DE').format(num);
  }
}

customElements.define('lyd-accordion-property', LydAccordionProperty);
```

### Step 6: Floor Plan Accordion

```javascript
// lyd-accordion-floor.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionFloor extends LydAccordion {
  constructor() {
    super();
    this.setAttribute('icon', 'floor-plan');
    this.setAttribute('heading', 'Floor Plans & Layouts');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'floors', 'total-area'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderFloorPlans();
  }

  renderFloorPlans() {
    const floors = parseInt(this.getAttribute('floors') || '1');
    
    this.innerHTML = `
      <div class="floor-plans">
        ${this.renderFloorTabs(floors)}
        <div class="floor-content">
          <div class="floor-image">
            <img src="/api/placeholder/600/400" alt="Floor Plan" />
          </div>
          <div class="room-list">
            <h4>Room Distribution</h4>
            <ul>
              <li>Living Room: 28.5 m²</li>
              <li>Master Bedroom: 16.2 m²</li>
              <li>Bedroom 2: 12.8 m²</li>
              <li>Kitchen: 10.4 m²</li>
              <li>Bathroom: 7.2 m²</li>
              <li>Guest WC: 3.1 m²</li>
              <li>Hallway: 6.8 m²</li>
            </ul>
          </div>
        </div>
        
        <style>
          .floor-plans {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .floor-tabs {
            display: flex;
            gap: 8px;
            border-bottom: 2px solid var(--lyd-gray-200);
            padding-bottom: 8px;
          }
          
          .floor-tab {
            padding: 8px 16px;
            border: none;
            background: transparent;
            color: var(--lyd-gray-600);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
          }
          
          .floor-tab:hover {
            background: var(--lyd-gray-100);
          }
          
          .floor-tab.active {
            background: var(--lyd-primary-light);
            color: var(--lyd-primary);
          }
          
          .floor-content {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 24px;
          }
          
          .floor-image img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid var(--lyd-gray-200);
          }
          
          .room-list h4 {
            margin: 0 0 12px;
            font-size: 14px;
            font-weight: 600;
            color: var(--lyd-gray-700);
          }
          
          .room-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .room-list li {
            padding: 8px 0;
            border-bottom: 1px solid var(--lyd-gray-100);
            font-size: 14px;
            display: flex;
            justify-content: space-between;
          }
          
          .room-list li:last-child {
            border-bottom: none;
          }
          
          @media (max-width: 768px) {
            .floor-content {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </div>
    `;
    
    // Add tab functionality
    this.setupFloorTabs();
  }

  renderFloorTabs(floors) {
    if (floors === 1) return '';
    
    let tabs = '<div class="floor-tabs">';
    for (let i = 0; i < floors; i++) {
      tabs += `<button class="floor-tab ${i === 0 ? 'active' : ''}" data-floor="${i}">
        ${i === 0 ? 'Ground Floor' : `${i}. Floor`}
      </button>`;
    }
    tabs += '</div>';
    return tabs;
  }

  setupFloorTabs() {
    const tabs = this.querySelectorAll('.floor-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Load floor plan for selected floor
        this.loadFloorPlan(tab.dataset.floor);
      });
    });
  }

  loadFloorPlan(floor) {
    // Load specific floor plan
    console.log(`Loading floor plan for floor ${floor}`);
  }
}

customElements.define('lyd-accordion-floor', LydAccordionFloor);
```

### Step 7: Document Viewer Accordion

```javascript
// lyd-accordion-documents.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionDocuments extends LydAccordion {
  constructor() {
    super();
    this.setAttribute('icon', 'document');
    this.setAttribute('heading', 'Documents & Downloads');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'documents'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderDocuments();
  }

  renderDocuments() {
    const documents = this.getDocuments();
    
    this.innerHTML = `
      <div class="documents-list">
        ${documents.map(doc => this.renderDocument(doc)).join('')}
      </div>
      
      <style>
        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .document-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: var(--lyd-gray-50);
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .document-item:hover {
          background: var(--lyd-gray-100);
          transform: translateX(4px);
        }
        
        .document-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lyd-white);
          border-radius: 8px;
          margin-right: 16px;
          color: var(--lyd-primary);
        }
        
        .document-info {
          flex: 1;
        }
        
        .document-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--lyd-gray-900);
          margin-bottom: 4px;
        }
        
        .document-meta {
          font-size: 12px;
          color: var(--lyd-gray-600);
        }
        
        .document-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--lyd-primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .document-action:hover {
          background: var(--lyd-primary-dark);
        }
        
        .document-action svg {
          width: 16px;
          height: 16px;
        }
      </style>
    `;
  }

  renderDocument(doc) {
    return `
      <div class="document-item">
        <div class="document-icon">
          ${this.getDocumentIcon(doc.type)}
        </div>
        <div class="document-info">
          <div class="document-name">${doc.name}</div>
          <div class="document-meta">${doc.type.toUpperCase()} • ${doc.size} • ${doc.date}</div>
        </div>
        <button class="document-action" onclick="window.open('${doc.url}')">
          ${this.getIcon('download')}
          Download
        </button>
      </div>
    `;
  }

  getDocuments() {
    // Mock documents - would come from API
    return [
      { name: 'Property Exposé', type: 'pdf', size: '2.4 MB', date: '2024-01-15', url: '#' },
      { name: 'Energy Certificate', type: 'pdf', size: '1.1 MB', date: '2024-01-10', url: '#' },
      { name: 'Floor Plans', type: 'pdf', size: '3.8 MB', date: '2024-01-12', url: '#' },
      { name: 'Building Description', type: 'docx', size: '542 KB', date: '2024-01-08', url: '#' },
      { name: 'Location Analysis', type: 'pdf', size: '1.7 MB', date: '2024-01-14', url: '#' }
    ];
  }

  getDocumentIcon(type) {
    const icons = {
      pdf: '<svg viewBox="0 0 24 24" fill="currentColor">...</svg>',
      docx: '<svg viewBox="0 0 24 24" fill="currentColor">...</svg>',
      xlsx: '<svg viewBox="0 0 24 24" fill="currentColor">...</svg>'
    };
    
    return icons[type] || this.getIcon('document');
  }

  getIcon(name) {
    const icons = {
      'download': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>'
    };
    
    return icons[name] || super.getIcon(name);
  }
}

customElements.define('lyd-accordion-documents', LydAccordionDocuments);
```

### Step 8: FAQ Accordion

```javascript
// lyd-accordion-faq.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionFAQ extends LydAccordion {
  constructor() {
    super();
    this.setAttribute('icon', 'question');
    this.setAttribute('variant', 'minimal');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'question', 'answer', 'category'];
  }

  connectedCallback() {
    this.updateDisplay();
    super.connectedCallback();
  }

  updateDisplay() {
    const question = this.getAttribute('question');
    const category = this.getAttribute('category');
    
    if (question) {
      this.setAttribute('heading', question);
    }
    
    if (category) {
      this.setAttribute('badge', category);
      this.setAttribute('badge-variant', 'primary');
    }
    
    const answer = this.getAttribute('answer');
    if (answer && !this.innerHTML) {
      this.innerHTML = `<p style="margin: 0; line-height: 1.6;">${answer}</p>`;
    }
  }
}

customElements.define('lyd-accordion-faq', LydAccordionFAQ);
```

### Step 9: Timeline/Schedule Accordion

```javascript
// lyd-accordion-timeline.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionTimeline extends LydAccordion {
  constructor() {
    super();
    this.setAttribute('icon', 'calendar');
    this.setAttribute('heading', 'Viewing Schedule');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'property-id', 'show-past'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderSchedule();
  }

  renderSchedule() {
    const viewings = this.getViewings();
    
    this.innerHTML = `
      <div class="timeline">
        ${viewings.map((viewing, index) => this.renderViewing(viewing, index)).join('')}
      </div>
      
      <style>
        .timeline {
          position: relative;
          padding-left: 32px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 24px;
          bottom: 24px;
          width: 2px;
          background: var(--lyd-gray-200);
        }
        
        .timeline-item {
          position: relative;
          padding: 16px 0;
        }
        
        .timeline-dot {
          position: absolute;
          left: -24px;
          top: 24px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--lyd-white);
          border: 2px solid var(--lyd-primary);
        }
        
        .timeline-item.past .timeline-dot {
          background: var(--lyd-gray-400);
          border-color: var(--lyd-gray-400);
        }
        
        .timeline-item.current .timeline-dot {
          background: var(--lyd-primary);
          animation: pulse 2s infinite;
        }
        
        .timeline-content {
          background: var(--lyd-gray-50);
          padding: 16px;
          border-radius: 8px;
        }
        
        .timeline-date {
          font-size: 12px;
          font-weight: 600;
          color: var(--lyd-primary);
          margin-bottom: 4px;
        }
        
        .timeline-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--lyd-gray-900);
          margin-bottom: 8px;
        }
        
        .timeline-details {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: var(--lyd-gray-600);
        }
        
        .timeline-action {
          margin-top: 12px;
          padding: 6px 12px;
          background: var(--lyd-primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      </style>
    `;
  }

  renderViewing(viewing, index) {
    const isPast = new Date(viewing.date) < new Date();
    const isCurrent = index === 0 && !isPast;
    
    return `
      <div class="timeline-item ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-date">${viewing.date} • ${viewing.time}</div>
          <div class="timeline-title">${viewing.type}</div>
          <div class="timeline-details">
            <span>👤 ${viewing.attendees} interested</span>
            <span>🏠 ${viewing.agent}</span>
          </div>
          ${!isPast ? `<button class="timeline-action">Book This Slot</button>` : ''}
        </div>
      </div>
    `;
  }

  getViewings() {
    // Mock data - would come from API
    return [
      {
        date: 'Tomorrow',
        time: '10:00 - 10:30',
        type: 'Private Viewing',
        attendees: 2,
        agent: 'Max Mustermann'
      },
      {
        date: 'Jan 28, 2024',
        time: '14:00 - 15:00',
        type: 'Open House',
        attendees: 12,
        agent: 'Anna Schmidt'
      },
      {
        date: 'Jan 30, 2024',
        time: '11:00 - 11:30',
        type: 'Private Viewing',
        attendees: 1,
        agent: 'Max Mustermann'
      }
    ];
  }
}

customElements.define('lyd-accordion-timeline', LydAccordionTimeline);
```

### Step 10: Property Features Accordion

```javascript
// lyd-accordion-features.js
import { LydAccordion } from './lyd-accordion.js';

export class LydAccordionFeatures extends LydAccordion {
  constructor() {
    super();
    this.setAttribute('icon', 'features');
    this.setAttribute('heading', 'Features & Amenities');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'features'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderFeatures();
  }

  renderFeatures() {
    const features = this.getFeatures();
    
    this.innerHTML = `
      <div class="features-grid">
        ${Object.entries(features).map(([category, items]) => `
          <div class="feature-category">
            <h4>${category}</h4>
            <div class="feature-list">
              ${items.map(item => `
                <div class="feature-item">
                  <span class="feature-check">${this.getIcon('check')}</span>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <style>
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }
        
        .feature-category h4 {
          margin: 0 0 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--lyd-gray-700);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--lyd-gray-700);
        }
        
        .feature-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: var(--lyd-success-light);
          color: var(--lyd-success);
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .feature-check svg {
          width: 12px;
          height: 12px;
        }
      </style>
    `;
  }

  getFeatures() {
    return {
      'Interior': [
        'Fitted Kitchen',
        'Oak Parquet Flooring',
        'Floor Heating',
        'Built-in Wardrobes',
        'Guest Toilet'
      ],
      'Exterior': [
        'Balcony (12 m²)',
        'Garden Access',
        'Bike Storage',
        'Private Terrace'
      ],
      'Building': [
        'Elevator',
        'Wheelchair Accessible',
        'Video Intercom',
        'Fiber Optic Internet',
        'Central Heating'
      ],
      'Location': [
        'Public Transport (200m)',
        'Shopping (500m)',
        'Schools (800m)',
        'Parks (300m)',
        'City Center (2km)'
      ]
    };
  }

  getIcon(name) {
    const icons = {
      'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>'
    };
    
    return icons[name] || super.getIcon(name);
  }
}

customElements.define('lyd-accordion-features', LydAccordionFeatures);
```

## Phase 4: Export All Components

### Step 11: Create Index File

```javascript
// index.js
// Base components
export { LydAccordionBase } from './base/lyd-accordion-base.js';
export { LydAccordion } from './standard/lyd-accordion.js';
export { LydAccordionGroup } from './standard/lyd-accordion-group.js';
export { LydAccordionItem } from './standard/lyd-accordion-item.js';

// Specialized components
export { LydAccordionProperty } from './specialized/lyd-accordion-property.js';
export { LydAccordionFloor } from './specialized/lyd-accordion-floor.js';
export { LydAccordionDocuments } from './specialized/lyd-accordion-documents.js';
export { LydAccordionFAQ } from './specialized/lyd-accordion-faq.js';
export { LydAccordionTimeline } from './specialized/lyd-accordion-timeline.js';
export { LydAccordionFeatures } from './specialized/lyd-accordion-features.js';

// Auto-register all components
import './standard/lyd-accordion.js';
import './standard/lyd-accordion-group.js';
import './standard/lyd-accordion-item.js';
import './specialized/lyd-accordion-property.js';
import './specialized/lyd-accordion-floor.js';
import './specialized/lyd-accordion-documents.js';
import './specialized/lyd-accordion-faq.js';
import './specialized/lyd-accordion-timeline.js';
import './specialized/lyd-accordion-features.js';
```

## Usage Examples

### Basic Accordion

```html
<lyd-accordion 
  heading="Property Description"
  icon="home"
  open
>
  <p>Beautiful 3-room apartment in the heart of Munich...</p>
</lyd-accordion>
```

### Accordion Group (Exclusive)

```html
<lyd-accordion-group allow-multiple="false" default-open="0">
  <lyd-accordion-item heading="Basic Information" icon="info">
    <p>Property details...</p>
  </lyd-accordion-item>
  
  <lyd-accordion-item heading="Location" icon="location">
    <p>Location details...</p>
  </lyd-accordion-item>
  
  <lyd-accordion-item heading="Pricing" icon="euro">
    <p>Price information...</p>
  </lyd-accordion-item>
</lyd-accordion-group>
```

### Property Details Accordion

```html
<lyd-accordion-property
  property-id="prop-123"
  property-type="Luxury Apartment"
  price="850000"
  area="120"
  rooms="4.5"
>
</lyd-accordion-property>
```

### FAQ Section

```html
<lyd-accordion-group variant="minimal" gap="small">
  <lyd-accordion-faq
    question="What are the additional costs when buying?"
    answer="Expect approximately 10-12% additional costs including notary fees, property transfer tax, and agent commission."
    category="Buying"
  ></lyd-accordion-faq>
  
  <lyd-accordion-faq
    question="Is the property immediately available?"
    answer="Yes, the property is vacant and available for immediate occupancy after purchase completion."
    category="Availability"
  ></lyd-accordion-faq>
</lyd-accordion-group>
```

### Complete Property Page Example

```html
<div class="property-details-page">
  <!-- Property Overview -->
  <lyd-accordion-property
    property-type="Modern Penthouse"
    price="1250000"
    area="180"
    rooms="5"
    open
  ></lyd-accordion-property>
  
  <!-- Features -->
  <lyd-accordion-features></lyd-accordion-features>
  
  <!-- Floor Plans -->
  <lyd-accordion-floor floors="2" total-area="180"></lyd-accordion-floor>
  
  <!-- Documents -->
  <lyd-accordion-documents></lyd-accordion-documents>
  
  <!-- Viewing Schedule -->
  <lyd-accordion-timeline property-id="prop-123"></lyd-accordion-timeline>
  
  <!-- FAQ -->
  <lyd-accordion-group variant="minimal">
    <lyd-accordion-faq
      question="Are pets allowed?"
      answer="Yes, pets are welcome with landlord approval."
    ></lyd-accordion-faq>
    <!-- More FAQs -->
  </lyd-accordion-group>
</div>
```

### Next.js Integration

```typescript
// app/components/PropertyAccordions.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function PropertyAccordions({ property }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Import web components
    import('@lyd/design-system/components/accordion');
    
    // Handle events
    const handleAccordionOpen = (e: CustomEvent) => {
      console.log('Accordion opened:', e.target);
    };
    
    containerRef.current?.addEventListener('lyd-opened', handleAccordionOpen);
    
    return () => {
      containerRef.current?.removeEventListener('lyd-opened', handleAccordionOpen);
    };
  }, []);
  
  return (
    <div ref={containerRef}>
      <lyd-accordion-property
        property-type={property.type}
        price={property.price}
        area={property.area}
        rooms={property.rooms}
        open
      />
      
      <lyd-accordion-features />
      <lyd-accordion-floor floors={property.floors} />
      <lyd-accordion-documents />
      <lyd-accordion-timeline property-id={property.id} />
    </div>
  );
}
```

## Testing Checklist

### Functional Tests
- [ ] Accordion opens/closes correctly
- [ ] Animation smooth at 60fps
- [ ] Group exclusivity works (only one open)
- [ ] Multiple selection in groups works
- [ ] Lazy loading loads content on first open
- [ ] Sticky headers stay fixed on scroll
- [ ] Nested accordions function properly
- [ ] Events fire correctly (will-open, opened, will-close, closed)
- [ ] Default open states initialize correctly

### Accessibility Tests
- [ ] Keyboard navigation (Space, Enter to toggle)
- [ ] ARIA attributes properly set (expanded, controls, labelledby)
- [ ] Focus states visible
- [ ] Screen reader announces state changes
- [ ] Tab order logical
- [ ] Print styles show all content

### Performance Tests
- [ ] Initial render < 50ms
- [ ] Smooth animations at 60fps
- [ ] No layout shifts during expand/collapse
- [ ] Memory usage stable with many accordions
- [ ] Resize observer doesn't cause performance issues

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile browsers work with touch

### Responsive Design
- [ ] Mobile: Full width, adjusted padding
- [ ] Tablet: Standard layout
- [ ] Desktop: Full feature set
- [ ] Print: All content visible

This comprehensive implementation provides a complete accordion system tailored for real estate applications with specialized components for property details, floor plans, documents, FAQs, and viewing schedules.