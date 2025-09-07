#!/usr/bin/env python3
"""
Migriert bestehenden Button-Content in neue 4-Tab-Struktur
"""

import re
from pathlib import Path

def migrate_button_content():
    # Paths
    old_file = Path("/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html.backup-6tabs")
    new_file = Path("/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html")
    
    # Read old content
    with open(old_file, 'r') as f:
        old_content = f.read()
    
    # Read new template
    with open(new_file, 'r') as f:
        new_content = f.read()
    
    # Extract valuable content from old file
    
    # 1. Extract button variants from Overview/Variants tabs
    variants_section = """
            <section class="content-section">
                <h2 class="section-title">Button Variants & States</h2>
                <p class="section-subtitle">Complete button system with all variants, sizes, and states.</p>
                
                <!-- Button Components -->
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-button</h3>
                        <p>Primary button component with variants and icons</p>
                        <div class="component-showcase">
                            <lyd-button variant="primary">View Property</lyd-button>
                            <lyd-button variant="secondary" icon="key">Get Keys</lyd-button>
                            <lyd-button variant="outline" icon="calendar">Schedule</lyd-button>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-button-pure</h3>
                        <p>Minimal icon-only buttons</p>
                        <div class="component-showcase">
                            <lyd-button-pure icon="edit"></lyd-button-pure>
                            <lyd-button-pure icon="share"></lyd-button-pure>
                            <lyd-button-pure icon="delete"></lyd-button-pure>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-button-tile</h3>
                        <p>Large tiles for navigation</p>
                        <div class="component-showcase">
                            <lyd-button-tile>
                                <span class="tile-icon">🏠</span>
                                <span class="tile-title">Properties</span>
                                <span class="tile-subtitle">23 active</span>
                            </lyd-button-tile>
                        </div>
                    </div>
                </div>
                
                <!-- Variants -->
                <h3 style="margin-top: 2rem;">Visual Variants</h3>
                <div class="component-grid">
                    <div class="component-card">
                        <h3>Primary</h3>
                        <div class="component-showcase">
                            <lyd-button variant="primary" size="small">Small</lyd-button>
                            <lyd-button variant="primary" size="medium">Medium</lyd-button>
                            <lyd-button variant="primary" size="large">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>Secondary</h3>
                        <div class="component-showcase">
                            <lyd-button variant="secondary" size="small">Small</lyd-button>
                            <lyd-button variant="secondary" size="medium">Medium</lyd-button>
                            <lyd-button variant="secondary" size="large">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>Outline</h3>
                        <div class="component-showcase">
                            <lyd-button variant="outline" size="small">Small</lyd-button>
                            <lyd-button variant="outline" size="medium">Medium</lyd-button>
                            <lyd-button variant="outline" size="large">Large</lyd-button>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>Ghost</h3>
                        <div class="component-showcase">
                            <lyd-button variant="ghost" size="small">Small</lyd-button>
                            <lyd-button variant="ghost" size="medium">Medium</lyd-button>
                            <lyd-button variant="ghost" size="large">Large</lyd-button>
                        </div>
                    </div>
                </div>
                
                <!-- States -->
                <h3 style="margin-top: 2rem;">Button States</h3>
                <div class="component-grid">
                    <div class="component-card">
                        <h3>Loading State</h3>
                        <div class="component-showcase">
                            <lyd-button loading="true">Processing...</lyd-button>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>Disabled State</h3>
                        <div class="component-showcase">
                            <lyd-button disabled="true">Unavailable</lyd-button>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>Download Button</h3>
                        <div class="component-showcase">
                            <lyd-download-button>
                                Download Exposé
                                <span slot="subtitle">2.5 MB PDF</span>
                            </lyd-download-button>
                        </div>
                    </div>
                </div>
            </section>
    """
    
    # 2. Extract examples content
    examples_section = """
            <section class="content-section">
                <h2 class="section-title">Real Estate Use Cases</h2>
                <p class="section-subtitle">Practical button implementations for property management.</p>
                
                <!-- Property Card Actions -->
                <div class="example-section">
                    <h3>Property Card Actions</h3>
                    <div class="property-card-example">
                        <div class="property-info">
                            <h4>Luxury Villa Munich</h4>
                            <p>€2,500,000 • 350m² • 5 rooms</p>
                        </div>
                        <div class="property-actions">
                            <lyd-button variant="primary" icon="calendar">
                                Schedule Viewing
                            </lyd-button>
                        </div>
                    </div>
                    
                    <div class="code-block">
                        <div class="code-block-header">
                            <span class="code-language">HTML</span>
                            <button class="copy-button">Copy</button>
                        </div>
                        <code>&lt;lyd-button variant="primary" icon="calendar"&gt;
    Schedule Viewing
&lt;/lyd-button&gt;</code>
                    </div>
                </div>
                
                <!-- Dashboard Navigation -->
                <div class="example-section">
                    <h3>Dashboard Navigation</h3>
                    <div class="dashboard-tiles">
                        <lyd-button-tile>
                            <span class="tile-icon">🏠</span>
                            <span class="tile-title">Properties</span>
                            <span class="tile-subtitle">23 active</span>
                        </lyd-button-tile>
                        
                        <lyd-button-tile>
                            <span class="tile-icon">📍</span>
                            <span class="tile-title">Locations</span>
                            <span class="tile-subtitle">12 areas</span>
                        </lyd-button-tile>
                        
                        <lyd-button-tile>
                            <span class="tile-icon">📅</span>
                            <span class="tile-title">Viewings</span>
                            <span class="tile-subtitle">5 today</span>
                        </lyd-button-tile>
                    </div>
                </div>
                
                <!-- Form Actions -->
                <div class="example-section">
                    <h3>Form Actions</h3>
                    <div class="form-example">
                        <h4>Create New Property</h4>
                        <p>Fill in the details to add a new property to your portfolio</p>
                        <div class="form-actions">
                            <lyd-button variant="ghost">Cancel</lyd-button>
                            <lyd-button variant="outline">Save Draft</lyd-button>
                            <lyd-button variant="primary">Publish Property</lyd-button>
                        </div>
                    </div>
                </div>
                
                <!-- Property Management Toolbar -->
                <div class="example-section">
                    <h3>Property Management Toolbar</h3>
                    <div class="toolbar-example">
                        <lyd-button-pure icon="edit" title="Edit Property"></lyd-button-pure>
                        <lyd-button-pure icon="share" title="Share Listing"></lyd-button-pure>
                        <lyd-button-pure icon="delete" title="Delete Property"></lyd-button-pure>
                    </div>
                </div>
            </section>
    """
    
    # 3. Implementation content (from API tab)
    implementation_section = """
            <section class="content-section">
                <h2 class="section-title">API Reference</h2>
                <p class="section-subtitle">Complete implementation guide for button components.</p>
                
                <h3>lyd-button Properties</h3>
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
                            <td>primary</td>
                            <td>Visual style: primary, secondary, outline, ghost, danger, success</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>string</td>
                            <td>medium</td>
                            <td>Button size: small, medium, large</td>
                        </tr>
                        <tr>
                            <td><code>icon</code></td>
                            <td>string</td>
                            <td>-</td>
                            <td>Icon name from LYD icon library</td>
                        </tr>
                        <tr>
                            <td><code>loading</code></td>
                            <td>boolean</td>
                            <td>false</td>
                            <td>Shows loading spinner</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>boolean</td>
                            <td>false</td>
                            <td>Disables button interaction</td>
                        </tr>
                        <tr>
                            <td><code>full-width</code></td>
                            <td>boolean</td>
                            <td>false</td>
                            <td>Button takes full container width</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3>Next.js Integration</h3>
                <div class="code-block">
                    <div class="code-block-header">
                        <span class="code-language">TypeScript</span>
                        <button class="copy-button">Copy</button>
                    </div>
                    <code>// app/properties/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    import('@/lib/lyd-design-system');
  }, []);

  const handleCreateProperty = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Property' })
      });
      const newProperty = await response.json();
      // Handle success
    } finally {
      setIsLoading(false);
    }
  };

  return (
    &lt;lyd-button 
      variant="primary" 
      size="large"
      icon="plus"
      loading={isLoading}
      onClick={handleCreateProperty}&gt;
      Add New Property
    &lt;/lyd-button&gt;
  );
}</code>
                </div>
                
                <h3>TypeScript Definitions</h3>
                <div class="code-block">
                    <div class="code-block-header">
                        <span class="code-language">TypeScript</span>
                        <button class="copy-button">Copy</button>
                    </div>
                    <code>declare namespace JSX {
  interface IntrinsicElements {
    'lyd-button': {
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
      size?: 'small' | 'medium' | 'large';
      icon?: string;
      loading?: boolean;
      disabled?: boolean;
      'full-width'?: boolean;
      onClick?: (event: CustomEvent) => void;
      children?: React.ReactNode;
    };
    
    'lyd-button-pure': {
      icon: string;
      size?: 'small' | 'medium' | 'large';
      title?: string;
      disabled?: boolean;
      onClick?: (event: CustomEvent) => void;
    };
    
    'lyd-button-tile': {
      disabled?: boolean;
      onClick?: (event: CustomEvent) => void;
      children?: React.ReactNode;
    };
  }
}</code>
                </div>
            </section>
    """
    
    # 4. Accessibility content
    accessibility_section = """
            <section class="content-section">
                <h2 class="section-title">Accessibility Guidelines</h2>
                <p class="section-subtitle">WCAG 2.1 AA compliant button implementation.</p>
                
                <div class="accessibility-grid">
                    <div class="accessibility-card">
                        <h3>✅ Keyboard Navigation</h3>
                        <ul>
                            <li><kbd>Tab</kbd> - Navigate between buttons</li>
                            <li><kbd>Space</kbd> - Activate button</li>
                            <li><kbd>Enter</kbd> - Activate button</li>
                            <li><kbd>Esc</kbd> - Cancel action (if applicable)</li>
                        </ul>
                    </div>
                    
                    <div class="accessibility-card">
                        <h3>✅ Screen Reader Support</h3>
                        <ul>
                            <li>All buttons have proper ARIA labels</li>
                            <li>Icon-only buttons include descriptive text</li>
                            <li>Loading states announce to screen readers</li>
                            <li>Disabled states properly communicated</li>
                        </ul>
                    </div>
                    
                    <div class="accessibility-card">
                        <h3>✅ Visual Accessibility</h3>
                        <ul>
                            <li>WCAG AA color contrast (4.5:1 minimum)</li>
                            <li>Focus indicators clearly visible</li>
                            <li>No reliance on color alone</li>
                            <li>Hover states for all interactive elements</li>
                        </ul>
                    </div>
                    
                    <div class="accessibility-card">
                        <h3>✅ Touch & Mobile</h3>
                        <ul>
                            <li>Minimum touch target 44x44px</li>
                            <li>Adequate spacing between buttons</li>
                            <li>Responsive sizing for mobile</li>
                            <li>Touch feedback on mobile devices</li>
                        </ul>
                    </div>
                </div>
                
                <h3>ARIA Implementation</h3>
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>Value</th>
                            <th>Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>role</code></td>
                            <td>button</td>
                            <td>Implicit for button elements</td>
                        </tr>
                        <tr>
                            <td><code>aria-label</code></td>
                            <td>string</td>
                            <td>Required for icon-only buttons</td>
                        </tr>
                        <tr>
                            <td><code>aria-pressed</code></td>
                            <td>true/false</td>
                            <td>For toggle buttons</td>
                        </tr>
                        <tr>
                            <td><code>aria-disabled</code></td>
                            <td>true/false</td>
                            <td>When button is disabled</td>
                        </tr>
                        <tr>
                            <td><code>aria-busy</code></td>
                            <td>true/false</td>
                            <td>During loading state</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3>Best Practices</h3>
                <ul>
                    <li>✅ Always provide text labels for icon-only buttons</li>
                    <li>✅ Use semantic HTML button elements</li>
                    <li>✅ Ensure focus is visible and follows logical order</li>
                    <li>✅ Test with keyboard navigation only</li>
                    <li>✅ Verify with screen readers (NVDA, JAWS, VoiceOver)</li>
                </ul>
            </section>
    """
    
    # Replace placeholders in new content
    new_content = new_content.replace('{{VARIANTS_CONTENT}}', variants_section)
    new_content = new_content.replace('{{EXAMPLES_CONTENT}}', examples_section)
    new_content = new_content.replace('{{IMPLEMENTATION_CONTENT}}', implementation_section)
    new_content = new_content.replace('{{ACCESSIBILITY_CONTENT}}', accessibility_section)
    
    # Fix active navigation
    new_content = new_content.replace('{{ACTIVE_BUTTON}}', 'active')
    
    # Remove all other active placeholders
    new_content = re.sub(r'\{\{ACTIVE_[A-Z_]+\}\}', '', new_content)
    
    # Add button-specific styles
    button_styles = """
        /* Button Component Styles */
        .component-showcase {
            display: flex;
            gap: var(--spacing-md);
            flex-wrap: wrap;
            align-items: center;
            padding: var(--spacing-lg);
            background: var(--lyd-gray-50);
            border-radius: var(--radius-lg);
            margin-top: var(--spacing-md);
        }
        
        .property-card-example {
            background: var(--lyd-white);
            padding: var(--spacing-xl);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            margin-bottom: var(--spacing-lg);
        }
        
        .dashboard-tiles {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--spacing-lg);
            margin: var(--spacing-xl) 0;
        }
        
        .form-example {
            background: var(--lyd-gray-50);
            padding: var(--spacing-xl);
            border-radius: var(--radius-lg);
            margin: var(--spacing-lg) 0;
        }
        
        .form-actions {
            display: flex;
            gap: var(--spacing-md);
            justify-content: flex-end;
            margin-top: var(--spacing-lg);
        }
        
        .toolbar-example {
            display: flex;
            gap: var(--spacing-sm);
            padding: var(--spacing-md);
            background: var(--lyd-white);
            border: 1px solid var(--lyd-gray-200);
            border-radius: var(--radius-lg);
        }
        
        .api-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: var(--spacing-lg);
        }
        
        .api-table th {
            background: var(--lyd-gray-100);
            padding: var(--spacing-md);
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid var(--lyd-gray-200);
        }
        
        .api-table td {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--lyd-gray-100);
        }
        
        .api-table code {
            background: var(--lyd-gray-100);
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: var(--font-size-sm);
        }
        
        .accessibility-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-lg);
            margin: var(--spacing-xl) 0;
        }
        
        .accessibility-card {
            background: var(--lyd-gray-50);
            padding: var(--spacing-lg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--lyd-gray-200);
        }
        
        .accessibility-card h3 {
            margin-bottom: var(--spacing-md);
            color: var(--lyd-gray-900);
        }
        
        .accessibility-card ul {
            list-style: none;
            padding: 0;
        }
        
        .accessibility-card li {
            padding: var(--spacing-xs) 0;
            color: var(--lyd-gray-700);
        }
        
        kbd {
            background: var(--lyd-white);
            border: 1px solid var(--lyd-gray-300);
            border-radius: var(--radius-sm);
            padding: 2px 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: var(--font-size-sm);
            box-shadow: var(--shadow-xs);
        }
    """
    
    new_content = new_content.replace('{{COMPONENT_STYLES}}', button_styles)
    new_content = new_content.replace('{{COMPONENT_JAVASCRIPT}}', '')
    
    # Write updated content
    with open(new_file, 'w') as f:
        f.write(new_content)
    
    print("✅ Button component migrated to 4-tab structure")
    print("  - Variants tab: Button types, variants, sizes, states")
    print("  - Examples tab: Real estate use cases")
    print("  - Implementation tab: API docs, Next.js, TypeScript")
    print("  - Accessibility tab: WCAG guidelines, ARIA")

if __name__ == "__main__":
    migrate_button_content()

