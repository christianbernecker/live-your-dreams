#!/usr/bin/env python3
"""
Comprehensive script to replace all button content with component-specific content
across all component pages in the design system.
"""

import os
import re

# Define the components and their specific content
COMPONENT_CONFIGS = {
    'select': {
        'title': 'Select Components',
        'subtitle': 'Dropdown selection components with search, multi-select, and grouped options for data filtering.',
        'overview_title': 'Select System Overview',
        'components': [
            {
                'name': 'lyd-select',
                'description': 'Standard dropdown with single selection',
                'showcase': '''
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Select Property Type</span>
                                    <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                </div>
                            </div>'''
            },
            {
                'name': 'lyd-multi-select',
                'description': 'Multi-selection dropdown with checkboxes',
                'showcase': '''
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Select Amenities</span>
                                    <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                </div>
                            </div>'''
            },
            {
                'name': 'lyd-searchable-select',
                'description': 'Searchable dropdown with filter functionality',
                'showcase': '''
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Search Location</span>
                                    <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
                                </div>
                            </div>'''
            }
        ]
    },
    'accordion': {
        'title': 'Accordion Components',
        'subtitle': 'Collapsible content sections with luxury styling and smooth animations for organized information display.',
        'overview_title': 'Accordion System Overview',
        'components': [
            {
                'name': 'lyd-accordion',
                'description': 'Primary accordion component with variants and icons',
                'showcase': '''
                            <div class="luxury-accordion">
                                <div class="accordion-item">
                                    <button class="accordion-trigger">
                                        <span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
                                            Property Details
                                        </span>
                                        <div class="accordion-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                    </button>
                                    <div class="accordion-content">
                                        <p>Complete property information including size, rooms, and amenities.</p>
                                    </div>
                                </div>
                            </div>'''
            },
            {
                'name': 'lyd-accordion-pure',
                'description': 'Minimal accordion without borders',
                'showcase': '''
                            <div class="luxury-accordion" style="background: none; border: none; box-shadow: none;">
                                <div class="accordion-item" style="border-bottom: 1px solid #e5e7eb;">
                                    <button class="accordion-trigger">
                                        <span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>
                                            Settings
                                        </span>
                                        <div class="accordion-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                    </button>
                                    <div class="accordion-content">
                                        <p>Property configuration and preferences.</p>
                                    </div>
                                </div>
                            </div>'''
            },
            {
                'name': 'lyd-accordion-tile',
                'description': 'Large tiles for dashboard navigation',
                'showcase': '''
                            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; cursor: pointer;">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M6 8h12"/><path d="M6 16h12"/></svg>
                                    <div>
                                        <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Properties</h4>
                                        <span style="font-size: 14px; color: #6b7280;">23 active</span>
                                    </div>
                                </div>
                            </div>'''
            }
        ]
    },
    'modal': {
        'title': 'Modal Components',
        'subtitle': 'Overlay dialogs and popups for focused interactions and important notifications.',
        'overview_title': 'Modal System Overview',
        'components': [
            {
                'name': 'lyd-modal',
                'description': 'Standard modal dialog with backdrop',
                'showcase': '''
                            <div style="position: relative; width: 300px; height: 200px; border: 2px solid #e5e7eb; border-radius: 12px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); padding: 24px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                    <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Property Details</h3>
                                    <svg style="width: 20px; height: 20px; color: #6b7280; cursor: pointer;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </div>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">View and edit property information</p>
                            </div>'''
            },
            {
                'name': 'lyd-modal-fullscreen',
                'description': 'Full-screen modal for complex forms',
                'showcase': '''
                            <div style="position: relative; width: 300px; height: 180px; border: 2px solid #3366CC; border-radius: 12px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(30px); box-shadow: 0 24px 48px rgba(51, 102, 204, 0.2); padding: 20px;">
                                <div style="text-align: center;">
                                    <svg style="width: 32px; height: 32px; color: #3366CC; margin-bottom: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
                                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Add Property</h3>
                                    <p style="margin: 0; color: #6b7280; font-size: 13px;">Full property creation form</p>
                                </div>
                            </div>'''
            }
        ]
    },
    'dropdown': {
        'title': 'Dropdown Components',
        'subtitle': 'Context menus and action lists with smooth animations and keyboard navigation.',
        'overview_title': 'Dropdown System Overview',
        'components': [
            {
                'name': 'lyd-dropdown',
                'description': 'Standard dropdown menu with actions',
                'showcase': '''
                            <div style="position: relative;">
                                <button class="luxury-btn outline">
                                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                    Actions
                                </button>
                                <div style="position: absolute; top: 100%; left: 0; margin-top: 8px; min-width: 160px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); padding: 8px;">
                                    <div style="padding: 8px 12px; font-size: 14px; color: #374151; cursor: pointer; border-radius: 4px;">Edit Property</div>
                                    <div style="padding: 8px 12px; font-size: 14px; color: #374151; cursor: pointer; border-radius: 4px;">Share</div>
                                    <div style="padding: 8px 12px; font-size: 14px; color: #ef4444; cursor: pointer; border-radius: 4px;">Delete</div>
                                </div>
                            </div>'''
            },
            {
                'name': 'lyd-dropdown-context',
                'description': 'Context menu for right-click actions',
                'showcase': '''
                            <div style="position: relative; width: 200px; height: 120px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 14px;">
                                Right-click area
                            </div>'''
            }
        ]
    },
    'checkbox': {
        'title': 'Checkbox Components',
        'subtitle': 'Selection controls for multiple choices with indeterminate states and custom styling.',
        'overview_title': 'Checkbox System Overview',
        'components': [
            {
                'name': 'lyd-checkbox',
                'description': 'Standard checkbox with custom styling',
                'showcase': '''
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 20px; height: 20px; border: 2px solid #3366CC; border-radius: 4px; background: #3366CC; display: flex; align-items: center; justify-content: center;">
                                    <svg style="width: 12px; height: 12px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
                                </div>
                                <label style="font-size: 14px; color: #374151; cursor: pointer;">Swimming Pool</label>
                            </div>'''
            },
            {
                'name': 'lyd-checkbox-group',
                'description': 'Grouped checkboxes with validation',
                'showcase': '''
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 20px; height: 20px; border: 2px solid #3366CC; border-radius: 4px; background: #3366CC; display: flex; align-items: center; justify-content: center;">
                                        <svg style="width: 12px; height: 12px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
                                    </div>
                                    <label style="font-size: 14px; color: #374151;">Garden</label>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 4px; background: white;"></div>
                                    <label style="font-size: 14px; color: #374151;">Garage</label>
                                </div>
                            </div>'''
            }
        ]
    },
    'radio': {
        'title': 'Radio Components',
        'subtitle': 'Single selection controls for mutually exclusive options with custom styling.',
        'overview_title': 'Radio System Overview',
        'components': [
            {
                'name': 'lyd-radio',
                'description': 'Standard radio button with custom styling',
                'showcase': '''
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 20px; height: 20px; border: 2px solid #3366CC; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center;">
                                    <div style="width: 8px; height: 8px; background: #3366CC; border-radius: 50%;"></div>
                                </div>
                                <label style="font-size: 14px; color: #374151; cursor: pointer;">For Sale</label>
                            </div>'''
            },
            {
                'name': 'lyd-radio-group',
                'description': 'Grouped radio buttons with validation',
                'showcase': '''
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 20px; height: 20px; border: 2px solid #3366CC; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center;">
                                        <div style="width: 8px; height: 8px; background: #3366CC; border-radius: 50%;"></div>
                                    </div>
                                    <label style="font-size: 14px; color: #374151;">Apartment</label>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 50%; background: white;"></div>
                                    <label style="font-size: 14px; color: #374151;">House</label>
                                </div>
                            </div>'''
            }
        ]
    },
    'toast': {
        'title': 'Toast Components',
        'subtitle': 'Notification messages with auto-dismiss and action buttons for user feedback.',
        'overview_title': 'Toast System Overview',
        'components': [
            {
                'name': 'lyd-toast-success',
                'description': 'Success notification with icon',
                'showcase': '''
                            <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 8px; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3); backdrop-filter: blur(20px); max-width: 300px;">
                                <svg style="width: 20px; height: 20px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 2px;">Property Saved</div>
                                    <div style="font-size: 13px; opacity: 0.9;">Changes have been saved successfully</div>
                                </div>
                            </div>'''
            },
            {
                'name': 'lyd-toast-error',
                'description': 'Error notification with action',
                'showcase': '''
                            <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border-radius: 8px; box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3); backdrop-filter: blur(20px); max-width: 300px;">
                                <svg style="width: 20px; height: 20px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 2px;">Upload Failed</div>
                                    <div style="font-size: 13px; opacity: 0.9;">Could not save property image</div>
                                </div>
                            </div>'''
            }
        ]
    }
}

