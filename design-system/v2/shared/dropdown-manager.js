/**
 * GLOBALES DROPDOWN Z-INDEX MANAGEMENT SYSTEM
 * Sorgt dafür, dass bei Öffnung einer Dropdown-Komponente immer der höchste Z-Index gesetzt wird
 */

class DropdownManager {
    constructor() {
        this.activeDropdowns = new Set();
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDropdownHandlers();
            this.setupGlobalClickHandler();
        });
    }
    
    setupDropdownHandlers() {
        // Alle Dropdown-Trigger finden und Handler hinzufügen
        const triggers = document.querySelectorAll(`
            .lyd-select-trigger,
            .lyd-dropdown-trigger,
            .lyd-autocomplete-trigger,
            .lyd-combobox-trigger,
            .lyd-datepicker-trigger
        `);
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const container = trigger.closest('.lyd-select, .lyd-dropdown, .lyd-autocomplete, .lyd-combobox, .lyd-datepicker');
                const dropdown = this.getDropdownForTrigger(trigger);
                
                if (!container || !dropdown) return;
                
                const isOpen = this.isDropdownOpen(dropdown);
                
                if (isOpen) {
                    this.closeDropdown(container, dropdown);
                } else {
                    this.closeAllDropdowns();
                    this.openDropdown(container, dropdown);
                }
            });
        });
        
        // Option-Handler für alle Dropdown-Typen
        const options = document.querySelectorAll(`
            .lyd-select-option,
            .lyd-dropdown-item,
            .lyd-autocomplete-option
        `);
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = option.closest('.lyd-select-dropdown, .lyd-dropdown-menu, .lyd-autocomplete-dropdown');
                const container = option.closest('.lyd-select, .lyd-dropdown, .lyd-autocomplete');
                
                if (!dropdown || !container) return;
                
                this.handleOptionSelection(option, container, dropdown);
            });
        });
    }
    
    getDropdownForTrigger(trigger) {
        return trigger.nextElementSibling || 
               trigger.parentElement.querySelector('.lyd-select-dropdown, .lyd-dropdown-menu, .lyd-autocomplete-dropdown');
    }
    
    isDropdownOpen(dropdown) {
        return dropdown.classList.contains('show') || 
               dropdown.classList.contains('active') || 
               dropdown.classList.contains('open');
    }
    
    openDropdown(container, dropdown) {
        // Container als aktiv markieren
        container.classList.add('active');
        
        // Position Fixed Dropdown korrekt positionieren
        this.positionFixedDropdown(container, dropdown);
        
        // Dropdown öffnen
        dropdown.classList.add('show', 'active', 'open');
        
        // Zur aktiven Liste hinzufügen
        this.activeDropdowns.add(container);
        
        // Z-Index-Hierarchie setzen
        this.updateZIndexHierarchy();
        
        console.log('Dropdown opened:', container.className);
    }
    
    positionFixedDropdown(container, dropdown) {
        // Trigger-Element finden
        const trigger = container.querySelector('.lyd-select-trigger, .lyd-dropdown-trigger, .lyd-autocomplete-input');
        if (!trigger) return;
        
        // Position berechnen
        const rect = trigger.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Fixed Position setzen
        dropdown.style.top = (rect.bottom + scrollTop + 8) + 'px';
        dropdown.style.left = (rect.left + scrollLeft) + 'px';
        dropdown.style.width = rect.width + 'px';
        dropdown.style.minWidth = '200px';
    }
    
    closeDropdown(container, dropdown) {
        // Container deaktivieren
        container.classList.remove('active');
        
        // Dropdown schließen
        dropdown.classList.remove('show', 'active', 'open');
        
        // Trigger deaktivieren
        const trigger = container.querySelector('.lyd-select-trigger, .lyd-dropdown-trigger, .lyd-autocomplete-trigger');
        if (trigger) trigger.classList.remove('active');
        
        // Aus aktiver Liste entfernen
        this.activeDropdowns.delete(container);
        
        // Z-Index-Hierarchie aktualisieren
        this.updateZIndexHierarchy();
        
        console.log('Dropdown closed:', container.className);
    }
    
    closeAllDropdowns() {
        this.activeDropdowns.forEach(container => {
            const dropdown = container.querySelector('.lyd-select-dropdown, .lyd-dropdown-menu, .lyd-autocomplete-dropdown');
            if (dropdown) {
                this.closeDropdown(container, dropdown);
            }
        });
        this.activeDropdowns.clear();
    }
    
    handleOptionSelection(option, container, dropdown) {
        const trigger = container.querySelector('.lyd-select-trigger, .lyd-dropdown-trigger, .lyd-autocomplete-trigger');
        const selectedText = trigger?.querySelector('.lyd-select-text, .lyd-dropdown-text, .lyd-autocomplete-text, span');
        
        // Multi-Select Logic
        if (option.classList.contains('multi')) {
            const checkbox = option.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                option.classList.toggle('selected', checkbox.checked);
            }
            
            // Update counter text
            const selectedOptions = dropdown.querySelectorAll('.lyd-select-option.selected, .lyd-dropdown-item.selected');
            if (selectedText) {
                if (selectedOptions.length === 0) {
                    selectedText.textContent = trigger.dataset.placeholder || 'Select options...';
                } else if (selectedOptions.length === 1) {
                    selectedText.textContent = selectedOptions[0].textContent.trim();
                } else {
                    selectedText.textContent = selectedOptions.length + ' items selected';
                }
            }
            
            // Dropdown bleibt offen
            return;
        }
        
        // Single-Select Logic
        if (selectedText) {
            selectedText.textContent = option.textContent.trim();
        }
        
        // Selected state aktualisieren
        dropdown.querySelectorAll('.lyd-select-option, .lyd-dropdown-item, .lyd-autocomplete-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Dropdown schließen (außer Multi-Select)
        this.closeDropdown(container, dropdown);
    }
    
    updateZIndexHierarchy() {
        // Alle Cards zurücksetzen
        document.querySelectorAll('.component-card').forEach(card => {
            card.style.zIndex = '1';
        });
        
        // Aktive Dropdown-Cards erhöhen
        this.activeDropdowns.forEach(container => {
            const card = container.closest('.component-card');
            if (card) {
                card.style.zIndex = '50000';
            }
        });
    }
    
    setupGlobalClickHandler() {
        document.addEventListener('click', (e) => {
            // Prüfen ob Click außerhalb aller Dropdowns
            if (!e.target.closest('.lyd-select, .lyd-dropdown, .lyd-autocomplete, .lyd-combobox, .lyd-datepicker')) {
                this.closeAllDropdowns();
            }
        });
        
        // Reposition on scroll/resize für Fixed Dropdowns
        window.addEventListener('scroll', () => {
            this.activeDropdowns.forEach(container => {
                const dropdown = container.querySelector('.lyd-select-dropdown, .lyd-dropdown-menu, .lyd-autocomplete-dropdown');
                if (dropdown && this.isDropdownOpen(dropdown)) {
                    this.positionFixedDropdown(container, dropdown);
                }
            });
        });
        
        window.addEventListener('resize', () => {
            this.activeDropdowns.forEach(container => {
                const dropdown = container.querySelector('.lyd-select-dropdown, .lyd-dropdown-menu, .lyd-autocomplete-dropdown');
                if (dropdown && this.isDropdownOpen(dropdown)) {
                    this.positionFixedDropdown(container, dropdown);
                }
            });
        });
    }
}

// Globale Instanz erstellen
window.LYDDropdownManager = new DropdownManager();
