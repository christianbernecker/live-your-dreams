#!/usr/bin/env python3
"""
Robust Design System Builder - Porsche-Level Quality
Systematischer Aufbau aller Component-Seiten mit Validierung und Backup.
"""

import os
import shutil
import json
from datetime import datetime

class DesignSystemBuilder:
    def __init__(self):
        self.base_path = '/Users/christianbernecker/live-your-dreams/design-system/components'
        self.template_path = f'{self.base_path}/buttons/index.html'
        self.backup_dir = '/Users/christianbernecker/live-your-dreams/backups'
        self.ensure_backup_dir()
    
    def ensure_backup_dir(self):
        """Erstelle Backup-Verzeichnis."""
        os.makedirs(self.backup_dir, exist_ok=True)
    
    def backup_file(self, file_path, component_name):
        """Erstelle Backup vor Änderungen."""
        if os.path.exists(file_path):
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_path = f'{self.backup_dir}/{component_name}_{timestamp}.html'
            shutil.copy2(file_path, backup_path)
            print(f"📦 Backup created: {backup_path}")
    
    def load_template(self):
        """Lade Button-Template als Basis."""
        with open(self.template_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def get_input_component_config(self):
        """Definiere Input-Komponenten nach Material Design / Ant Design Standards."""
        return {
            'meta': {
                'title': 'Input Components',
                'subtitle': 'Complete input system with validation, icons, and specialized components for real estate data entry.',
                'nav_active': 'inputs'
            },
            'overview': {
                'title': 'Input System Overview',
                'components': [
                    {
                        'name': 'lyd-input-text',
                        'description': 'Standard text input with luxury styling and validation',
                        'showcase': '<input type="text" class="luxury-input" placeholder="Property title" value="Luxury Villa Munich" />'
                    },
                    {
                        'name': 'lyd-input-number',
                        'description': 'Number input for prices, areas, and room counts',
                        'showcase': '<input type="number" class="luxury-input" placeholder="Price in €" value="2,500,000" />'
                    },
                    {
                        'name': 'lyd-input-email',
                        'description': 'Email input with built-in validation patterns',
                        'showcase': '<input type="email" class="luxury-input" placeholder="Contact email" value="agent@liveyourdreams.de" />'
                    },
                    {
                        'name': 'lyd-input-search',
                        'description': 'Search input with integrated icon and filtering',
                        'showcase': '''<div style="position: relative;">
                            <input type="search" class="luxury-input" placeholder="Search properties..." style="padding-left: 48px;" />
                            <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #6b7280;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        </div>'''
                    },
                    {
                        'name': 'lyd-textarea',
                        'description': 'Multi-line text area for descriptions and notes',
                        'showcase': '<textarea class="luxury-input" rows="3" placeholder="Property description">Beautiful luxury villa with panoramic views...</textarea>'
                    },
                    {
                        'name': 'lyd-select',
                        'description': 'Dropdown selection with custom luxury styling',
                        'showcase': '''<div class="luxury-select">
                            <div class="luxury-select-trigger">
                                <span>Apartment</span>
                                <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                            </div>
                        </div>'''
                    }
                ]
            },
            'variants': {
                'title': 'Input Variants & States',
                'variants': [
                    {
                        'name': 'Default State',
                        'description': 'Standard input appearance',
                        'showcase': '''<div>
                            <label class="luxury-label">Property Title</label>
                            <input type="text" class="luxury-input" placeholder="Enter property title" />
                        </div>'''
                    },
                    {
                        'name': 'Success State',
                        'description': 'Valid input with confirmation',
                        'showcase': '''<div>
                            <label class="luxury-label">Property Title</label>
                            <input type="text" class="luxury-input" value="Luxury Villa Munich" style="border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);" />
                            <div style="margin-top: 6px; font-size: 13px; color: #10b981; display: flex; align-items: center; gap: 6px;">
                                <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>
                                Valid property title
                            </div>
                        </div>'''
                    },
                    {
                        'name': 'Error State',
                        'description': 'Invalid input with error message',
                        'showcase': '''<div>
                            <label class="luxury-label">Email Address</label>
                            <input type="email" class="luxury-input" value="invalid-email" style="border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);" />
                            <div style="margin-top: 6px; font-size: 13px; color: #ef4444; display: flex; align-items: center; gap: 6px;">
                                <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                Please enter a valid email address
                            </div>
                        </div>'''
                    },
                    {
                        'name': 'Disabled State',
                        'description': 'Non-editable input fields',
                        'showcase': '''<div>
                            <label class="luxury-label" style="color: #9ca3af;">Property ID</label>
                            <input type="text" class="luxury-input" value="AUTO-GENERATED" disabled style="background: #f9fafb; color: #9ca3af; cursor: not-allowed;" />
                        </div>'''
                    },
                    {
                        'name': 'Input Sizes',
                        'description': 'Small, medium, and large input sizes',
                        'showcase': '''<div style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <label class="luxury-label" style="font-size: 12px;">Small Input</label>
                                <input type="text" class="luxury-input" placeholder="Small input" style="padding: 10px 16px; min-height: 40px; font-size: 14px;" />
                            </div>
                            <div>
                                <label class="luxury-label">Medium Input (Default)</label>
                                <input type="text" class="luxury-input" placeholder="Medium input" />
                            </div>
                            <div>
                                <label class="luxury-label" style="font-size: 16px;">Large Input</label>
                                <input type="text" class="luxury-input" placeholder="Large input" style="padding: 20px 24px; min-height: 64px; font-size: 18px;" />
                            </div>
                        </div>'''
                    }
                ]
            },
            'examples': {
                'title': 'Real Estate Form Examples',
                'examples': [
                    {
                        'name': 'Property Creation Form',
                        'description': 'Complete form for adding new properties',
                        'showcase': '''<div class="form-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                            <div>
                                <label class="luxury-label">Property Title *</label>
                                <input type="text" class="luxury-input" placeholder="Enter property title" required />
                            </div>
                            <div>
                                <label class="luxury-label">Property Type *</label>
                                <div class="luxury-select">
                                    <div class="luxury-select-trigger">
                                        <span>Select type</span>
                                        <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="luxury-label">Price in €</label>
                                <input type="number" class="luxury-input" placeholder="0" min="0" step="1000" />
                            </div>
                            <div>
                                <label class="luxury-label">Area in m²</label>
                                <input type="number" class="luxury-input" placeholder="0" min="1" />
                            </div>
                        </div>
                        <div style="margin-top: 24px;">
                            <label class="luxury-label">Property Description</label>
                            <textarea class="luxury-input" rows="4" placeholder="Describe the property features, location, and unique selling points..."></textarea>
                        </div>'''
                    }
                ]
            },
            'api': {
                'title': 'Input API Reference',
                'component': 'lyd-input',
                'properties': [
                    {'name': 'type', 'type': 'string', 'default': 'text', 'description': 'Input type: text, email, number, search, tel, url'},
                    {'name': 'size', 'type': 'string', 'default': 'medium', 'description': 'Input size: small, medium, large'},
                    {'name': 'state', 'type': 'string', 'default': 'default', 'description': 'Visual state: default, success, error, disabled'},
                    {'name': 'required', 'type': 'boolean', 'default': 'false', 'description': 'Mark input as required for validation'},
                    {'name': 'disabled', 'type': 'boolean', 'default': 'false', 'description': 'Disable input interaction'}
                ]
            }
        }
    
    def build_component_page(self, component_name, config):
        """Baue eine Component-Seite mit Validierung."""
        print(f"\n🔄 Building {component_name} component page...")
        
        file_path = f'{self.base_path}/{component_name}/index.html'
        
        # 1. Backup existing file
        self.backup_file(file_path, component_name)
        
        # 2. Load template
        content = self.load_template()
        
        # 3. Apply systematic replacements
        content = self.apply_meta_data(content, config['meta'])
        content = self.apply_overview_section(content, config['overview'])
        content = self.apply_variants_section(content, config['variants'])
        content = self.apply_examples_section(content, config['examples'])
        content = self.apply_api_section(content, config['api'])
        
        # 4. Add component-specific CSS
        content = self.add_input_css(content)
        
        # 5. Write file with validation
        self.write_and_validate(file_path, content, component_name)
    
    def apply_meta_data(self, content, meta):
        """Ersetze Meta-Daten (Title, Subtitle, Navigation)."""
        content = content.replace('Button Components - LYD Design System', f'{meta["title"]} - LYD Design System')
        content = content.replace('<h1 class="page-title">Button Components</h1>', f'<h1 class="page-title">{meta["title"]}</h1>')
        content = content.replace('<p class="page-subtitle">Interactive elements for user actions with luxury styling, micro-animations, and comprehensive state management.</p>', f'<p class="page-subtitle">{meta["subtitle"]}</p>')
        
        # Navigation active state
        content = content.replace('<a href="/components/buttons/" class="nav-item active">Button</a>', '<a href="/components/buttons/" class="nav-item">Button</a>')
        content = content.replace(f'<a href="/components/{meta["nav_active"]}/" class="nav-item">Input</a>', f'<a href="/components/{meta["nav_active"]}/" class="nav-item active">Input</a>')
        
        return content
    
    def apply_overview_section(self, content, overview):
        """Ersetze Overview-Sektion komplett."""
        import re
        
        # Build new overview HTML
        cards_html = []
        for comp in overview['components']:
            card_html = f'''                    <div class="component-card">
                        <h3>{comp["name"]}</h3>
                        <p>{comp["description"]}</p>
                        <div class="component-showcase">
                            {comp["showcase"]}
                        </div>
                    </div>'''
            cards_html.append(card_html)
        
        new_overview = f'''        <section class="section">
                <h2 class="section-title">{overview["title"]}</h2>
                
                <div class="component-grid">
{chr(10).join(cards_html)}
                </div>
        </section>'''
        
        # Replace entire overview section
        pattern = r'<section class="section">\s*<h2 class="section-title">Button System Overview</h2>.*?</section>'
        content = re.sub(pattern, new_overview, content, flags=re.DOTALL)
        
        return content
    
    def apply_variants_section(self, content, variants):
        """Ersetze Variants-Sektion komplett."""
        import re
        
        # Build variants HTML
        cards_html = []
        for variant in variants['variants']:
            card_html = f'''                <div class="variant-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">{variant["name"]}</h3>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">{variant["description"]}</p>
                    <div class="variant-showcase">
                        {variant["showcase"]}
                    </div>
                </div>'''
            cards_html.append(card_html)
        
        new_variants = f'''        <section class="section">
            <h2 class="section-title">{variants["title"]}</h2>
            
            <div class="variant-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
{chr(10).join(cards_html)}
            </div>
        </section>'''
        
        # Replace variants section
        pattern = r'<section class="section">\s*<h2 class="section-title">Button Variants</h2>.*?</section>'
        content = re.sub(pattern, new_variants, content, flags=re.DOTALL)
        
        return content
    
    def apply_examples_section(self, content, examples):
        """Ersetze Examples-Sektion komplett."""
        import re
        
        # Build examples HTML
        examples_html = []
        for example in examples['examples']:
            example_html = f'''            <div class="example-card">
                <h3>{example["name"]}</h3>
                <p style="margin: 0 0 20px 0; color: #6b7280;">{example["description"]}</p>
                {example["showcase"]}
            </div>'''
            examples_html.append(example_html)
        
        new_examples = f'''        <section class="section">
            <h2 class="section-title">{examples["title"]}</h2>
            
{chr(10).join(examples_html)}
        </section>'''
        
        # Replace examples section
        pattern = r'<section class="section">\s*<h2 class="section-title">Real Estate Use Cases</h2>.*?</section>'
        content = re.sub(pattern, new_examples, content, flags=re.DOTALL)
        
        return content
    
    def apply_api_section(self, content, api):
        """Ersetze API-Sektion komplett."""
        import re
        
        # Build API table
        rows_html = []
        for i, prop in enumerate(api['properties']):
            row_class = 'background: #fafbfc;' if i % 2 == 1 else ''
            row_html = f'''                        <tr style="border-bottom: 1px solid #f3f4f6; {row_class}">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">{prop["name"]}</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">{prop["type"]}</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">{prop["default"]}</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">{prop["description"]}</td>
                    </tr>'''
            rows_html.append(row_html)
        
        new_api = f'''        <section class="section api-section">
                <h2 class="section-title">{api["title"]}</h2>
            
                <h3>{api["component"]}</h3>
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
{chr(10).join(rows_html)}
                </tbody>
            </table>
            </div>
        </section>'''
        
        # Replace API section
        pattern = r'<section class="section api-section">\s*<h2 class="section-title">API Reference</h2>.*?</section>'
        content = re.sub(pattern, new_api, content, flags=re.DOTALL)
        
        return content
    
    def add_input_css(self, content):
        """Füge Input-spezifische CSS hinzu."""
        input_css = '''
        /* Input-specific styles */
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
            min-height: 56px;
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
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .luxury-input::placeholder {
            color: #9ca3af;
        }

        .luxury-input:disabled {
            background: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .luxury-input[rows] {
            resize: vertical;
            min-height: auto;
            line-height: 1.6;
        }

        .luxury-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
        }

        .form-container {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .example-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
        }

        .example-card h3 {
            margin: 0 0 20px 0;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
        }
'''
        
        # Insert CSS before closing </style>
        content = content.replace('        \n    </style>', f'{input_css}        \n    </style>')
        return content
    
    def write_and_validate(self, file_path, content, component_name):
        """Schreibe Datei und validiere Ergebnis."""
        try:
            # Write file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Validate content
            self.validate_component_file(file_path, component_name)
            print(f"✅ {component_name} component successfully built and validated")
            
        except Exception as e:
            print(f"❌ Error building {component_name}: {str(e)}")
            # Restore from backup if available
            self.restore_from_backup(file_path, component_name)
    
    def validate_component_file(self, file_path, component_name):
        """Validiere dass die Datei korrekte Inhalte hat."""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for required elements
        required_elements = [
            f'{component_name.title()} Components',
            f'{component_name.title()} System Overview',
            'luxury-input' if component_name == 'inputs' else 'component-card',
            'WCAG 2.1 AA Compliant'
        ]
        
        for element in required_elements:
            if element not in content:
                raise ValueError(f"Missing required element: {element}")
        
        # Check for unwanted button content (except CSS classes)
        unwanted_elements = [
            'Button System Overview',
            'lyd-button" class="nav-item active"',
            'Primary button component with variants'
        ]
        
        for element in unwanted_elements:
            if element in content:
                raise ValueError(f"Found unwanted button content: {element}")
    
    def restore_from_backup(self, file_path, component_name):
        """Stelle Datei aus Backup wieder her."""
        # Find latest backup
        backups = [f for f in os.listdir(self.backup_dir) if f.startswith(f'{component_name}_')]
        if backups:
            latest_backup = sorted(backups)[-1]
            backup_path = f'{self.backup_dir}/{latest_backup}'
            shutil.copy2(backup_path, file_path)
            print(f"🔄 Restored from backup: {latest_backup}")

def main():
    """Hauptfunktion für robusten Design System Aufbau."""
    builder = DesignSystemBuilder()
    
    print("🚀 Starting robust Design System build...")
    print("📋 Using Material Design / Ant Design best practices")
    
    # Build Inputs page with systematic approach
    config = builder.get_input_component_config()
    builder.build_component_page('inputs', config)
    
    print("\n✅ Robust build completed!")
    print("\n📝 Next steps:")
    print("1. Deploy and verify inputs page")
    print("2. Apply same systematic approach to all other components")
    print("3. Implement continuous validation")

if __name__ == "__main__":
    main()


