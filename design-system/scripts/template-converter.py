#!/usr/bin/env python3
"""
LYD Design System - Template Converter
Konvertiert alle HTML-Seiten zu einem konsistenten Template-System
"""

import os
import re
from pathlib import Path

# Template-Definitionen
TEMPLATES = {
    'components/introduction': {
        'title': 'Components',
        'subtitle': 'Professional component library for real estate applications. Built with Next.js integration and accessibility in mind.',
        'imports': '../../src/index.js',
        'styles': '',
        'content': '''
        <section class="lyd-section">
            <h2 class="lyd-section-title">Foundation Components</h2>
            <div class="lyd-component-grid">
                <div class="lyd-component-card">
                    <h3>Button</h3>
                    <p>Interactive button component with multiple variants, loading states, and real estate specific actions.</p>
                    <div class="lyd-component-showcase">
                        <lyd-button variant="primary" icon="home">View Property</lyd-button>
                        <lyd-button variant="secondary" icon="key">Get Keys</lyd-button>
                        <lyd-button variant="outline" icon="calendar">Schedule</lyd-button>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Input</h3>
                    <p>Form input component with variants for search, currency, and area inputs optimized for real estate.</p>
                    <div class="lyd-component-showcase">
                        <lyd-input-text placeholder="Search properties..."></lyd-input-text>
                        <lyd-input-price value="450000"></lyd-input-price>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Card</h3>
                    <p>Flexible card component with glassmorphism effects for property showcases and content organization.</p>
                    <div class="lyd-component-showcase">
                        <lyd-card>
                            <div style="padding: 16px;">
                                <h4>Property Card</h4>
                                <p>Modern luxury apartment</p>
                            </div>
                        </lyd-card>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="lyd-section">
            <h2 class="lyd-section-title">Form Components</h2>
            <div class="lyd-component-grid">
                <div class="lyd-component-card">
                    <h3>Select</h3>
                    <p>Dropdown selection component with search functionality and property type options.</p>
                    <div class="lyd-component-showcase">
                        <lyd-select>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                        </lyd-select>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Checkbox</h3>
                    <p>Checkbox component for feature selection and multi-choice forms.</p>
                    <div class="lyd-component-showcase">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" checked> Balcony
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox"> Garden
                        </label>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Radio</h3>
                    <p>Radio button component for single-choice selections in property forms.</p>
                    <div class="lyd-component-showcase">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="radio" name="type" checked> Buy
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="radio" name="type"> Rent
                        </label>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="lyd-section">
            <h2 class="lyd-section-title">Feedback Components</h2>
            <div class="lyd-component-grid">
                <div class="lyd-component-card">
                    <h3>Modal</h3>
                    <p>Modal dialog component for property details, confirmations, and forms.</p>
                    <div class="lyd-component-showcase">
                        <lyd-button variant="secondary" onclick="openModal()">Open Modal</lyd-button>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Toast</h3>
                    <p>Toast notification component for success messages and error feedback.</p>
                    <div class="lyd-component-showcase">
                        <lyd-button variant="outline" onclick="showToast()">Show Toast</lyd-button>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Table</h3>
                    <p>Data table component for property listings and lead management.</p>
                    <div class="lyd-component-showcase">
                        <div style="font-size: 12px; color: #6b7280;">Interactive table with sorting</div>
                    </div>
                </div>
            </div>
        </section>
        '''
    },
    
    'components/buttons': {
        'title': 'Button Components',
        'subtitle': 'Complete button system with variants, icons, and specialized components for real estate applications.',
        'imports': '../../src/components/lyd-button.js,../../src/components/lyd-button-group.js,../../src/components/lyd-button-pure.js,../../src/components/lyd-button-tile.js,../../src/icons/icon-library.js',
        'styles': '''
        /* Tab navigation styles */
        .tabs {
            display: flex;
            gap: 2px;
            background: #f3f4f6;
            padding: 4px;
            border-radius: 12px;
            margin-bottom: 32px;
        }
        
        .tab {
            flex: 1;
            padding: 12px 24px;
            background: transparent;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .tab:hover {
            color: #374151;
        }
        
        .tab.active {
            background: white;
            color: var(--lyd-primary);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 16px;
            padding: 24px;
            background: white;
            border-radius: 12px;
        }
        
        .icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 16px 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .icon-item:hover {
            background: #f9fafb;
            transform: translateY(-2px);
        }
        
        .icon-preview {
            width: 32px;
            height: 32px;
            color: var(--lyd-primary);
        }
        
        .icon-name {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        
        .search-bar {
            position: relative;
            margin-bottom: 24px;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.2s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--lyd-primary);
            box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
        }
        
        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #6b7280;
            pointer-events: none;
        }
        
        .properties-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .properties-table th,
        .properties-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid var(--lyd-gray-200);
        }

        .properties-table th {
            background: var(--lyd-gray-50);
            font-weight: 600;
            color: var(--lyd-gray-900);
        }

        .properties-table code {
            background: var(--lyd-gray-100);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
        }

        .callout {
            background: var(--lyd-accent-light);
            border: 1px solid var(--lyd-primary);
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
        }

        .callout strong {
            color: var(--lyd-primary);
        }
        ''',
        'content': '''
        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="overview">Overview</button>
            <button class="tab" data-tab="variants">Variants</button>
            <button class="tab" data-tab="icons">Icon Library</button>
            <button class="tab" data-tab="examples">Examples</button>
            <button class="tab" data-tab="api">API</button>
            <button class="tab" data-tab="accessibility">Accessibility</button>
        </div>
        
        <!-- Tab Content: Overview -->
        <div class="tab-content active" id="overview">
            <section class="lyd-section">
                <h2 class="lyd-section-title">Button System Overview</h2>
                
                <div class="lyd-component-grid">
                    <div class="lyd-component-card">
                        <h3>lyd-button</h3>
                        <p>Primary button component with variants and icons</p>
                        <div class="lyd-component-showcase">
                            <lyd-button variant="primary" icon="home">View Property</lyd-button>
                            <lyd-button variant="secondary" icon="key">Get Keys</lyd-button>
                            <lyd-button variant="outline" icon="calendar">Schedule</lyd-button>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>lyd-button-group</h3>
                        <p>Group related actions together</p>
                        <div class="lyd-component-showcase">
                            <lyd-button-group connected>
                                <lyd-button variant="outline" icon="edit">Edit</lyd-button>
                                <lyd-button variant="outline" icon="share">Share</lyd-button>
                                <lyd-button variant="outline" icon="delete">Delete</lyd-button>
                            </lyd-button-group>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>lyd-button-pure</h3>
                        <p>Minimal icon-only buttons</p>
                        <div class="lyd-component-showcase">
                            <lyd-button-pure icon="heart"></lyd-button-pure>
                            <lyd-button-pure icon="share" variant="primary"></lyd-button-pure>
                            <lyd-button-pure icon="more-vertical"></lyd-button-pure>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>lyd-button-tile</h3>
                        <p>Large tiles for navigation</p>
                        <div class="lyd-component-showcase">
                            <lyd-button-tile 
                                icon="building" 
                                label="Properties" 
                                description="23 active">
                            </lyd-button-tile>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
        <!-- Tab Content: Variants -->
        <div class="tab-content" id="variants">
            <section class="lyd-section">
                <h2 class="lyd-section-title">Button Variants</h2>
                
                <div class="lyd-component-grid">
                    <div class="lyd-component-card">
                        <h3>Primary</h3>
                        <p>Main call-to-action buttons</p>
                        <div class="lyd-component-showcase">
                            <lyd-button variant="primary" size="small" icon="home">Small</lyd-button>
                            <lyd-button variant="primary" size="medium" icon="home">Medium</lyd-button>
                            <lyd-button variant="primary" size="large" icon="home">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>Secondary</h3>
                        <p>Secondary actions</p>
                        <div class="lyd-component-showcase">
                            <lyd-button variant="secondary" size="small" icon="key">Small</lyd-button>
                            <lyd-button variant="secondary" size="medium" icon="key">Medium</lyd-button>
                            <lyd-button variant="secondary" size="large" icon="key">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>Outline</h3>
                        <p>Subtle actions</p>
                        <div class="lyd-component-showcase">
                            <lyd-button variant="outline" size="small" icon="edit">Small</lyd-button>
                            <lyd-button variant="outline" size="medium" icon="edit">Medium</lyd-button>
                            <lyd-button variant="outline" size="large" icon="edit">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>Ghost</h3>
                        <p>Minimal actions</p>
                        <div class="lyd-component-showcase">
                            <lyd-button variant="ghost" size="small" icon="more-horizontal">Small</lyd-button>
                            <lyd-button variant="ghost" size="medium" icon="more-horizontal">Medium</lyd-button>
                            <lyd-button variant="ghost" size="large" icon="more-horizontal">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="lyd-component-card">
                        <h3>States</h3>
                        <p>Loading and disabled states</p>
                        <div class="lyd-component-showcase">
                            <lyd-button variant="primary" icon="download">Normal</lyd-button>
                            <lyd-button variant="primary" icon="download" loading>Loading</lyd-button>
                            <lyd-button variant="primary" icon="download" disabled>Disabled</lyd-button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
        <!-- Tab Content: Icon Library -->
        <div class="tab-content" id="icons">
            <section class="lyd-section">
                <h2 class="lyd-section-title">Icon Library</h2>
                
                <div class="search-bar">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search icons..."
                        id="icon-search"
                    >
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </div>
                
                <div class="icon-grid" id="icon-grid">
                    <!-- Icons will be populated by JavaScript -->
                </div>
            </section>
        </div>
        
        <!-- Tab Content: Examples -->
        <div class="tab-content" id="examples">
            <section class="lyd-section">
                <h2 class="lyd-section-title">Real Estate Use Cases</h2>
                
                <div class="lyd-component-card" style="max-width: 400px;">
                    <h3>Property Card Actions</h3>
                    <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
                        <div style="width: 100%; height: 200px; background: #f3f4f6; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: #6b7280;">Property Image</div>
                        <h4>Luxury Villa Munich</h4>
                        <p style="color: #6b7280; font-size: 14px;">€2,500,000 • 350m² • 5 rooms</p>
                        
                        <div style="display: flex; gap: 8px; margin-top: 16px;">
                            <lyd-button variant="primary" icon="calendar" full-width>
                                Schedule Viewing
                            </lyd-button>
                            <lyd-button-pure icon="heart-outline"></lyd-button-pure>
                        </div>
                    </div>
                </div>
                
                <div class="lyd-component-card">
                    <h3>Dashboard Navigation</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
                        <lyd-button-tile icon="building" label="Properties" description="23 active"></lyd-button-tile>
                        <lyd-button-tile icon="location" label="Locations" description="12 areas"></lyd-button-tile>
                        <lyd-button-tile icon="key" label="Viewings" description="5 today"></lyd-button-tile>
                    </div>
                </div>
            </section>
        </div>
        
        <!-- Tab Content: API -->
        <div class="tab-content" id="api">
            <section class="lyd-section">
                <h2 class="lyd-section-title">API Reference</h2>
                
                <h3>lyd-button</h3>
                <table class="properties-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>variant</code></td>
                            <td><code>string</code></td>
                            <td><code>primary</code></td>
                            <td>Visual style: primary, secondary, outline, ghost, danger, success</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td><code>string</code></td>
                            <td><code>medium</code></td>
                            <td>Button size: small, medium, large</td>
                        </tr>
                        <tr>
                            <td><code>icon</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Icon name from LYD icon library</td>
                        </tr>
                        <tr>
                            <td><code>loading</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Shows loading spinner</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disables button interaction</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3>Next.js Integration</h3>
                <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto;"><code>
// app/properties/page.tsx
'use client';

import { useEffect } from 'react';

export default function PropertiesPage() {
  useEffect(() => {
    import('@/lib/lyd-design-system');
  }, []);

  return (
    &lt;div className="p-8"&gt;
      &lt;lyd-button 
        variant="primary" 
        size="large"
        onClick={() => createProperty()}
      &gt;
        Add New Property
      &lt;/lyd-button&gt;
    &lt;/div&gt;
  );
}
                </code></pre>
            </section>
        </div>
        
        <!-- Tab Content: Accessibility -->
        <div class="tab-content" id="accessibility">
            <section class="lyd-section">
                <h2 class="lyd-section-title">Accessibility Guidelines</h2>
                
                <div class="callout">
                    <strong>WCAG 2.1 AA Compliant</strong>
                    <p>All button components meet accessibility standards</p>
                </div>
                
                <h3>Keyboard Navigation</h3>
                <ul>
                    <li><kbd>Tab</kbd> - Navigate between buttons</li>
                    <li><kbd>Space</kbd> / <kbd>Enter</kbd> - Activate button</li>
                    <li><kbd>Esc</kbd> - Cancel action (if applicable)</li>
                </ul>
                
                <h3>Screen Reader Support</h3>
                <ul>
                    <li>All buttons have proper ARIA labels</li>
                    <li>Icon-only buttons include descriptive text</li>
                    <li>Loading states announce to screen readers</li>
                    <li>Disabled states are properly communicated</li>
                </ul>
            </section>
        </div>
        '''
    }
}

