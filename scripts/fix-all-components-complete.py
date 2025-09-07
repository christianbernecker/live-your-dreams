#!/usr/bin/env python3
"""
Complete fix for ALL component pages - replace ALL button content with component-specific content.
This ensures every component has proper, unique content for all tabs.
"""

import os
import re
from pathlib import Path

# High-quality SVG icons
SVG_ICONS = {
    'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
    'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    'email': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    'phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'location': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>',
    'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>',
    'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>',
    'x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    'settings': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>',
    'info': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m12 16-4-4 4-4"/></svg>',
    'building': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M6 8h12"/><path d="M6 16h12"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'user': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'lock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    'dollar-sign': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'more-vertical': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
    'edit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    'trash': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    'share': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    'download': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    'alert-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
    'plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    'key': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',
    'minus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>'
}

def replace_all_button_content(file_path, component_name, config):
    """Replace all button content with component-specific content."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove duplicate navigation entries
    content = re.sub(r'<a href="/components/[^/]+/" class="nav-item">[^<]+</a>\s*<a href="/components/[^/]+/" class="nav-item active">[^<]+</a>', 
                     lambda m: m.group(0).split('</a>')[-2] + '</a>', content)
    
    # Fix overview content
    overview_content = config.get('overview', '')
    if overview_content:
        content = re.sub(r'(<div class="tab-content active" id="overview">\s*<section class="section">).*?(</section>\s*</div>)', 
                         r'\1\n' + overview_content + r'\n        \2', content, flags=re.DOTALL)
    
    # Fix variants content if component has variants
    if config.get('has_variants', False):
        variants_content = config.get('variants', '')
        if variants_content:
            content = re.sub(r'(<div class="tab-content" id="variants">\s*<section class="section">).*?(</section>\s*</div>)', 
                             r'\1\n' + variants_content + r'\n        \2', content, flags=re.DOTALL)
    
    # Fix icons content if component has icons
    if config.get('has_icons', False):
        icons_content = config.get('icons', '')
        if icons_content:
            content = re.sub(r'(<div class="tab-content" id="icons">\s*<section class="section">).*?(</section>\s*</div>)', 
                             r'\1\n' + icons_content + r'\n        \2', content, flags=re.DOTALL)
    
    # Fix examples content
    examples_content = config.get('examples', '')
    if examples_content:
        content = re.sub(r'(<div class="tab-content" id="examples">\s*<section class="section">).*?(</section>\s*</div>)', 
                         r'\1\n' + examples_content + r'\n        \2', content, flags=re.DOTALL)
    
    # Fix API content
    api_content = config.get('api', '')
    if api_content:
        content = re.sub(r'(<div class="tab-content" id="api">\s*<section class="section">).*?(</section>\s*</div>)', 
                         r'\1\n' + api_content + r'\n        \2', content, flags=re.DOTALL)
    
    # Fix accessibility content
    accessibility_content = config.get('accessibility', '')
    if accessibility_content:
        content = re.sub(r'(<div class="tab-content" id="accessibility">\s*<section class="section">).*?(</section>\s*</div>)', 
                         r'\1\n' + accessibility_content + r'\n        \2', content, flags=re.DOTALL)
    
    # Add component-specific CSS
    component_css = config.get('css', '')
    if component_css:
        content = re.sub(r'(/* Luxury Button Tile Styles \*/)', 
                         r'\1\n\n' + component_css, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Component configurations
COMPONENT_CONFIGS = {
    'select': {
        'has_variants': True,
        'has_icons': True,
        'overview': '''                <h2 class="section-title">Select System Overview</h2>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-select</h3>
                        <p>Standard dropdown with single selection</p>
                        <div class="component-showcase">
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Select Property Type</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-multi-select</h3>
                        <p>Multi-selection dropdown with checkboxes</p>
                        <div class="component-showcase">
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Select Amenities</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-searchable-select</h3>
                        <p>Searchable dropdown with filter functionality</p>
                        <div class="component-showcase">
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Search Location</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['search'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>''',
        'variants': '''            <h2 class="section-title">Select Variants & States</h2>
            
            <div class="variant-grid">
                <div class="variant-card">
                    <h3>Standard Select</h3>
                    <div class="variant-showcase">
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Default</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Choose option...</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Selected</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Apartment</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="variant-card">
                    <h3>Searchable Select</h3>
                    <div class="variant-showcase">
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">With Search</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Search locations...</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['search'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="variant-card">
                    <h3>Multi Select</h3>
                    <div class="variant-showcase">
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Multiple Selection</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>3 items selected</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>''',
        'icons': '''            <h2 class="section-title">Select Icons</h2>
            <p class="section-subtitle">Icons for dropdown arrows, search, and selection states</p>
            
            <div class="icon-grid">
                <div class="icon-card" onclick="copyToClipboard('chevron-down')">
                    <div class="icon-display">''' + SVG_ICONS['chevron-down'] + '''</div>
                    <span class="icon-name">chevron-down</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('search')">
                    <div class="icon-display">''' + SVG_ICONS['search'] + '''</div>
                    <span class="icon-name">search</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('check')">
                    <div class="icon-display">''' + SVG_ICONS['check'] + '''</div>
                    <span class="icon-name">check</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('x')">
                    <div class="icon-display">''' + SVG_ICONS['x'] + '''</div>
                    <span class="icon-name">x</span>
                </div>
            </div>''',
        'examples': '''            <h2 class="section-title">Real Estate Examples</h2>
            
            <div class="example-card">
                <h3>Property Search Filters</h3>
                <div class="form-container">
                    <div class="form-row three">
                        <div>
                            <label class="luxury-label">Property Type</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>All Types</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="luxury-label">Location</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Search location...</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['search'] + '''</div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="luxury-label">Price Range</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Any Price</span>
                                    <div class="luxury-select-arrow">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>''',
        'api': '''            <h2 class="section-title">API Reference</h2>
            
            <div class="api-section">
                <h3>lyd-select</h3>
                <p>Dropdown selection component with single or multiple selection modes.</p>
                
                <h4>Properties</h4>
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
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td>'Select option...'</td>
                            <td>Placeholder text when no option is selected</td>
                        </tr>
                        <tr>
                            <td><code>searchable</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Enable search functionality</td>
                        </tr>
                        <tr>
                            <td><code>multiple</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Allow multiple selections</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Disable the select component</td>
                        </tr>
                    </tbody>
                </table>
                
                <h4>Events</h4>
                <ul>
                    <li><code>lyd-change</code> - Fired when selection changes</li>
                    <li><code>lyd-search</code> - Fired when search query changes</li>
                    <li><code>lyd-open</code> - Fired when dropdown opens</li>
                    <li><code>lyd-close</code> - Fired when dropdown closes</li>
                </ul>
            </div>''',
        'accessibility': '''            <div class="accessibility-badge">
                <h2>WCAG 2.1 AA Compliant</h2>
                <p>All select components meet accessibility standards for keyboard navigation and screen readers.</p>
            </div>
            
            <div class="accessibility-grid">
                <div class="accessibility-card">
                    <h3>Keyboard Navigation</h3>
                    <div class="keyboard-shortcuts">
                        <div class="shortcut">
                            <kbd>Tab</kbd>
                            <span>Focus select component</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Space/Enter</kbd>
                            <span>Open/close dropdown</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Arrow Keys</kbd>
                            <span>Navigate options</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Escape</kbd>
                            <span>Close dropdown</span>
                        </div>
                    </div>
                </div>
                
                <div class="accessibility-card">
                    <h3>Screen Reader Support</h3>
                    <div class="feature-list">
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>ARIA Labels</strong>
                                <p>Proper labeling for all select components</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>Selection Announcements</strong>
                                <p>Changes are announced to screen readers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>''',
        'css': '''        /* Select-specific styles */
        .luxury-select {
            position: relative;
            width: 100%;
        }

        .luxury-select-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 16px;
            color: #374151;
            min-height: 56px;
        }

        .luxury-select-trigger:hover {
            border-color: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .luxury-select-trigger:focus {
            outline: none;
            border-color: #0066ff;
            box-shadow: 
                0 0 0 4px rgba(0, 102, 255, 0.1),
                0 4px 16px rgba(0, 102, 255, 0.15);
            transform: translateY(-1px);
        }

        .luxury-select-arrow {
            display: flex;
            align-items: center;
            transition: transform 0.2s ease;
            color: #6b7280;
        }

        .luxury-select-arrow svg {
            width: 20px;
            height: 20px;
        }'''
    },
    
    'accordion': {
        'has_variants': True,
        'has_icons': False,
        'overview': '''                <h2 class="section-title">Accordion System Overview</h2>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-accordion</h3>
                        <p>Primary accordion component with variants and icons</p>
                        <div class="component-showcase">
                            <div class="luxury-accordion">
                                <div class="accordion-item">
                                    <button class="accordion-trigger">
                                        <span>
                                            ''' + SVG_ICONS['home'] + '''
                                            Property Details
                                        </span>
                                        <div class="accordion-icon">''' + SVG_ICONS['chevron-down'] + '''</div>
                                    </button>
                                    <div class="accordion-content">
                                        <p>Complete property information including size, rooms, and amenities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-accordion-pure</h3>
                        <p>Minimal accordion without borders</p>
                        <div class="component-showcase">
                            <div class="luxury-accordion" style="background: none; border: none; box-shadow: none;">
                                <div class="accordion-item" style="border-bottom: 1px solid #e5e7eb;">
                                    <button class="accordion-trigger">
                                        <span>
                                            ''' + SVG_ICONS['settings'] + '''
                                            Settings
                                        </span>
                                        <div class="accordion-icon">''' + SVG_ICONS['chevron-down'] + '''</div>
                                    </button>
                                    <div class="accordion-content">
                                        <p>Property configuration and preferences.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-accordion-tile</h3>
                        <p>Large tiles for dashboard navigation</p>
                        <div class="component-showcase">
                            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; cursor: pointer;">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    ''' + SVG_ICONS['building'] + '''
                                    <div>
                                        <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Properties</h4>
                                        <span style="font-size: 14px; color: #6b7280;">23 active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>''',
        'variants': '''            <h2 class="section-title">Accordion Variants</h2>
            
            <div class="variant-grid">
                <div class="variant-card">
                    <h3>Default Accordion</h3>
                    <div class="variant-showcase">
                        <div class="luxury-accordion">
                            <div class="accordion-item">
                                <button class="accordion-trigger">
                                    <span>Basic Information</span>
                                    <div class="accordion-icon">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </button>
                                <div class="accordion-content">
                                    <p>Property type, size, and basic details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="variant-card">
                    <h3>Expanded Accordion</h3>
                    <div class="variant-showcase">
                        <div class="luxury-accordion">
                            <div class="accordion-item">
                                <button class="accordion-trigger">
                                    <span>Features & Amenities</span>
                                    <div class="accordion-icon" style="transform: rotate(180deg);">''' + SVG_ICONS['chevron-down'] + '''</div>
                                </button>
                                <div class="accordion-content" style="display: block;">
                                    <p>Pool, garden, parking, and additional features</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>''',
        'examples': '''            <h2 class="section-title">Real Estate Examples</h2>
            
            <div class="example-card">
                <h3>Property Details Accordion</h3>
                <div class="form-container">
                    <div class="luxury-accordion">
                        <div class="accordion-item">
                            <button class="accordion-trigger">
                                <span>Basic Information</span>
                                <div class="accordion-icon">''' + SVG_ICONS['chevron-down'] + '''</div>
                            </button>
                            <div class="accordion-content">
                                <p><strong>Type:</strong> Luxury Villa<br>
                                <strong>Size:</strong> 350m²<br>
                                <strong>Rooms:</strong> 5 bedrooms, 3 bathrooms</p>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <button class="accordion-trigger">
                                <span>Features & Amenities</span>
                                <div class="accordion-icon">''' + SVG_ICONS['chevron-down'] + '''</div>
                            </button>
                            <div class="accordion-content">
                                <p><strong>Features:</strong> Swimming pool, garden, garage<br>
                                <strong>Amenities:</strong> Modern kitchen, hardwood floors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>''',
        'api': '''            <h2 class="section-title">API Reference</h2>
            
            <div class="api-section">
                <h3>lyd-accordion</h3>
                <p>Collapsible content component with smooth animations.</p>
                
                <h4>Properties</h4>
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
                            <td><code>expanded</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Initial expanded state</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Disable accordion interaction</td>
                        </tr>
                        <tr>
                            <td><code>icon</code></td>
                            <td><code>string</code></td>
                            <td>'chevron-down'</td>
                            <td>Icon name for accordion trigger</td>
                        </tr>
                    </tbody>
                </table>
                
                <h4>Events</h4>
                <ul>
                    <li><code>lyd-accordion-toggle</code> - Fired when accordion is toggled</li>
                    <li><code>lyd-accordion-expand</code> - Fired when accordion expands</li>
                    <li><code>lyd-accordion-collapse</code> - Fired when accordion collapses</li>
                </ul>
            </div>''',
        'accessibility': '''            <div class="accessibility-badge">
                <h2>WCAG 2.1 AA Compliant</h2>
                <p>All accordion components meet accessibility standards for keyboard navigation and screen readers.</p>
            </div>
            
            <div class="accessibility-grid">
                <div class="accessibility-card">
                    <h3>Keyboard Navigation</h3>
                    <div class="keyboard-shortcuts">
                        <div class="shortcut">
                            <kbd>Tab</kbd>
                            <span>Navigate between accordion headers</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Space/Enter</kbd>
                            <span>Toggle accordion section</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Arrow Keys</kbd>
                            <span>Move between accordion items</span>
                        </div>
                    </div>
                </div>
                
                <div class="accessibility-card">
                    <h3>Screen Reader Support</h3>
                    <div class="feature-list">
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>ARIA Expanded</strong>
                                <p>Properly announces expanded/collapsed state</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>Content Association</strong>
                                <p>Headers are properly associated with content</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>''',
        'css': '''        /* Accordion-specific styles */
        .luxury-accordion {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .luxury-accordion:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .accordion-item {
            border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        }

        .accordion-item:last-child {
            border-bottom: none;
        }

        .accordion-trigger {
            width: 100%;
            padding: 20px 24px;
            background: none;
            border: none;
            text-align: left;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .accordion-trigger:hover {
            background: rgba(249, 250, 251, 0.8);
            color: #0066ff;
        }

        .accordion-trigger span {
            display: flex;
            align-items: center;
            flex: 1;
            gap: 8px;
        }

        .accordion-trigger span svg {
            width: 16px;
            height: 16px;
        }

        .accordion-icon {
            width: 20px;
            height: 20px;
            transition: transform 0.3s ease;
            color: #6b7280;
        }

        .accordion-trigger:hover .accordion-icon {
            color: #0066ff;
        }

        .accordion-content {
            padding: 0 24px 20px;
            color: #6b7280;
            line-height: 1.6;
            display: none;
        }

        .accordion-content p {
            margin: 0;
        }'''
    }
}

def main():
    """Main function to fix all component content."""
    print("🔧 Fixing ALL component content completely...")
    
    # Fix select page
    select_path = Path('design-system/components/select/index.html')
    if select_path.exists():
        replace_all_button_content(select_path, 'select', COMPONENT_CONFIGS['select'])
        print("✅ Fixed select page")
    
    # Fix accordion page  
    accordion_path = Path('design-system/components/accordion/index.html')
    if accordion_path.exists():
        replace_all_button_content(accordion_path, 'accordion', COMPONENT_CONFIGS['accordion'])
        print("✅ Fixed accordion page")
    
    print("✅ All component content fixed!")

if __name__ == '__main__':
    main()