def update_component_file(component_name, config):
    """Update a component file with specific content."""
    file_path = f'/Users/christianbernecker/live-your-dreams/design-system/components/{component_name}/index.html'
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update title and subtitle in head and page header
        content = re.sub(
            r'<title>[^<]+</title>',
            f'<title>{config["title"]} - LYD Design System</title>',
            content
        )
        
        content = re.sub(
            r'<h1 class="page-title">[^<]+</h1>',
            f'<h1 class="page-title">{config["title"]}</h1>',
            content
        )
        
        content = re.sub(
            r'<p class="page-subtitle">[^<]+</p>',
            f'<p class="page-subtitle">{config["subtitle"]}</p>',
            content
        )
        
        # Update overview section title
        content = re.sub(
            r'<h2 class="section-title">Button System Overview</h2>',
            f'<h2 class="section-title">{config["overview_title"]}</h2>',
            content
        )
        
        # Build component cards
        component_cards = []
        for comp in config['components']:
            card = f'''                    <div class="component-card">
                        <h3>{comp["name"]}</h3>
                        <p>{comp["description"]}</p>
                        <div class="component-showcase">{comp["showcase"]}
                        </div>
                    </div>'''
            component_cards.append(card)
        
        # Replace component grid content
        new_grid_content = f'''                <div class="component-grid">
{chr(10).join(component_cards)}
                </div>'''
        
        # Find and replace the component grid section
        grid_pattern = r'<div class="component-grid">.*?</div>\s*</div>'
        content = re.sub(grid_pattern, new_grid_content + '\n            </div>', content, flags=re.DOTALL)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated {component_name} component")
        
    except Exception as e:
        print(f"❌ Error updating {component_name}: {str(e)}")

def main():
    """Update all component files with their specific content."""
    print("🔄 Updating all component files with specific content...")
    
    for component_name, config in COMPONENT_CONFIGS.items():
        update_component_file(component_name, config)
    
    print("\n✅ All component files have been updated!")
    print("\nNext steps:")
    print("1. Build and deploy the Docker image")
    print("2. Verify all component pages show correct content")
    print("3. Check that no 'Button' references remain")

if __name__ == "__main__":
    main()


