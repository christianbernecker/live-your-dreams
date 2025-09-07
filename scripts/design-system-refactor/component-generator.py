#!/usr/bin/env python3
"""
LYD Design System Component Generator
Generiert konsistente Komponenten mit 4-Tab-Struktur
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class ComponentGenerator:
    def __init__(self, base_path: str = "/Users/christianbernecker/live-your-dreams"):
        self.base_path = Path(base_path)
        self.design_system_path = self.base_path / "design-system"
        self.components_path = self.design_system_path / "components"
        self.template_path = self.base_path / "scripts" / "design-system-refactor" / "master-template.html"
        
        # Component-Definitionen basierend auf Porsche Design System
        self.components = {
            # Foundation Components (8)
            "button": {
                "name": "Button",
                "description": "Interactive button component with multiple variants, loading states, and icon support for real estate actions.",
                "category": "foundation",
                "variants": ["primary", "secondary", "outline", "ghost", "danger"],
                "sizes": ["small", "medium", "large"],
                "has_icons": True
            },
            "input": {
                "name": "Input",
                "description": "Form input component with variants for text, number, email, search, and real estate-specific inputs.",
                "category": "form",
                "variants": ["flat", "bordered", "faded", "underlined"],
                "types": ["text", "email", "password", "number", "search", "tel", "url"],
                "states": ["default", "success", "error", "disabled"]
            },
            "select": {
                "name": "Select",
                "description": "Dropdown selection component with search, multi-select, and grouped options for property filtering.",
                "category": "form",
                "variants": ["flat", "bordered", "faded", "underlined"],
                "features": ["searchable", "multiple", "grouped"],
                "states": ["default", "success", "error", "disabled"]
            },
            "textarea": {
                "name": "Textarea",
                "description": "Multi-line text input for property descriptions and detailed information.",
                "category": "form",
                "variants": ["flat", "bordered", "faded", "underlined"],
                "features": ["auto-resize", "character-count"],
                "states": ["default", "success", "error", "disabled"]
            },
            "checkbox": {
                "name": "Checkbox",
                "description": "Checkbox component for multiple selections in property features and amenities.",
                "category": "foundation",
                "variants": ["default", "indeterminate"],
                "states": ["checked", "unchecked", "disabled"]
            },
            "radio": {
                "name": "Radio",
                "description": "Radio button component for single-choice selections in property forms.",
                "category": "foundation",
                "variants": ["default"],
                "states": ["selected", "unselected", "disabled"]
            },
            "switch": {
                "name": "Switch",
                "description": "Toggle switch for binary choices like property availability or feature activation.",
                "category": "foundation",
                "variants": ["default"],
                "states": ["on", "off", "disabled"]
            },
            "card": {
                "name": "Card",
                "description": "Flexible card component for displaying property information and content organization.",
                "category": "display",
                "variants": ["default", "elevated", "outlined"],
                "features": ["header", "footer", "media"]
            },
            "modal": {
                "name": "Modal",
                "description": "Dialog component for property details, confirmations, and form overlays.",
                "category": "feedback",
                "variants": ["default", "fullscreen", "drawer"],
                "sizes": ["small", "medium", "large", "xl"]
            },
            "accordion": {
                "name": "Accordion",
                "description": "Collapsible content sections for property features and FAQ organization.",
                "category": "feedback",
                "variants": ["default", "bordered", "splitted"],
                "features": ["single", "multiple", "animated"]
            },
            "tabs": {
                "name": "Tabs",
                "description": "Tab navigation for organizing property details and multi-step forms.",
                "category": "navigation",
                "variants": ["default", "bordered", "underlined", "solid"],
                "features": ["scrollable", "vertical"]
            },
            "table": {
                "name": "Table",
                "description": "Data table component for property listings and lead management.",
                "category": "display",
                "variants": ["default", "striped", "bordered"],
                "features": ["sortable", "selectable", "pagination"]
            },
            "toast": {
                "name": "Toast",
                "description": "Notification component for success messages, errors, and system feedback.",
                "category": "feedback",
                "variants": ["success", "error", "warning", "info"],
                "positions": ["top-right", "top-center", "bottom-center"]
            },
            "spinner": {
                "name": "Spinner",
                "description": "Loading indicator for async operations and data fetching.",
                "category": "feedback",
                "variants": ["default", "dots", "bars"],
                "sizes": ["small", "medium", "large"]
            },
            "progress": {
                "name": "Progress",
                "description": "Progress indicator for multi-step forms and upload operations.",
                "category": "feedback",
                "variants": ["linear", "circular"],
                "features": ["determinate", "indeterminate", "striped"]
            },
            "pagination": {
                "name": "Pagination",
                "description": "Page navigation for property listings and search results.",
                "category": "navigation",
                "variants": ["default", "rounded", "bordered"],
                "features": ["compact", "siblings", "boundaries"]
            },
            "breadcrumb": {
                "name": "Breadcrumb",
                "description": "Navigation trail for property hierarchy and site structure.",
                "category": "navigation",
                "variants": ["default", "solid"],
                "separators": ["slash", "chevron", "arrow"]
            },
            "stepper": {
                "name": "Stepper",
                "description": "Step indicator for property listing creation and multi-step processes.",
                "category": "navigation",
                "variants": ["horizontal", "vertical"],
                "features": ["numbered", "dotted", "alternative"]
            }
        }
    
    def generate_variants_content(self, component: Dict) -> str:
        """Generiert den Variants-Tab Inhalt"""
        variants_html = f"""
            <section class="content-section">
                <h2 class="section-title">{component['name']} Variants & States</h2>
                <p class="section-subtitle">All available variants, sizes, and states for the {component['name'].lower()} component.</p>
                
                <div class="component-grid">
        """
        
        # Basis-Komponente
        variants_html += f"""
                    <div class="component-card">
                        <h3>lyd-{component['name'].lower()}</h3>
                        <p>Base {component['name'].lower()} component with default styling</p>
                        <div class="component-showcase">
                            <lyd-{component['name'].lower()}>
                                Default {component['name']}
                            </lyd-{component['name'].lower()}>
                        </div>
                    </div>
        """
        
        # Varianten
        if 'variants' in component:
            for variant in component['variants']:
                variants_html += f"""
                    <div class="component-card">
                        <h3>{variant.capitalize()} Variant</h3>
                        <p>{variant.capitalize()} style for {component['name'].lower()}</p>
                        <div class="component-showcase">
                            <lyd-{component['name'].lower()} variant="{variant}">
                                {variant.capitalize()} {component['name']}
                            </lyd-{component['name'].lower()}>
                        </div>
                    </div>
                """
        
        # Größen
        if 'sizes' in component:
            variants_html += """
                </div>
                
                <h3 class="section-title" style="margin-top: 2rem;">Sizes</h3>
                <div class="component-grid">
            """
            for size in component['sizes']:
                variants_html += f"""
                    <div class="component-card">
                        <h3>{size.capitalize()} Size</h3>
                        <div class="component-showcase">
                            <lyd-{component['name'].lower()} size="{size}">
                                {size.capitalize()}
                            </lyd-{component['name'].lower()}>
                        </div>
                    </div>
                """
        
        # States
        if 'states' in component:
            variants_html += """
                </div>
                
                <h3 class="section-title" style="margin-top: 2rem;">States</h3>
                <div class="component-grid">
            """
            for state in component['states']:
                variants_html += f"""
                    <div class="component-card">
                        <h3>{state.capitalize()} State</h3>
                        <div class="component-showcase">
                            <lyd-{component['name'].lower()} state="{state}">
                                {state.capitalize()}
                            </lyd-{component['name'].lower()}>
                        </div>
                    </div>
                """
        
        variants_html += """
                </div>
            </section>
        """
        
        return variants_html
    
    def generate_examples_content(self, component: Dict) -> str:
        """Generiert den Examples-Tab Inhalt mit Real Estate Use Cases"""
        examples_html = f"""
            <section class="content-section">
                <h2 class="section-title">Real Estate Use Cases</h2>
                <p class="section-subtitle">Practical examples of {component['name'].lower()} components in real estate applications.</p>
                
                <div class="example-section">
                    <h3>Property Search Interface</h3>
                    <div class="example-demo">
                        <!-- Real Estate spezifisches Beispiel -->
                        <lyd-{component['name'].lower()} 
                            variant="primary"
                            placeholder="Search properties..."
                            icon="search">
                        </lyd-{component['name'].lower()}>
                    </div>
                    
                    <div class="code-block">
                        <div class="code-block-header">
                            <span class="code-language">HTML</span>
                            <button class="copy-button">Copy</button>
                        </div>
                        <code>&lt;lyd-{component['name'].lower()} 
    variant="primary"
    placeholder="Search properties..."
    icon="search"&gt;