def generate_page_content(template_key):
    """Generiert den Seiteninhalt basierend auf dem Template"""
    if template_key not in TEMPLATES:
        return None
    
    template = TEMPLATES[template_key]
    
    # Base Template laden
    base_template_path = Path(__file__).parent.parent / 'templates' / 'base-template.html'
    with open(base_template_path, 'r', encoding='utf-8') as f:
        base_template = f.read()
    
    # Template-Variablen ersetzen
    content = base_template.replace('{{PAGE_TITLE}}', template['title'])
    content = content.replace('{{PAGE_SUBTITLE}}', template['subtitle'])
    content = content.replace('{{COMPONENT_IMPORTS}}', template['imports'])
    content = content.replace('{{COMPONENT_STYLES}}', template['styles'])
    content = content.replace('{{PAGE_CONTENT}}', template['content'])
    content = content.replace('{{ADDITIONAL_HEAD}}', '')
    content = content.replace('{{ADDITIONAL_SCRIPTS}}', '''
        // Tab switching functionality
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                contents.forEach(c => c.classList.remove('active'));
                const target = document.getElementById(targetId);
                if (target) target.classList.add('active');
                
                window.location.hash = targetId;
            });
        });
        
        // Handle initial hash
        if (window.location.hash) {
            const tab = document.querySelector(`[data-tab="${window.location.hash.slice(1)}"]`);
            if (tab) tab.click();
        }

        // Icon library functionality
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const module = await import('../../src/icons/icon-library.js');
                const icons = module.LYD_ICONS;
                
                const iconGrid = document.getElementById('icon-grid');
                const iconSearch = document.getElementById('icon-search');
                
                if (iconGrid && iconSearch) {
                    function displayIcons(filter = '') {
                        iconGrid.innerHTML = '';
                        Object.keys(icons)
                            .filter(name => name.includes(filter.toLowerCase()))
                            .forEach(name => {
                                const item = document.createElement('div');
                                item.className = 'icon-item';
                                item.innerHTML = `
                                    <div class="icon-preview">${icons[name]}</div>
                                    <span class="icon-name">${name}</span>
                                `;
                                item.addEventListener('click', () => {
                                    navigator.clipboard.writeText(`<lyd-button icon="${name}">`);
                                    console.log(`Copied: <lyd-button icon="${name}">`);
                                });
                                iconGrid.appendChild(item);
                            });
                    }
                    
                    displayIcons();
                    iconSearch.addEventListener('input', (e) => displayIcons(e.target.value));
                }
            } catch (error) {
                console.error('Error loading icon library:', error);
            }
        });
    ''' if 'buttons' in template_key else '')
    
    return content

def main():
    """Konvertiert alle Seiten"""
    design_system_root = Path(__file__).parent.parent
    
    for template_key in TEMPLATES.keys():
        page_path = design_system_root / f"{template_key}/index.html"
        
        print(f"Converting {template_key}...")
        
        content = generate_page_content(template_key)
        if content:
            # Backup erstellen
            if page_path.exists():
                backup_path = page_path.with_suffix('.html.backup')
                page_path.rename(backup_path)
            
            # Neue Seite schreiben
            page_path.parent.mkdir(parents=True, exist_ok=True)
            with open(page_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ {template_key} converted successfully")
        else:
            print(f"❌ Template for {template_key} not found")

if __name__ == "__main__":
    main()
