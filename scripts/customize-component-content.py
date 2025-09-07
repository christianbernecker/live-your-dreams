#!/usr/bin/env python3
"""
Customize content for each component page with proper examples and content.
"""

import os
import re
from pathlib import Path

# High-quality SVG icons (consistent across all components)
SVG_ICONS = {
    'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
    'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    'email': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    'phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'location': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>',
    'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>',
    'x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    'settings': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>',
    'info': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m12 16-4-4 4-4"/></svg>',
    'building': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M6 8h12"/><path d="M6 16h12"/></svg>'
}

def customize_inputs_page():
    """Customize the inputs component page."""
    file_path = Path('design-system/components/inputs/index.html')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace overview section
    overview_content = '''                <h2 class="section-title">Input System Overview</h2>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-input-text</h3>
                        <p>Standard text input with validation and error states</p>
                        <div class="component-showcase">
                            <div class="luxury-input-group">
                                <input type="text" class="luxury-input" placeholder="Property Title" value="Modern Apartment">
                                <div class="luxury-input-icon">''' + SVG_ICONS['home'] + '''</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-input-email</h3>
                        <p>Email input with built-in validation</p>
                        <div class="component-showcase">
                            <div class="luxury-input-group">
                                <input type="email" class="luxury-input" placeholder="agent@liveyourdreams.de">
                                <div class="luxury-input-icon">''' + SVG_ICONS['email'] + '''</div>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-input-search</h3>
                        <p>Search input with integrated icon</p>
                        <div class="component-showcase">
                            <div class="luxury-input-group">
                                <input type="text" class="luxury-input" placeholder="Search properties...">
                                <div class="luxury-input-icon">''' + SVG_ICONS['search'] + '''</div>
                            </div>
                        </div>
                    </div>
                </div>'''
    
    content = re.sub(r'<h2 class="section-title">Button System Overview</h2>.*?</div>\s*</div>', 
                     overview_content + '\n        </div>', content, flags=re.DOTALL)
    
    # Add luxury input CSS
    input_css = '''
        /* Luxury Input Styles */
        .luxury-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 16px;
            font-family: 'Inter', system-ui, sans-serif;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .luxury-input:focus {
            outline: none;
            border-color: #0066ff;
            box-shadow: 
                0 0 0 4px rgba(0, 102, 255, 0.1),
                0 4px 16px rgba(0, 102, 255, 0.15);
            transform: translateY(-1px);
        }

        .luxury-input:hover:not(:focus):not(:disabled) {
            border-color: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .luxury-input:disabled {
            background: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .luxury-input.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .luxury-input.success {
            border-color: #10b981;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        /* Input Group with Icon */
        .luxury-input-group {
            position: relative;
            display: flex;
            align-items: center;
        }

        .luxury-input-group .luxury-input {
            padding-right: 48px;
        }

        .luxury-input-icon {
            position: absolute;
            right: 16px;
            color: #9ca3af;
            pointer-events: none;
            z-index: 1;
        }

        .luxury-input-icon svg {
            width: 20px;
            height: 20px;
        }'''
    
    # Insert input CSS after button styles
    content = re.sub(r'(/* Luxury Button Tile Styles \*/.*?\n)', 
                     r'\1\n' + input_css + '\n', content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Customized inputs page")

def customize_select_page():
    """Customize the select component page."""
    file_path = Path('design-system/components/select/index.html')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace overview section
    overview_content = '''                <h2 class="section-title">Select System Overview</h2>
                
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
                </div>'''
    
    content = re.sub(r'<h2 class="section-title">Button System Overview</h2>.*?</div>\s*</div>', 
                     overview_content + '\n        </div>', content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Customized select page")

def main():
    """Main function to customize all component pages."""
    print("🎨 Customizing component content...")
    
    customize_inputs_page()
    customize_select_page()
    
    print("✅ All component pages customized!")

if __name__ == '__main__':
    main()


