#!/usr/bin/env python3
"""
Rebuild all component pages using the button template as base.
This script creates high-quality, consistent component pages.
"""

import os
import shutil
import re
from pathlib import Path

# Component configuration
COMPONENTS = {
    'inputs': {
        'title': 'Input Components',
        'subtitle': 'Complete input system with validation, icons, and specialized components for real estate data entry.',
        'has_variants': True,
        'has_icons': True,
        'variants': ['Default', 'Error', 'Success', 'Disabled', 'Small', 'Large'],
        'icons': ['search', 'email', 'phone', 'location', 'calendar', 'user', 'lock', 'dollar-sign']
    },
    'select': {
        'title': 'Select Components', 
        'subtitle': 'Dropdown selection components with search, multi-select, and grouped options for data filtering.',
        'has_variants': True,
        'has_icons': True,
        'variants': ['Default', 'Searchable', 'Multi-Select', 'Grouped'],
        'icons': ['chevron-down', 'search', 'check', 'x']
    },
    'accordion': {
        'title': 'Accordion Components',
        'subtitle': 'Collapsible content sections with luxury styling and smooth animations for organized information display.',
        'has_variants': True,
        'has_icons': False,
        'variants': ['Default', 'Pure', 'Tile']
    },
    'modal': {
        'title': 'Modal Components',
        'subtitle': 'Overlay dialogs and popups for focused interactions and important notifications.',
        'has_variants': False,
        'has_icons': False
    },
    'dropdown': {
        'title': 'Dropdown Components',
        'subtitle': 'Context menus and navigation dropdowns with actions and links for user interactions.',
        'has_variants': True,
        'has_icons': True,
        'variants': ['Context Menu', 'Navigation', 'Action Menu'],
        'icons': ['more-vertical', 'edit', 'trash', 'share', 'download']
    },
    'checkbox': {
        'title': 'Checkbox Components',
        'subtitle': 'Selection controls for multiple choices with indeterminate states and custom styling.',
        'has_variants': True,
        'has_icons': False,
        'variants': ['Default', 'Checked', 'Indeterminate', 'Disabled']
    },
    'radio': {
        'title': 'Radio Components',
        'subtitle': 'Single selection controls for mutually exclusive options with custom styling.',
        'has_variants': True,
        'has_icons': False,
        'variants': ['Default', 'Selected', 'Disabled']
    },
    'toast': {
        'title': 'Toast Components',
        'subtitle': 'Notification messages with different severity levels and auto-dismiss functionality.',
        'has_variants': True,
        'has_icons': False,
        'variants': ['Success', 'Error', 'Warning', 'Info']
    }
}

def create_component_page(component_name, config):
    """Create a component page based on the button template."""
    
    base_dir = Path('design-system/components')
    button_template = base_dir / 'buttons' / 'index.html'
    component_dir = base_dir / component_name
    component_file = component_dir / 'index.html'
    
    # Read button template
    with open(button_template, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace title and meta info
    content = content.replace('Button Components - LYD Design System', f"{config['title']} - LYD Design System")
    content = content.replace('Button Components', config['title'])
    content = content.replace('Complete button system with variants, icons, and specialized components for real estate applications.', config['subtitle'])
    
    # Update navigation
    nav_pattern = r'<a href="/components/buttons/" class="nav-item">Button</a>'
    nav_replacement = f'<a href="/components/buttons/" class="nav-item">Button</a>\n                <a href="/components/{component_name}/" class="nav-item active">{config["title"].split()[0]}</a>'
    content = re.sub(nav_pattern, nav_replacement, content)
    
    # Hide tabs if not needed
    if not config['has_variants']:
        content = re.sub(r'<button class="tab" data-tab="variants">Variants</button>\s*', '', content)
        content = re.sub(r'<div class="tab-content" id="variants">.*?</div>\s*(?=<div class="tab-content")', '', content, flags=re.DOTALL)
    
    if not config['has_icons']:
        content = re.sub(r'<button class="tab" data-tab="icons">Icon Library</button>\s*', '', content)
        content = re.sub(r'<div class="tab-content" id="icons">.*?</div>\s*(?=<div class="tab-content")', '', content, flags=re.DOTALL)
    
    # Create component directory if it doesn't exist
    component_dir.mkdir(exist_ok=True)
    
    # Write the new file
    with open(component_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Created {component_name} page")

def main():
    """Main function to rebuild all component pages."""
    print("🔄 Rebuilding all component pages...")
    
    for component_name, config in COMPONENTS.items():
        # Delete existing file if it exists
        component_file = Path(f'design-system/components/{component_name}/index.html')
        if component_file.exists():
            component_file.unlink()
            print(f"🗑️  Deleted existing {component_name} page")
        
        # Create new page
        create_component_page(component_name, config)
    
    print("✅ All component pages rebuilt successfully!")

if __name__ == '__main__':
    main()


