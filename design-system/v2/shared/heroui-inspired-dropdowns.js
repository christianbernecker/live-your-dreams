/**
 * HEROUI-INSPIRIERTE DROPDOWN-LÖSUNG
 * Basiert auf HeroUI's bewährten Patterns für robuste Dropdown-Funktionalität
 */

class LYDDropdownSystem {
    constructor() {
        this.openDropdowns = new Set();
        this.portalContainer = null;
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createPortalContainer();
            this.setupDropdowns();
            this.setupKeyboardNavigation();
            this.setupAccessibility();
        });
    }
    
    createPortalContainer() {
        // HeroUI-Pattern: Portal-Container für alle Dropdowns
        this.portalContainer = document.createElement('div');
        this.portalContainer.id = 'lyd-dropdown-portal';
        this.portalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999999;
            pointer-events: none;
        `;
        document.body.appendChild(this.portalContainer);
        console.log('🚀 Portal-Container erstellt (HeroUI-Pattern)');
    }
    
    setupDropdowns() {
        // Select-Komponenten (HeroUI Select-Pattern)
        document.querySelectorAll('.lyd-select').forEach((select, index) => {
            const trigger = select.querySelector('.lyd-select-trigger');
            const dropdown = select.querySelector('.lyd-select-dropdown');
            
            if (!trigger || !dropdown) return;
            
            // Unique ID für Portal-Management
            const dropdownId = 'lyd-select-' + index;
            dropdown.id = dropdownId;
            
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSelect(select, trigger, dropdown);
            });
            
            // Option-Handler
            dropdown.querySelectorAll('.lyd-select-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectOption(select, trigger, dropdown, option);
                });
            });
            
            console.log('📋 Select ' + index + ' setup (HeroUI-Pattern)');
        });
        
        // Dropdown-Komponenten (HeroUI Dropdown-Pattern)
        document.querySelectorAll('.lyd-dropdown').forEach((dropdown, index) => {
            const trigger = dropdown.querySelector('.lyd-dropdown-trigger');
            const menu = dropdown.querySelector('.lyd-dropdown-menu');
            
            if (!trigger || !menu) return;
            
            const menuId = 'lyd-dropdown-' + index;
            menu.id = menuId;
            
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown(dropdown, trigger, menu);
            });
            
            // Menu-Item-Handler
            menu.querySelectorAll('.lyd-dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectDropdownItem(dropdown, trigger, menu, item);
                });
            });
            
            console.log('📋 Dropdown ' + index + ' setup (HeroUI-Pattern)');
        });
        
        // Autocomplete-Komponenten (HeroUI Autocomplete-Pattern)
        document.querySelectorAll('.lyd-autocomplete').forEach((autocomplete, index) => {
            const input = autocomplete.querySelector('.lyd-autocomplete-input');
            const dropdown = autocomplete.querySelector('.lyd-autocomplete-dropdown');
            
            if (!input || !dropdown) return;
            
            const dropdownId = 'lyd-autocomplete-' + index;
            dropdown.id = dropdownId;
            
            // Input Focus/Click Handler
            input.addEventListener('focus', (e) => {
                this.openAutocomplete(autocomplete, input, dropdown);
            });
            
            input.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openAutocomplete(autocomplete, input, dropdown);
            });
            
            // Input Change Handler für Search
            input.addEventListener('input', (e) => {
                this.filterAutocompleteOptions(dropdown, e.target.value);
            });
            
            // Option-Handler
            dropdown.querySelectorAll('.lyd-autocomplete-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectAutocompleteItem(autocomplete, input, dropdown, item);
                });
            });
            
            console.log('📋 Autocomplete ' + index + ' setup (HeroUI-Pattern)');
        });
        
        // Outside click (HeroUI-Pattern)
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lyd-select, .lyd-dropdown, .lyd-autocomplete, #lyd-dropdown-portal')) {
                this.closeAllDropdowns();
            }
        });
    }
    
    toggleSelect(select, trigger, dropdown) {
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            this.closeDropdown(dropdown);
        } else {
            this.closeAllDropdowns();
            this.openDropdown(select, trigger, dropdown);
        }
    }
    
    toggleDropdown(container, trigger, menu) {
        const isOpen = menu.classList.contains('active');
        
        if (isOpen) {
            this.closeDropdown(menu);
        } else {
            this.closeAllDropdowns();
            this.openDropdown(container, trigger, menu);
        }
    }
    
    openDropdown(container, trigger, dropdown) {
        // HeroUI-Pattern: Portal-Rendering
        const clone = dropdown.cloneNode(true);
        clone.style.pointerEvents = 'auto';
        
        // Position berechnen (HeroUI-Pattern)
        const rect = trigger.getBoundingClientRect();
        clone.style.cssText += `
            position: fixed !important;
            top: ${rect.bottom + 8}px !important;
            left: ${rect.left}px !important;
            width: ${rect.width}px !important;
            min-width: 200px !important;
            z-index: 999999 !important;
            background: white !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
        `;
        
        // Event-Handler für geklonte Elemente
        this.setupClonedEventHandlers(clone, container, trigger, dropdown);
        
        // Zu Portal hinzufügen
        this.portalContainer.appendChild(clone);
        
        // Original-Dropdown verstecken
        dropdown.style.display = 'none';
        
        // States setzen
        container.classList.add('active');
        trigger.classList.add('active');
        dropdown.classList.add('show');
        
        this.openDropdowns.add({container, trigger, dropdown, clone});
        console.log('🔓 Dropdown opened (Portal-Rendered)');
    }
    
    setupClonedEventHandlers(clone, container, trigger, originalDropdown) {
        // Option-Handler für geklonte Elemente
        clone.querySelectorAll('.lyd-select-option, .lyd-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Text zum Trigger kopieren
                const selectedText = trigger.querySelector('.lyd-select-text, span:not(.lyd-dropdown-icon):not(.lyd-select-icon)');
                if (selectedText && !item.classList.contains('checkbox')) {
                    selectedText.textContent = item.textContent.trim();
                }
                
                // Dropdown schließen
                this.closeDropdown(originalDropdown);
                console.log('✅ Option selected:', item.textContent.trim());
            });
        });
    }
    
    closeDropdown(dropdown) {
        // Portal-Clone entfernen
        this.openDropdowns.forEach(({container, trigger, dropdown: dd, clone}) => {
            if (dd === dropdown) {
                if (clone && clone.parentElement) {
                    clone.parentElement.removeChild(clone);
                }
                
                // Original-Dropdown wieder anzeigen
                dd.style.display = '';
                
                // States entfernen
                container.classList.remove('active');
                trigger.classList.remove('active');
                dd.classList.remove('show');
                
                this.openDropdowns.delete({container, trigger, dropdown: dd, clone});
                console.log('🔒 Dropdown closed (Portal-Removed)');
            }
        });
    }
    
    closeAllDropdowns() {
        this.openDropdowns.forEach(({container, trigger, dropdown, clone}) => {
            if (clone && clone.parentElement) {
                clone.parentElement.removeChild(clone);
            }
            
            dropdown.style.display = '';
            container.classList.remove('active');
            trigger.classList.remove('active');
            dropdown.classList.remove('show');
        });
        
        this.openDropdowns.clear();
        console.log('🌍 All dropdowns closed');
    }
    
    selectOption(select, trigger, dropdown, option) {
        const selectedText = trigger.querySelector('.lyd-select-text, span');
        if (selectedText) {
            selectedText.textContent = option.textContent.trim();
        }
        
        // Selected state
        dropdown.querySelectorAll('.lyd-select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        this.closeDropdown(dropdown);
    }
    
    selectDropdownItem(container, trigger, menu, item) {
        if (item.classList.contains('checkbox')) {
            // Checkbox-Toggle
            item.classList.toggle('selected');
            console.log('☑️ Checkbox toggled');
            return; // Dropdown bleibt offen
        }
        
        this.closeDropdown(menu);
    }
    
    openAutocomplete(container, input, dropdown) {
        this.closeAllDropdowns();
        this.openDropdown(container, input, dropdown);
        console.log('🔓 Autocomplete opened');
    }
    
    selectAutocompleteItem(container, input, dropdown, item) {
        input.value = item.textContent.trim();
        
        // Selected state
        dropdown.querySelectorAll('.lyd-autocomplete-item').forEach(opt => {
            opt.classList.remove('selected');
        });
        item.classList.add('selected');
        
        this.closeDropdown(dropdown);
        console.log('✅ Autocomplete option selected:', item.textContent.trim());
    }
    
    filterAutocompleteOptions(dropdown, searchValue) {
        const items = dropdown.querySelectorAll('.lyd-autocomplete-item');
        const filter = searchValue.toLowerCase();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(filter) ? '' : 'none';
        });
        
        console.log('🔍 Autocomplete filtered:', searchValue);
    }
    
    setupKeyboardNavigation() {
        // HeroUI-Pattern: Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }
    
    setupAccessibility() {
        // HeroUI-Pattern: ARIA-Attribute
        document.querySelectorAll('.lyd-select-trigger, .lyd-dropdown-trigger').forEach(trigger => {
            trigger.setAttribute('aria-haspopup', 'true');
            trigger.setAttribute('aria-expanded', 'false');
        });
    }
}

// Globale Instanz (HeroUI-Pattern)
window.LYDDropdownSystem = new LYDDropdownSystem();