&lt;/lyd-{component['name'].lower()}&gt;</code>
                    </div>
                </div>
                
                <div class="example-section">
                    <h3>Property Management Dashboard</h3>
                    <div class="example-demo">
                        <!-- Dashboard-Beispiel -->
                        <div class="dashboard-example">
                            <lyd-{component['name'].lower()} variant="secondary">
                                Add Property
                            </lyd-{component['name'].lower()}>
                            <lyd-{component['name'].lower()} variant="outline">
                                Edit Details
                            </lyd-{component['name'].lower()}>
                            <lyd-{component['name'].lower()} variant="ghost">
                                Delete
                            </lyd-{component['name'].lower()}>
                        </div>
                    </div>
                </div>
            </section>
        """
        
        return examples_html
    
    def generate_implementation_content(self, component: Dict) -> str:
        """Generiert den Implementation-Tab mit Code-Beispielen"""
        implementation_html = f"""
            <section class="content-section">
                <h2 class="section-title">API Reference</h2>
                <p class="section-subtitle">Complete implementation guide for lyd-{component['name'].lower()} component.</p>
                
                <h3>Properties</h3>
                <table class="api-table">
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
                            <td>string</td>
                            <td>default</td>
                            <td>Visual style variant</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>string</td>
                            <td>medium</td>
                            <td>Component size</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>boolean</td>
                            <td>false</td>
                            <td>Disable interaction</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3>Next.js Integration</h3>
                <div class="code-block">
                    <div class="code-block-header">
                        <span class="code-language">TypeScript</span>
                        <button class="copy-button">Copy</button>
                    </div>
                    <code>// app/components/PropertyForm.tsx
