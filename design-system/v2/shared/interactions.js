/* ========================================
   LYD DESIGN SYSTEM - ZENTRALE INTERAKTIONEN
   Gemeinsame JavaScript-Funktionalitäten
   Version: 2.0 - LUXURY EDITION
   ======================================== */

// MODAL SYSTEM - GLOBAL
window.LYDModal = {
    open: function(modalId) {
        const backdrop = document.getElementById(modalId + '-backdrop');
        const modal = document.getElementById(modalId);
        
        if (backdrop && modal) {
            backdrop.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        }
    },
    
    close: function(modalId) {
        const backdrop = document.getElementById(modalId + '-backdrop');
        const modal = document.getElementById(modalId);
        
        if (backdrop && modal) {
            backdrop.classList.remove('active');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }
    },
    
    init: function() {
        // Close on backdrop click
        document.querySelectorAll('.lyd-modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    const modalId = backdrop.id.replace('-backdrop', '');
                    this.close(modalId);
                }
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.lyd-modal-backdrop.active').forEach(backdrop => {
                    const modalId = backdrop.id.replace('-backdrop', '');
                    this.close(modalId);
                });
            }
        });
    }
};

// DROPDOWN SYSTEM - EINFACH UND FUNKTIONAL
window.LYDDropdown = {
    toggle: function(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const trigger = dropdown?.previousElementSibling;
        
        if (dropdown && trigger) {
            // Close ALL other dropdowns first
            document.querySelectorAll('.lyd-dropdown-menu').forEach(menu => {
                if (menu.id !== dropdownId) {
                    menu.classList.remove('active');
                    menu.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.lyd-dropdown-trigger').forEach(btn => {
                if (btn !== trigger) {
                    btn.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            const isActive = dropdown.classList.contains('active');
            if (isActive) {
                dropdown.classList.remove('active');
                dropdown.style.display = 'none';
                trigger.classList.remove('active');
            } else {
                dropdown.classList.add('active');
                dropdown.style.display = 'block';
                dropdown.style.position = 'absolute';
                dropdown.style.top = 'calc(100% + 8px)';
                dropdown.style.left = '0';
                dropdown.style.right = '0';
                dropdown.style.zIndex = '99999999';
                dropdown.style.background = 'white';
                dropdown.style.border = '1px solid #e5e7eb';
                dropdown.style.borderRadius = '8px';
                dropdown.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                trigger.classList.add('active');
            }
        }
    },
    
    init: function() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lyd-dropdown')) {
                document.querySelectorAll('.lyd-dropdown-menu.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    dropdown.style.display = 'none';
                });
                document.querySelectorAll('.lyd-dropdown-trigger.active').forEach(trigger => {
                    trigger.classList.remove('active');
                });
            }
        });
    }
};

// TOAST SYSTEM - GLOBAL
window.LYDToast = {
    container: null,
    
    init: function() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'lyd-toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 400px;
            `;
            document.body.appendChild(this.container);
        }
    },
    
    show: function(message, type = 'info', duration = 4000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `luxury-toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                ${this.getIcon(type)}
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${this.getTitle(type)}</div>
                    <div style="font-size: 14px; opacity: 0.9;">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; opacity: 0.6; font-size: 18px;">&times;</button>
            </div>
        `;
        
        this.container.appendChild(toast);
        
        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    },
    
    getIcon: function(type) {
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366CC" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>'
        };
        return icons[type] || icons.info;
    },
    
    getTitle: function(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }
};

// BUTTON INTERACTIONS - GLOBAL
window.LYDButton = {
    init: function() {
        // Loading state management
        document.querySelectorAll('.lyd-button.loading').forEach(button => {
            if (button.id === 'loadingBtn') {
                setInterval(() => {
                    button.classList.toggle('loading');
                }, 3000);
            }
        });
        
        // Click feedback for all buttons
        document.querySelectorAll('.lyd-button:not(.loading):not(:disabled)').forEach(button => {
            button.addEventListener('click', function(e) {
                // Visual feedback
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    },
    
    setLoading: function(buttonElement, isLoading = true) {
        if (isLoading) {
            buttonElement.classList.add('loading');
            buttonElement.disabled = true;
        } else {
            buttonElement.classList.remove('loading');
            buttonElement.disabled = false;
        }
    }
};

// DATE PICKER SYSTEM - GLOBAL
window.LYDDatePicker = {
    currentDate: new Date(),
    
    toggle: function(pickerId) {
        const picker = document.getElementById(pickerId);
        const calendar = picker?.querySelector('.lyd-datepicker-calendar');
        
        if (calendar) {
            // Close other calendars
            document.querySelectorAll('.lyd-datepicker-calendar.open').forEach(cal => {
                if (cal !== calendar) cal.classList.remove('open');
            });
            
            calendar.classList.toggle('open');
            if (calendar.classList.contains('open')) {
                this.generateCalendar(calendar, this.currentDate);
            }
        }
    },
    
    generateCalendar: function(calendar, date) {
        // Calendar generation logic would go here
        // Simplified for now
        console.log('Generating calendar for', date);
    },
    
    init: function() {
        // Close calendars when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lyd-datepicker')) {
                document.querySelectorAll('.lyd-datepicker-calendar.open').forEach(calendar => {
                    calendar.classList.remove('open');
                });
            }
        });
    }
};

// COPY-TO-CLIPBOARD UTILITY
window.LYDUtilities = {
    copyToClipboard: function(element) {
        const codeBlock = element.parentElement.querySelector('pre, code');
        const text = codeBlock?.textContent || element.dataset.clipboard;
        
        if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = element.textContent;
                element.textContent = 'Copied!';
                element.classList.add('copied');
                
                setTimeout(() => {
                    element.textContent = originalText;
                    element.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            });
        }
    },
    
    init: function() {
        // Initialize copy buttons
        document.querySelectorAll('.lyd-button.copy, [data-clipboard]').forEach(button => {
            button.addEventListener('click', () => this.copyToClipboard(button));
        });
    }
};

// GLOBAL INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all LYD systems
    if (window.LYDModal) LYDModal.init();
    if (window.LYDDropdown) LYDDropdown.init();
    if (window.LYDToast) LYDToast.init();
    if (window.LYDButton) LYDButton.init();
    if (window.LYDDatePicker) LYDDatePicker.init();
    if (window.LYDUtilities) LYDUtilities.init();
    
    // Active navigation highlighting
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });
});

// GLOBAL FUNCTIONS FOR BACKWARD COMPATIBILITY
function openModal(modalId) { LYDModal.open(modalId); }
function closeModal(modalId) { LYDModal.close(modalId); }
function toggleDropdown(dropdownId) { LYDDropdown.toggle(dropdownId); }
function showToast(message, type, duration) { LYDToast.show(message, type, duration); }
