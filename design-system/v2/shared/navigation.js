/**
 * LYD Design System - Zentrale Navigation
 * Lädt die Navigation dynamisch und setzt den aktiven Zustand
 */

class LYDNavigation {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadNavigation();
        this.setActiveState();
    }

    async loadNavigation() {
        try {
            const response = await fetch('/shared/navigation.html');
            const navigationHTML = await response.text();
            
            // Navigation in den Body einfügen (am Anfang)
            document.body.insertAdjacentHTML('afterbegin', navigationHTML);
        } catch (error) {
            console.error('Fehler beim Laden der Navigation:', error);
        }
    }

    setActiveState() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        // Alle aktiven Zustände entfernen
        navItems.forEach(item => item.classList.remove('active'));
        
        // Bestimme den aktiven Navigationspunkt basierend auf der URL
        let activeNavId = this.getActiveNavId(currentPath);
        
        // Setze den aktiven Zustand
        const activeItem = document.querySelector(`[data-nav="${activeNavId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    getActiveNavId(path) {
        // Startseite
        if (path === '/' || path === '/index.html') {
            return 'home';
        }
        
        // Design Principles
        if (path.includes('/design-principles/overview/')) return 'design-principles-overview';
        if (path.includes('/design-principles/colors/')) return 'design-principles-colors';
        if (path.includes('/design-principles/typography/')) return 'design-principles-typography';
        if (path.includes('/design-principles/grid/')) return 'design-principles-grid';
        if (path.includes('/design-principles/spacing/')) return 'design-principles-spacing';
        
        // Implementation Guide
        if (path.includes('/implementation/overview/')) return 'implementation-overview';
        if (path.includes('/implementation/css/')) return 'implementation-css';
        if (path.includes('/implementation/nextjs/')) return 'implementation-nextjs';
        
        // Components
        if (path.includes('/components/overview/')) return 'components-overview';
        if (path.includes('/components/buttons/')) return 'components-buttons';
        if (path.includes('/components/inputs/')) return 'components-inputs';
        if (path.includes('/components/cards/')) return 'components-cards';
        if (path.includes('/components/select/')) return 'components-select';
        if (path.includes('/components/accordion/')) return 'components-accordion';
        if (path.includes('/components/modal/')) return 'components-modal';
        if (path.includes('/components/dropdown/')) return 'components-dropdown';
        if (path.includes('/components/checkbox/')) return 'components-checkbox';
        if (path.includes('/components/radio/')) return 'components-radio';
        if (path.includes('/components/toast/')) return 'components-toast';
        if (path.includes('/components/table/')) return 'components-table';
        if (path.includes('/components/textarea/')) return 'components-textarea';
        if (path.includes('/components/switch/')) return 'components-switch';
        if (path.includes('/components/slider/')) return 'components-slider';
        if (path.includes('/components/alert/')) return 'components-alert';
        if (path.includes('/components/badge/')) return 'components-badge';
        if (path.includes('/components/date-picker/')) return 'components-date-picker';
        if (path.includes('/components/avatar/')) return 'components-avatar';
        if (path.includes('/components/navbar/')) return 'components-navbar';
        if (path.includes('/components/tabs/')) return 'components-tabs';
        if (path.includes('/components/progress/')) return 'components-progress';
        if (path.includes('/components/calendar/')) return 'components-calendar';
        if (path.includes('/components/autocomplete/')) return 'components-autocomplete';
        if (path.includes('/components/pagination/')) return 'components-pagination';
        if (path.includes('/components/tooltip/')) return 'components-tooltip';
        if (path.includes('/components/typography/')) return 'components-typography';
        
        return null;
    }
}

// Navigation initialisieren, sobald das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new LYDNavigation();
});
