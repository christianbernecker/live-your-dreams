#!/usr/bin/env python3

import os
import shutil

# Komponenten-Definitionen
components = {
    'modal': {
        'title': 'Modal Components',
        'subtitle': 'Overlay dialogs with luxury styling for confirmations, forms, and detailed content display.',
        'overview': '''
            <div class="demo-grid">
                <div class="component-card">
                    <h3>lyd-modal</h3>
                    <p>Overlay dialog with luxury styling and animations</p>
                    <div class="component-showcase">
                        <button class="luxury-btn primary" onclick="openModal('demo-modal')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 16px; height: 16px; margin-right: 8px;">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                            </svg>
                            Open Modal
                        </button>
                    </div>
                </div>
            </div>
        ''',
        'css': '''
        /* Modal Styles */
        .luxury-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: none;
        }

        .luxury-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
        }

        .modal-container {
            position: relative;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            transform: scale(0.9);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .luxury-modal.active .modal-container {
            transform: scale(1);
            opacity: 1;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
        }

        .modal-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background 0.2s ease;
        }

        .modal-close:hover {
            background: #f3f4f6;
        }

        .modal-content {
            padding: 24px;
        }

        .modal-footer {
            padding: 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        ''',
        'js': '''
        // Modal functionality
        window.openModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        window.closeModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        // Close on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.luxury-modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        '''
    },
    'checkbox': {
        'title': 'Checkbox Components',
        'subtitle': 'Custom checkboxes with luxury styling and smooth animations for form controls.',
        'overview': '''
            <div class="demo-grid">
                <div class="component-card">
                    <h3>lyd-checkbox</h3>
                    <p>Custom checkbox with luxury styling</p>
                    <div class="component-showcase">
                        <label class="luxury-checkbox">
                            <input type="checkbox" checked>
                            <span class="checkmark"></span>
                            <span class="label-text">Balcony included</span>
                        </label>
                    </div>
                </div>
            </div>
        ''',
        'css': '''
        /* Checkbox Styles */
        .luxury-checkbox {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-size: 14px;
            color: #374151;
        }

        .luxury-checkbox input[type="checkbox"] {
            display: none;
        }

        .checkmark {
            width: 20px;
            height: 20px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            position: relative;
            transition: all 0.2s ease;
            background: white;
        }

        .luxury-checkbox:hover .checkmark {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .luxury-checkbox input:checked + .checkmark {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-color: #3b82f6;
        }

        .luxury-checkbox input:checked + .checkmark::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 2px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
        ''',
        'js': '''
        // Checkbox functionality
        document.querySelectorAll('.luxury-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const event = new CustomEvent('lyd-checkbox-change', {
                    detail: { 
                        checked: e.target.checked,
                        value: e.target.value 
                    }
                });
                e.target.closest('.luxury-checkbox').dispatchEvent(event);
            });
        });
        '''
    },
    'radio': {
        'title': 'Radio Components', 
        'subtitle': 'Custom radio buttons with luxury styling for single-choice selections.',
        'overview': '''
            <div class="demo-grid">
                <div class="component-card">
                    <h3>lyd-radio</h3>
                    <p>Custom radio button with luxury styling</p>
                    <div class="component-showcase">
                        <div class="radio-group">
                            <label class="luxury-radio">
                                <input type="radio" name="property-type" value="apartment" checked>
                                <span class="radio-mark"></span>
                                <span class="label-text">Apartment</span>
                            </label>
                            <label class="luxury-radio">
                                <input type="radio" name="property-type" value="house">
                                <span class="radio-mark"></span>
                                <span class="label-text">House</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        ''',
        'css': '''
        /* Radio Styles */
        .luxury-radio {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-size: 14px;
            color: #374151;
            margin-bottom: 12px;
        }

        .luxury-radio input[type="radio"] {
            display: none;
        }

        .radio-mark {
            width: 20px;
            height: 20px;
            border: 2px solid #d1d5db;
            border-radius: 50%;
            position: relative;
            transition: all 0.2s ease;
            background: white;
        }

        .luxury-radio:hover .radio-mark {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .luxury-radio input:checked + .radio-mark {
            border-color: #3b82f6;
        }

        .luxury-radio input:checked + .radio-mark::after {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .radio-group {
            display: flex;
            flex-direction: column;
        }
        ''',
        'js': '''
        // Radio functionality
        document.querySelectorAll('.luxury-radio input').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const event = new CustomEvent('lyd-radio-change', {
                    detail: { 
                        value: e.target.value,
                        name: e.target.name 
                    }
                });
                e.target.closest('.luxury-radio').dispatchEvent(event);
            });
        });
        '''
    },
    'toast': {
        'title': 'Toast Components',
        'subtitle': 'Notification messages with luxury styling for user feedback and system alerts.',
        'overview': '''
            <div class="demo-grid">
                <div class="component-card">
                    <h3>lyd-toast</h3>
                    <p>Notification toast with luxury styling</p>
                    <div class="component-showcase">
                        <button class="luxury-btn primary" onclick="showToast('success', 'Property saved successfully!')">
                            Show Success Toast
                        </button>
                    </div>
                </div>
            </div>
        ''',
        'css': '''
        /* Toast Styles */
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .luxury-toast {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .luxury-toast.show {
            transform: translateX(0);
            opacity: 1;
        }

        .luxury-toast.success {
            border-left: 4px solid #10b981;
        }

        .luxury-toast.error {
            border-left: 4px solid #ef4444;
        }

        .luxury-toast.warning {
            border-left: 4px solid #f59e0b;
        }

        .toast-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .toast-content {
            flex: 1;
            font-size: 14px;
            color: #374151;
        }

        .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background 0.2s ease;
        }

        .toast-close:hover {
            background: #f3f4f6;
        }
        ''',
        'js': '''
        // Toast functionality
        let toastContainer;

        function initToastContainer() {
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }
        }

        window.showToast = function(type = 'success', message = 'Action completed') {
            initToastContainer();
            
            const toast = document.createElement('div');
            toast.className = `luxury-toast ${type}`;
            
            const icons = {
                success: '<path d="M9 12l2 2 4-4"/>',
                error: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
                warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
            };
            
            toast.innerHTML = `
                <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${icons[type] || icons.success}
                </svg>
                <div class="toast-content">${message}</div>
                <button class="toast-close" onclick="closeToast(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            `;
            
            toastContainer.appendChild(toast);
            
            // Show toast
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Auto-hide after 5 seconds
            setTimeout(() => closeToast(toast), 5000);
        };

        window.closeToast = function(element) {
            const toast = element.closest ? element.closest('.luxury-toast') : element;
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        };
        '''
    }
}