import {{ useEffect }} from 'react';

export default function PropertyForm() {{
    useEffect(() => {{
        import('@/lib/lyd-design-system');
    }}, []);
    
    return (
        &lt;lyd-{component['name'].lower()}
            variant="primary"
            onClick={{handleSubmit}}&gt;
            Submit Property
        &lt;/lyd-{component['name'].lower()}&gt;
    );
}}</code>
                </div>
                
                <h3>TypeScript Definitions</h3>
                <div class="code-block">
                    <div class="code-block-header">
                        <span class="code-language">TypeScript</span>
                        <button class="copy-button">Copy</button>
                    </div>
                    <code>declare namespace JSX {{
    interface IntrinsicElements {{
        'lyd-{component['name'].lower()}': {{
            variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
            size?: 'small' | 'medium' | 'large';
            disabled?: boolean;
            onClick?: (event: CustomEvent) => void;
            children?: React.ReactNode;
        }};
    }}
}}</code>
                </div>
            </section>
        """
        
        return implementation_html
    
    def generate_accessibility_content(self, component: Dict) -> str:
        """Generiert den Accessibility-Tab mit WCAG Guidelines"""
        accessibility_html = f"""
            <section class="content-section">
                <h2 class="section-title">Accessibility Guidelines</h2>
                <p class="section-subtitle">WCAG 2.1 AA compliant implementation for {component['name'].lower()} components.</p>
                
                <div class="accessibility-grid">
                    <div class="accessibility-card">
                        <h3>✅ Keyboard Navigation</h3>
                        <ul>
                            <li><kbd>Tab</kbd> - Navigate to component</li>
                            <li><kbd>Space</kbd> / <kbd>Enter</kbd> - Activate component</li>
                            <li><kbd>Esc</kbd> - Cancel action (if applicable)</li>
                        </ul>
                    </div>
                    
                    <div class="accessibility-card">
                        <h3>✅ Screen Reader Support</h3>
                        <ul>
                            <li>Proper ARIA labels and descriptions</li>
                            <li>Role attributes for semantic meaning</li>
                            <li>Live region announcements for state changes</li>
                        </ul>
                    </div>
                    
                    <div class="accessibility-card">
                        <h3>✅ Visual Accessibility</h3>
                        <ul>
                            <li>WCAG AA color contrast ratios (4.5:1 minimum)</li>
                            <li>Focus indicators clearly visible</li>
                            <li>No reliance on color alone</li>
                        </ul>
                    </div>
                    
                    <div class="accessibility-card">
                        <h3>✅ Responsive & Adaptive</h3>
                        <ul>
                            <li>Touch targets minimum 44x44px</li>
                            <li>Text scalable up to 200%</li>
                            <li>Works with all input methods</li>
                        </ul>
                    </div>
                </div>
                
                <h3>ARIA Attributes</h3>
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>role</code></td>
                            <td>{component.get('aria_role', 'button')}</td>
                            <td>Semantic role for screen readers</td>
                        </tr>
                        <tr>
                            <td><code>aria-label</code></td>
                            <td>Dynamic</td>
                            <td>Accessible name for the component</td>
                        </tr>
                        <tr>
                            <td><code>aria-disabled</code></td>
                            <td>true/false</td>
                            <td>Indicates disabled state</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        """
        
        return accessibility_html
    
    def generate_component(self, component_key: str, force: bool = False) -> bool:
        """Generiert eine einzelne Komponente"""
        if component_key not in self.components:
            print(f"❌ Component '{component_key}' not found")
            return False
        
        component = self.components[component_key]
        component_path = self.components_path / component_key
        
        # Backup existing component if it exists
        if component_path.exists() and not force:
            backup_path = component_path.with_suffix('.backup')
            shutil.copytree(component_path, backup_path, dirs_exist_ok=True)
            print(f"📦 Backed up existing component to {backup_path}")
        
        # Create component directory
        component_path.mkdir(parents=True, exist_ok=True)
        
        # Read template
        with open(self.template_path, 'r') as f:
            template = f.read()
        
        # Generate content for each tab
        variants_content = self.generate_variants_content(component)
        examples_content = self.generate_examples_content(component)
        implementation_content = self.generate_implementation_content(component)
        accessibility_content = self.generate_accessibility_content(component)
        
        # Replace placeholders
        html_content = template.replace('{{COMPONENT_NAME}}', component['name'])
        html_content = html_content.replace('{{COMPONENT_DESCRIPTION}}', component['description'])
        html_content = html_content.replace('{{VARIANTS_CONTENT}}', variants_content)
        html_content = html_content.replace('{{EXAMPLES_CONTENT}}', examples_content)
        html_content = html_content.replace('{{IMPLEMENTATION_CONTENT}}', implementation_content)
        html_content = html_content.replace('{{ACCESSIBILITY_CONTENT}}', accessibility_content)
        
        # Set active navigation
        active_placeholder = f"{{{{ACTIVE_{component_key.upper()}}}}}"
        html_content = html_content.replace(active_placeholder, 'active')
        
        # Clear all other active placeholders
        for key in self.components.keys():
            if key != component_key:
                placeholder = f"{{{{ACTIVE_{key.upper()}}}}}"
                html_content = html_content.replace(placeholder, '')
        
        # Add component-specific styles and JavaScript
        html_content = html_content.replace('{{COMPONENT_STYLES}}', '')
        html_content = html_content.replace('{{COMPONENT_JAVASCRIPT}}', '')
        
        # Write component file
        output_file = component_path / 'index.html'
        with open(output_file, 'w') as f:
            f.write(html_content)
        
        print(f"✅ Generated component: {component['name']} -> {output_file}")
        return True
    
    def generate_all_components(self, force: bool = False):
        """Generiert alle Komponenten"""
        print("🚀 Starting component generation...")
        print(f"📁 Output directory: {self.components_path}")
        
        success_count = 0
        for component_key in self.components.keys():
            if self.generate_component(component_key, force):
                success_count += 1
        
        print(f"\n✅ Successfully generated {success_count}/{len(self.components)} components")
        
        # Generate component index
        self.generate_index()
    
    def generate_index(self):
        """Generiert die Komponenten-Übersichtsseite"""
        index_html = """
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Components - LYD Design System</title>
    <link href="/assets/css/design-system.css" rel="stylesheet">
</head>
<body>
    <h1>LYD Design System Components</h1>
    <div class="component-grid">
        """
        
        for key, component in self.components.items():
            index_html += f"""
        <a href="/components/{key}/" class="component-link">
            <h3>{component['name']}</h3>
            <p>{component['description']}</p>
        </a>
            """
        
        index_html += """
    </div>
</body>
</html>
        """
        
        index_file = self.components_path / 'index.html'
        with open(index_file, 'w') as f:
            f.write(index_html)
        
        print(f"✅ Generated component index: {index_file}")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='LYD Design System Component Generator')
    parser.add_argument('--component', '-c', help='Generate specific component')
    parser.add_argument('--all', '-a', action='store_true', help='Generate all components')
    parser.add_argument('--force', '-f', action='store_true', help='Force overwrite without backup')
    parser.add_argument('--list', '-l', action='store_true', help='List all available components')
    
    args = parser.parse_args()
    
    generator = ComponentGenerator()
    
    if args.list:
        print("\n📋 Available Components:")
        for key, component in generator.components.items():
            print(f"  • {key}: {component['name']} - {component['category']}")
    elif args.component:
        generator.generate_component(args.component, args.force)
    elif args.all:
        generator.generate_all_components(args.force)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

