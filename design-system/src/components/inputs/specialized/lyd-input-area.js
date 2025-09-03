// LYD Design System - Area Input Component
import { LydInputBase } from '../base/lyd-input-base.js';

export class LydInputArea extends LydInputBase {
  constructor() {
    super();
    this._unit = 'm²';
    this._areaType = 'living'; // living, total, plot, room
    this._rawValue = '';
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'unit',
      'area-type',
      'show-unit',
      'format-on-blur',
      'allow-decimals'
    ];
  }

  get unit() {
    return this.getAttribute('unit') || 'm²';
  }

  set unit(value) {
    this.setAttribute('unit', value);
  }

  get areaType() {
    return this.getAttribute('area-type') || 'living';
  }

  set areaType(value) {
    this.setAttribute('area-type', value);
  }

  get rawValue() {
    return this._rawValue;
  }

  get numericValue() {
    return this.parseArea(this._value);
  }

  // Override value getter/setter for area formatting
  get value() {
    return this._value;
  }

  set value(val) {
    this._rawValue = val;
    
    // Format the value for display
    const formattedValue = this.formatArea(val);
    
    const oldValue = this._value;
    this._value = formattedValue;
    
    if (this._internals) {
      // Store the numeric value for form submission
      this._internals.setFormValue(this.parseArea(formattedValue).toString());
    }
    
    this.setAttribute('value', formattedValue);
    this.dispatchEvent(new CustomEvent('input', {
      detail: { 
        value: formattedValue, 
        numericValue: this.parseArea(formattedValue),
        unit: this.unit,
        oldValue 
      },
      bubbles: true
    }));
    
    this.validate();
  }

  parseArea(value) {
    if (!value) return 0;
    
    // Remove unit symbols, spaces, and non-numeric characters except decimal separators
    const cleanValue = value.toString()
      .replace(/[m²sqftacrehafeet]/gi, '')
      .replace(/[^\d.,\-]/g, '')
      .replace(/,/g, '.');
    
    const numericValue = parseFloat(cleanValue) || 0;
    return numericValue;
  }

  formatArea(value, options = {}) {
    const numericValue = this.parseArea(value);
    if (numericValue === 0 && !value) return '';
    
    const unit = options.unit || this.unit;
    const showUnit = options.showUnit !== false && this.hasAttribute('show-unit');
    const allowDecimals = this.hasAttribute('allow-decimals');
    
    try {
      const formatter = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: allowDecimals ? 2 : 0
      });
      
      const formatted = formatter.format(numericValue);
      return showUnit ? `${formatted} ${unit}` : formatted;
    } catch (error) {
      // Fallback formatting
      const formatted = allowDecimals 
        ? numericValue.toFixed(2)
        : Math.round(numericValue).toString();
      
      return showUnit ? `${formatted} ${unit}` : formatted;
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
        numericValue: this.parseArea(this._value),
        unit: this.unit,
        oldValue 
      },
      bubbles: true
    }));
  }

  handleBlur(event) {
    this._touched = true;
    
    // Format on blur if enabled
    if (this.hasAttribute('format-on-blur')) {
      const formatted = this.formatArea(this._value);
      this._value = formatted;
      event.target.value = formatted;
      
      if (this._internals) {
        this._internals.setFormValue(this.parseArea(formatted).toString());
      }
    }
    
    this.validate();
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { 
        value: this._value,
        numericValue: this.parseArea(this._value),
        unit: this.unit
      },
      bubbles: true
    }));
  }

  // Enhanced validation for area inputs
  validate() {
    this._errors = [];
    this._isValid = true;

    const value = this._value;
    const numericValue = this.parseArea(value);
    const required = this.hasAttribute('required');
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');

    // Required validation
    if (required && (!value || value.trim() === '' || numericValue === 0)) {
      this._errors.push('Area is required');
      this._isValid = false;
    }

    if (value && numericValue > 0) {
      // Minimum area validation
      if (min && numericValue < parseFloat(min)) {
        this._errors.push(`Area must be at least ${this.formatArea(min)}`);
        this._isValid = false;
      }

      // Maximum area validation
      if (max && numericValue > parseFloat(max)) {
        this._errors.push(`Area cannot exceed ${this.formatArea(max)}`);
        this._isValid = false;
      }

      // Area type specific validation
      const areaType = this.areaType;
      if (areaType === 'living' && numericValue < 10) {
        this._errors.push('Living area seems unusually small');
        this._isValid = false;
      }
      
      if (areaType === 'room' && numericValue < 5) {
        this._errors.push('Room area seems unusually small');
        this._isValid = false;
      }

      if (areaType === 'plot' && numericValue < 50) {
        this._errors.push('Plot area seems unusually small');
        this._isValid = false;
      }

      // Unit-specific validation
      if (this.unit === 'm²' && numericValue > 10000) {
        this._errors.push('Area seems unusually large for m²');
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

  getAreaTypeLabel() {
    const types = {
      'living': 'Living Area',
      'total': 'Total Area',
      'plot': 'Plot Area',
      'room': 'Room Area',
      'usable': 'Usable Area',
      'basement': 'Basement Area',
      'garage': 'Garage Area'
    };
    return types[this.areaType] || 'Area';
  }

  getAreaTypeIcon() {
    const icons = {
      'living': 'home',
      'total': 'area',
      'plot': 'garden',
      'room': 'bedroom',
      'usable': 'floor-plan',
      'basement': 'building',
      'garage': 'garage'
    };
    return icons[this.areaType] || 'area';
  }

  getUnitOptions() {
    return [
      { value: 'm²', label: 'Square Meters (m²)' },
      { value: 'sqft', label: 'Square Feet (sqft)' },
      { value: 'acre', label: 'Acres' },
      { value: 'ha', label: 'Hectares (ha)' }
    ];
  }

  convertUnit(value, fromUnit, toUnit) {
    const conversions = {
      'm²': 1,
      'sqft': 10.764, // 1 m² = 10.764 sqft
      'acre': 0.000247, // 1 m² = 0.000247 acres
      'ha': 0.0001 // 1 m² = 0.0001 ha
    };

    const baseValue = value / conversions[fromUnit];
    return baseValue * conversions[toUnit];
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
      this.setAttribute('label', this.getAreaTypeLabel());
    }
    
    if (!this.hasAttribute('icon-left')) {
      this.setAttribute('icon-left', this.getAreaTypeIcon());
    }
    
    if (!this.hasAttribute('placeholder')) {
      const placeholder = this.areaType === 'plot' ? '500' : '85';
      this.setAttribute('placeholder', placeholder);
    }

    // Add unit suffix if show-unit is enabled
    if (this.hasAttribute('show-unit') && !this.hasAttribute('suffix')) {
      this.setAttribute('suffix', this.unit);
    }

    // Call parent render
    super.render();

    // Add area-specific styling
    const style = this.shadowRoot.querySelector('style');
    if (style) {
      style.textContent += `
        .lyd-input--area .lyd-input__field {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .lyd-input__area-converter {
          margin-top: 8px;
          padding: 12px;
          background: #F9FAFB;
          border-radius: 8px;
          font-size: 12px;
          color: #6B7280;
        }

        .lyd-input__unit-selector {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .lyd-input__unit-option {
          padding: 4px 8px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          font-size: 12px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .lyd-input__unit-option:hover {
          border-color: #3366CC;
          color: #3366CC;
        }

        .lyd-input__unit-option.active {
          background: #3366CC;
          color: white;
          border-color: #3366CC;
        }

        .lyd-input__area-suggestions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .lyd-input__area-suggestion {
          padding: 4px 8px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          font-size: 12px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lyd-input__area-suggestion:hover {
          border-color: #3366CC;
          color: #3366CC;
        }
      `;
    }

    // Add unit selector and area suggestions
    this.addUnitSelector();
    this.addAreaSuggestions();
    this.addAreaConverter();
  }

  addUnitSelector() {
    if (!this.hasAttribute('show-unit-selector')) return;

    const footer = this.shadowRoot.querySelector('.lyd-input__footer');
    if (!footer) return;

    const units = this.getUnitOptions();
    const currentUnit = this.unit;

    const selectorHtml = units.map(unit => 
      `<button type="button" class="lyd-input__unit-option ${unit.value === currentUnit ? 'active' : ''}" 
              data-unit="${unit.value}" title="${unit.label}">
        ${unit.value}
      </button>`
    ).join('');

    footer.insertAdjacentHTML('afterend', `
      <div class="lyd-input__unit-selector">
        ${selectorHtml}
      </div>
    `);

    // Add click handlers for unit options
    this.shadowRoot.querySelectorAll('.lyd-input__unit-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newUnit = e.target.dataset.unit;
        const oldUnit = this.unit;
        
        // Convert current value to new unit
        if (this._value && this.numericValue > 0) {
          const convertedValue = this.convertUnit(this.numericValue, oldUnit, newUnit);
          this.unit = newUnit;
          this.value = convertedValue.toString();
        } else {
          this.unit = newUnit;
        }
        
        // Update active state
        this.shadowRoot.querySelectorAll('.lyd-input__unit-option').forEach(b => 
          b.classList.remove('active'));
        e.target.classList.add('active');
        
        this.render();
      });
    });
  }

  addAreaSuggestions() {
    const footer = this.shadowRoot.querySelector('.lyd-input__footer');
    if (!footer || this.hasAttribute('hide-suggestions')) return;

    const suggestions = this.getAreaSuggestions();
    if (suggestions.length === 0) return;

    const suggestionsHtml = suggestions.map(area => 
      `<button type="button" class="lyd-input__area-suggestion" data-area="${area}">
        ${this.formatArea(area, { showUnit: true })}
      </button>`
    ).join('');

    footer.insertAdjacentHTML('afterend', `
      <div class="lyd-input__area-suggestions">
        ${suggestionsHtml}
      </div>
    `);

    // Add click handlers for suggestions
    this.shadowRoot.querySelectorAll('.lyd-input__area-suggestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const area = e.target.dataset.area;
        this.value = area;
        this.focus();
      });
    });
  }

  addAreaConverter() {
    if (!this.hasAttribute('show-converter') || !this._value || this.numericValue === 0) return;

    const footer = this.shadowRoot.querySelector('.lyd-input__footer');
    if (!footer) return;

    const currentUnit = this.unit;
    const currentValue = this.numericValue;
    
    const conversions = [];
    
    if (currentUnit !== 'm²') {
      conversions.push(`${this.formatArea(this.convertUnit(currentValue, currentUnit, 'm²'))} m²`);
    }
    if (currentUnit !== 'sqft') {
      conversions.push(`${this.formatArea(this.convertUnit(currentValue, currentUnit, 'sqft'))} sqft`);
    }
    
    if (conversions.length > 0) {
      footer.insertAdjacentHTML('afterend', `
        <div class="lyd-input__area-converter">
          Equivalent: ${conversions.join(' • ')}
        </div>
      `);
    }
  }

  getAreaSuggestions() {
    const areaType = this.areaType;
    const unit = this.unit;
    
    if (unit === 'm²') {
      if (areaType === 'living') {
        return [50, 75, 100, 125, 150];
      } else if (areaType === 'room') {
        return [12, 18, 25, 30, 40];
      } else if (areaType === 'plot') {
        return [300, 500, 800, 1000, 1500];
      } else if (areaType === 'total') {
        return [80, 120, 160, 200, 250];
      }
    } else if (unit === 'sqft') {
      if (areaType === 'living') {
        return [500, 800, 1000, 1300, 1600];
      } else if (areaType === 'room') {
        return [130, 200, 270, 320, 430];
      }
    }
    
    return [];
  }

  // Public methods
  formatCurrentValue() {
    this.value = this.formatArea(this._value);
  }

  setNumericValue(numericValue) {
    this.value = numericValue.toString();
  }

  convertToUnit(targetUnit) {
    if (this.numericValue > 0) {
      const convertedValue = this.convertUnit(this.numericValue, this.unit, targetUnit);
      this.unit = targetUnit;
      this.value = convertedValue.toString();
    } else {
      this.unit = targetUnit;
    }
  }
}

customElements.define('lyd-input-area', LydInputArea);