def generate_component(name, config):
    """Generiert eine Komponenten-HTML-Datei"""
    
    # Template laden
    with open('design-system/templates/global-template.html', 'r') as f:
        template = f.read()
    
    # Platzhalter ersetzen
    html = template.replace('{{PAGE_TITLE}} - LYD Design System', f'{config["title"]} - DESIGNSYSTEM')
    html = html.replace('{{PAGE_TITLE}}', config['title'])
    html = html.replace('{{PAGE_SUBTITLE}}', config['subtitle'])
    
    # Navigation aktivieren
    html = html.replace(f'<a href="/components/{name}/" class="nav-item">', f'<a href="/components/{name}/" class="nav-item active">')
    
    # Tab-Navigation hinzufügen
    tabs_html = '''
            <!-- Tab Navigation -->
            <div class="tabs">
                <button class="tab active" data-tab="overview">Overview</button>
                <button class="tab" data-tab="variants">Variants</button>
                <button class="tab" data-tab="icons">Icon Library</button>
                <button class="tab" data-tab="examples">Examples</button>
                <button class="tab" data-tab="api">API</button>
                <button class="tab" data-tab="accessibility">Accessibility</button>
            </div>
        </div>
        
        <!-- Tab Content: Overview -->
        <div id="overview" class="tab-content active">
''' + config['overview'] + '''
        </div>

        <!-- Tab Content: API -->
        <div id="api" class="tab-content">
            <h2 class="section-title">API Reference</h2>
            
            <h3>lyd-''' + name + '''</h3>
            <div style="overflow-x: auto; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <thead>
                        <tr style="background: linear-gradient(135deg, #f8fafc, #e2e8f0);">
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Property</th>
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Type</th>
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Default</th>
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">checked</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Whether component is checked</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">disabled</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Disables component interaction</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab Content: Accessibility -->
        <div id="accessibility" class="tab-content">
            <h2 class="section-title">Accessibility Guidelines</h2>
            
            <div class="accessibility-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>WCAG 2.1 AA Compliant</span>
            </div>
            
            <p>All ''' + name + ''' components meet international accessibility standards</p>
        </div>
    '''
    
    # CSS hinzufügen
    if 'css' in config:
        css_insert = config['css'] + '''

        /* Tab Navigation */
        .tabs {
            display: flex;
            gap: 8px;
            margin-top: 24px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0;
        }

        .tab {
            padding: 12px 24px;
            border: none;
            background: none;
            color: #6b7280;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .tab:hover {
            color: #374151;
            background: #f9fafb;
        }

        .tab.active {
            color: #2563eb;
            border-bottom-color: #2563eb;
            background: none;
        }

        .tab-content {
            display: none;
            padding: 32px 0;
        }

        .tab-content.active {
            display: block;
        }

        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-top: 24px;
        }

        .component-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        }

        .component-card h3 {
            margin: 0 0 8px 0;
            color: #1f2937;
            font-weight: 600;
        }

        .component-card p {
            margin: 0 0 16px 0;
            color: #6b7280;
            font-size: 14px;
        }

        .component-showcase {
            margin-top: 16px;
        }

        .accessibility-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: #dcfce7;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            color: #166534;
            font-weight: 500;
            margin-bottom: 24px;
        }

        .accessibility-badge svg {
            width: 20px;
            height: 20px;
            color: #059669;
        }

        /* Luxury Button Styles */
        .luxury-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
        }

        .luxury-btn.primary {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            box-shadow: 0 8px 32px rgba(26, 26, 46, 0.3);
        }

        .luxury-btn.outline {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            color: #374151;
        }
        '''
        
        html = html.replace('        }', '        }\n\n' + css_insert + '\n        }', 1)
    
    # JavaScript hinzufügen
    if 'js' in config:
        js_insert = '''
        // Tab functionality
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(targetId).classList.add('active');
                
                window.location.hash = targetId;
            });
        });

        // Handle hash-based navigation
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            document.querySelector(`[data-tab="${hash}"]`).click();
        }

''' + config['js']
        
        html = html.replace('        {{ADDITIONAL_SCRIPTS}}', js_insert)
    
    # Content ersetzen
    content_replacement = tabs_html
    html = html.replace('            <h1 class="page-title">{{PAGE_TITLE}}</h1>\n            <p class="page-subtitle">{{PAGE_SUBTITLE}}</p>\n        </div>\n        \n        {{PAGE_CONTENT}}', content_replacement)
    
    # Datei schreiben
    with open(f'design-system/components/{name}/index.html', 'w') as f:
        f.write(html)
    
    print(f"✅ {config['title']} erstellt")

# Alle Komponenten generieren
for name, config in components.items():
    generate_component(name, config)

print("🎉 Alle Komponenten erfolgreich generiert!")
