// Live Your Dreams Select Component
// Professional dropdown with search, multi-select, and real estate options

class LydSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.selectedValues = [];
    this.filteredOptions = [];
    this.searchTerm = '';
  }

  static get observedAttributes() {
    return ['open', 'disabled', 'multiple', 'searchable', 'placeholder', 'label'];
  }

  connectedCallback() {
    this.loadOptions();
    this.render();
    this.addEventListeners();
    this.addClickOutsideListener();
  }

  attributeChangedCallback() {
    this.render();
  }

  loadOptions() {
    // Load options from slot or data attribute
    const optionElements = this.querySelectorAll('lyd-option');
    this.options = Array.from(optionElements).map(el => ({
      value: el.getAttribute('value'),
      label: el.textContent.trim(),
      disabled: el.hasAttribute('disabled')
    }));
    this.filteredOptions = [...this.options];
  }

  render() {
    const placeholder = this.getAttribute('placeholder') || 'Select option...';
    const label = this.getAttribute('label') || '';
    const multiple = this.hasAttribute('multiple');
    const searchable = this.hasAttribute('searchable');
    const disabled = this.hasAttribute('disabled');

    const selectedText = this.getSelectedText();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
        }
        
        .select-container {
          position: relative;
        }
        
        .select-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .select-trigger:hover:not(:disabled) {
          border-color: #cbd5e1;
        }
        
        .select-trigger:focus {
          outline: none;
          border-color: #0066ff;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }
        
        .select-trigger:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .select-trigger--open {
          border-color: #0066ff;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }
        
        .select-value {
          flex: 1;
          text-align: left;
          color: ${selectedText ? '#1f2937' : '#9ca3af'};
        }
        
        .select-icon {
          width: 20px;
          height: 20px;
          color: #6b7280;
          transition: transform 0.2s ease;
        }
        
        .select-icon--open {
          transform: rotate(180deg);
        }
        
        .select-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          max-height: 300px;
          overflow-y: auto;
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .select-dropdown--open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        
        .select-search {
          padding: 12px 16px;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          width: 100%;
          font-family: inherit;
          font-size: 14px;
        }
        
        .select-search:focus {
          outline: none;
          border-bottom-color: #0066ff;
        }
        
        .select-option {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          font-size: 15px;
        }
        
        .select-option:hover {
          background: #f9fafb;
        }
        
        .select-option--selected {
          background: #eff6ff;
          color: #0066ff;
          font-weight: 500;
        }
        
        .select-option--disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .select-option--disabled:hover {
          background: transparent;
        }
        
        .option-checkbox {
          margin-right: 12px;
          width: 16px;
          height: 16px;
        }
        
        .no-options {
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        /* Real Estate Variants */
        .select--property {
          border-left: 4px solid #0066ff;
        }
        
        .select--location {
          border-left: 4px solid #22c55e;
        }
        
        .select--price {
          border-left: 4px solid #f59e0b;
        }
      </style>
      
      <div class="select-container">
        ${label ? `<label class="select-label">${label}</label>` : ''}
        
        <button 
          class="select-trigger ${this.isOpen ? 'select-trigger--open' : ''}"
          ${disabled ? 'disabled' : ''}
          aria-expanded="${this.isOpen}"
          aria-haspopup="listbox"
        >
          <span class="select-value">${selectedText || placeholder}</span>
          <svg class="select-icon ${this.isOpen ? 'select-icon--open' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div class="select-dropdown ${this.isOpen ? 'select-dropdown--open' : ''}" role="listbox">
          ${searchable ? `
            <input 
              type="text" 
              class="select-search" 
              placeholder="Search options..."
              value="${this.searchTerm}"
            />
          ` : ''}
          
          <div class="select-options">
            ${this.renderOptions()}
          </div>
        </div>
      </div>
    `;
  }

  renderOptions() {
    if (this.filteredOptions.length === 0) {
      return '<div class="no-options">No options found</div>';
    }

    return this.filteredOptions.map(option => {
      const isSelected = this.selectedValues.includes(option.value);
      const multiple = this.hasAttribute('multiple');
      
      return `
        <div 
          class="select-option ${isSelected ? 'select-option--selected' : ''} ${option.disabled ? 'select-option--disabled' : ''}"
          data-value="${option.value}"
          role="option"
          aria-selected="${isSelected}"
        >
          ${multiple ? `<input type="checkbox" class="option-checkbox" ${isSelected ? 'checked' : ''} ${option.disabled ? 'disabled' : ''}>` : ''}
          ${option.label}
        </div>
      `;
    }).join('');
  }

  getSelectedText() {
    if (this.selectedValues.length === 0) return '';
    
    if (this.hasAttribute('multiple')) {
      if (this.selectedValues.length === 1) {
        const option = this.options.find(opt => opt.value === this.selectedValues[0]);
        return option ? option.label : '';
      }
      return `${this.selectedValues.length} selected`;
    } else {
      const option = this.options.find(opt => opt.value === this.selectedValues[0]);
      return option ? option.label : '';
    }
  }

  addEventListeners() {
    const trigger = this.shadowRoot.querySelector('.select-trigger');
    const dropdown = this.shadowRoot.querySelector('.select-dropdown');
    const searchInput = this.shadowRoot.querySelector('.select-search');
    
    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!this.hasAttribute('disabled')) {
        this.toggle();
      }
    });
    
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        e.stopPropagation();
        this.searchTerm = e.target.value;
        this.filterOptions();
      });
    }
    
    // Option selection
    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.select-option');
      if (option && !option.classList.contains('select-option--disabled')) {
        e.stopPropagation();
        this.selectOption(option.dataset.value);
      }
    });
  }

  addClickOutsideListener() {
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.render();
  }

  open() {
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    this.render();
  }

  selectOption(value) {
    const multiple = this.hasAttribute('multiple');
    
    if (multiple) {
      const index = this.selectedValues.indexOf(value);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      } else {
        this.selectedValues.push(value);
      }
    } else {
      this.selectedValues = [value];
      this.close();
    }
    
    this.dispatchEvent(new CustomEvent('lyd-select-change', {
      detail: {
        value: multiple ? this.selectedValues : this.selectedValues[0],
        values: this.selectedValues
      },
      bubbles: true
    }));
    
    this.render();
  }

  filterOptions() {
    if (!this.searchTerm) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.render();
  }

  // Public API
  get value() {
    return this.hasAttribute('multiple') ? this.selectedValues : this.selectedValues[0];
  }

  set value(val) {
    this.selectedValues = Array.isArray(val) ? val : [val];
    this.render();
  }
}

// LYD Option Element
class LydOption extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('lyd-select', LydSelect);
customElements.define('lyd-option', LydOption);

export default LydSelect;
