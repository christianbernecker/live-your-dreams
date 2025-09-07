#!/usr/bin/env python3
"""
Fix ALL component content - replace button content with component-specific content.
This script ensures every tab has the correct content for each component.
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
    'edit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    'trash': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    'share': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    'download': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    'alert-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
    'plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
}

def fix_inputs_page():
    """Fix the inputs component page with complete content."""
    file_path = Path('design-system/components/inputs/index.html')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix Variants tab
    variants_content = '''            <h2 class="section-title">Input Variants & States</h2>
            
            <div class="variant-grid">
                <div class="variant-card">
                    <h3>All Input Variants</h3>
                    <div class="variant-showcase">
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Default Input</label>
                            <input type="text" class="luxury-input" placeholder="Enter property title">
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Error State</label>
                            <input type="text" class="luxury-input error" placeholder="Error input" value="Invalid data">
                            <div class="luxury-error">This field is required</div>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Success State</label>
                            <input type="text" class="luxury-input success" placeholder="Success input" value="Valid data">
                            <div class="luxury-success">Input is valid</div>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Disabled State</label>
                            <input type="text" class="luxury-input" placeholder="Disabled input" disabled value="Disabled">
                        </div>
                    </div>
                </div>
                
                <div class="variant-card">
                    <h3>Input Sizes</h3>
                    <div class="variant-showcase">
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Small Size</label>
                            <input type="text" class="luxury-input small" placeholder="Small input">
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Medium Size (Default)</label>
                            <input type="text" class="luxury-input" placeholder="Medium input">
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Large Size</label>
                            <input type="text" class="luxury-input large" placeholder="Large input">
                        </div>
                    </div>
                </div>
                
                <div class="variant-card">
                    <h3>Input Styles</h3>
                    <div class="variant-showcase">
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Outline Variant</label>
                            <input type="text" class="luxury-input" placeholder="Outline input">
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label class="luxury-label">Filled Variant</label>
                            <input type="text" class="luxury-input" style="background: #f3f4f6;" placeholder="Filled input">
                        </div>
                    </div>
                </div>
            </div>'''
    
    # Fix Icon Library tab
    icons_content = '''            <h2 class="section-title">Input Icons</h2>
            <p class="section-subtitle">Icons specifically designed for input fields and form interactions</p>
            
            <div class="icon-grid">
                <div class="icon-card" onclick="copyToClipboard('search')">
                    <div class="icon-display">''' + SVG_ICONS['search'] + '''</div>
                    <span class="icon-name">search</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('email')">
                    <div class="icon-display">''' + SVG_ICONS['email'] + '''</div>
                    <span class="icon-name">email</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('phone')">
                    <div class="icon-display">''' + SVG_ICONS['phone'] + '''</div>
                    <span class="icon-name">phone</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('location')">
                    <div class="icon-display">''' + SVG_ICONS['location'] + '''</div>
                    <span class="icon-name">location</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('calendar')">
                    <div class="icon-display">''' + SVG_ICONS['calendar'] + '''</div>
                    <span class="icon-name">calendar</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('user')">
                    <div class="icon-display">''' + SVG_ICONS['user'] + '''</div>
                    <span class="icon-name">user</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('lock')">
                    <div class="icon-display">''' + SVG_ICONS['lock'] + '''</div>
                    <span class="icon-name">lock</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('dollar-sign')">
                    <div class="icon-display">''' + SVG_ICONS['dollar-sign'] + '''</div>
                    <span class="icon-name">dollar-sign</span>
                </div>
            </div>
            
            <h3>Input with Icons</h3>
            <div class="form-row two">
                <div>
                    <label class="luxury-label">Search Input</label>
                    <div class="luxury-input-group">
                        <input type="text" class="luxury-input" placeholder="Search properties...">
                        <div class="luxury-input-icon">''' + SVG_ICONS['search'] + '''</div>
                    </div>
                </div>
                
                <div>
                    <label class="luxury-label">Email Input</label>
                    <div class="luxury-input-group">
                        <input type="email" class="luxury-input" placeholder="Enter email">
                        <div class="luxury-input-icon">''' + SVG_ICONS['email'] + '''</div>
                    </div>
                </div>
            </div>'''
    
    # Fix Examples tab
    examples_content = '''            <h2 class="section-title">Real Estate Examples</h2>
            
            <div class="example-card">
                <h3>Property Search</h3>
                <div class="form-container">
                    <div class="form-row two">
                        <div>
                            <label class="luxury-label">Search Properties</label>
                            <div class="luxury-input-group">
                                <input type="text" class="luxury-input" placeholder="Enter location, price range, or property type...">
                                <div class="luxury-input-icon">''' + SVG_ICONS['search'] + '''</div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="luxury-label">Price Range</label>
                            <select class="luxury-input">
                                <option>Select price range</option>
                                <option>€0 - €500,000</option>
                                <option>€500,000 - €1,000,000</option>
                                <option>€1,000,000+</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="example-card">
                <h3>Add New Property</h3>
                <div class="form-container">
                    <div class="form-row two">
                        <div>
                            <label class="luxury-label required">Property Title</label>
                            <input type="text" class="luxury-input" placeholder="Modern apartment in Munich">
                        </div>
                        <div>
                            <label class="luxury-label">Property Type</label>
                            <select class="luxury-input">
                                <option>Select type</option>
                                <option>Apartment</option>
                                <option>House</option>
                                <option>Villa</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row full">
                        <div>
                            <label class="luxury-label">Property Address</label>
                            <div class="luxury-input-group">
                                <input type="text" class="luxury-input" placeholder="Maximilianstraße 1, 80539 Munich">
                                <div class="luxury-input-icon">''' + SVG_ICONS['location'] + '''</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row three">
                        <div>
                            <label class="luxury-label">Purchase Price (EUR)</label>
                            <div class="luxury-input-group">
                                <input type="text" class="luxury-input" placeholder="750,000">
                                <div class="luxury-input-icon">''' + SVG_ICONS['dollar-sign'] + '''</div>
                            </div>
                        </div>
                        <div>
                            <label class="luxury-label">Living Area (m²)</label>
                            <input type="text" class="luxury-input" placeholder="120">
                        </div>
                        <div>
                            <label class="luxury-label">Rooms</label>
                            <input type="number" class="luxury-input" placeholder="3" min="1" max="10">
                        </div>
                    </div>
                    
                    <div class="form-row full">
                        <div>
                            <label class="luxury-label">Description</label>
                            <textarea class="luxury-input" rows="4" placeholder="Describe the property features, location, and unique selling points..."></textarea>
                        </div>
                    </div>
                </div>
            </div>'''
    
    # Fix API tab
    api_content = '''            <h2 class="section-title">API Reference</h2>
            
            <div class="api-section">
                <h3>lyd-input-text</h3>
                <p>Standard text input component with validation and error states.</p>
                
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
                            <td><code>label</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Input label text</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Placeholder text</td>
                        </tr>
                        <tr>
                            <td><code>required</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Mark field as required</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td>false</td>
                            <td>Disable input</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td><code>'small' | 'medium' | 'large'</code></td>
                            <td>'medium'</td>
                            <td>Input size variant</td>
                        </tr>
                        <tr>
                            <td><code>variant</code></td>
                            <td><code>'default' | 'outline' | 'filled'</code></td>
                            <td>'default'</td>
                            <td>Input visual variant</td>
                        </tr>
                    </tbody>
                </table>
                
                <h4>Events</h4>
                <ul>
                    <li><code>lyd-change</code> - Fired when input value changes</li>
                    <li><code>lyd-focus</code> - Fired when input receives focus</li>
                    <li><code>lyd-blur</code> - Fired when input loses focus</li>
                </ul>
                
                <h3>Next.js Integration</h3>
                <pre><code>// app/properties/create/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function CreatePropertyPage() {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    import('@/lib/lyd-design-system');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;lyd-input-text 
        label="Property Title" 
        required
        onChange={(e) =&gt; setFormData({...formData, title: e.target.value})}
      /&gt;
      
      &lt;lyd-input-price 
        label="Price" 
        currency="EUR"
        onChange={(e) =&gt; setFormData({...formData, price: e.target.value})}
      /&gt;
      
      &lt;lyd-input-area 
        label="Area" 
        unit="m2"
        onChange={(e) =&gt; setFormData({...formData, area: e.target.value})}
      /&gt;
      
      &lt;lyd-button type="submit" variant="primary"&gt;
        Create Property
      &lt;/lyd-button&gt;
    &lt;/form&gt;
  );
}</code></pre>
            </div>'''
    
    # Fix Accessibility tab
    accessibility_content = '''            <div class="accessibility-badge">
                <h2>WCAG 2.1 AA Compliant</h2>
                <p>All input components meet accessibility standards for keyboard navigation, screen readers, and color contrast.</p>
            </div>
            
            <div class="accessibility-grid">
                <div class="accessibility-card">
                    <h3>Keyboard Navigation</h3>
                    <div class="keyboard-shortcuts">
                        <div class="shortcut">
                            <kbd>Tab</kbd>
                            <span>Move to next input field</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Shift + Tab</kbd>
                            <span>Move to previous input field</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Enter</kbd>
                            <span>Submit form or activate button</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Escape</kbd>
                            <span>Clear input or cancel action</span>
                        </div>
                    </div>
                </div>
                
                <div class="accessibility-card">
                    <h3>Screen Reader Support</h3>
                    <div class="feature-list">
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>Semantic Labels</strong>
                                <p>All inputs have proper labels that are announced by screen readers</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>Error Announcements</strong>
                                <p>Validation errors are announced immediately when they occur</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>Required Field Indicators</strong>
                                <p>Required fields are clearly marked and announced</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div>
                                <strong>Focus Management</strong>
                                <p>Focus is clearly visible and properly managed throughout the form</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>'''
    
    # Replace all button content with input content
    content = re.sub(r'<div class="tab-content" id="variants">.*?</div>\s*(?=<div class="tab-content")', 
                     f'<div class="tab-content" id="variants">\n        <section class="section">\n{variants_content}\n        </section>\n        </div>\n\n        ', 
                     content, flags=re.DOTALL)
    
    content = re.sub(r'<div class="tab-content" id="icons">.*?</div>\s*(?=<div class="tab-content")', 
                     f'<div class="tab-content" id="icons">\n        <section class="section">\n{icons_content}\n        </section>\n        </div>\n\n        ', 
                     content, flags=re.DOTALL)
    
    content = re.sub(r'<div class="tab-content" id="examples">.*?</div>\s*(?=<div class="tab-content")', 
                     f'<div class="tab-content" id="examples">\n        <section class="section">\n{examples_content}\n        </section>\n        </div>\n\n        ', 
                     content, flags=re.DOTALL)
    
    content = re.sub(r'<div class="tab-content" id="api">.*?</div>\s*(?=<div class="tab-content")', 
                     f'<div class="tab-content" id="api">\n        <section class="section">\n{api_content}\n        </section>\n        </div>\n\n        ', 
                     content, flags=re.DOTALL)
    
    content = re.sub(r'<div class="tab-content" id="accessibility">.*?</div>', 
                     f'<div class="tab-content" id="accessibility">\n        <section class="section">\n{accessibility_content}\n        </section>\n        </div>', 
                     content, flags=re.DOTALL)
    
    # Add input-specific CSS
    input_css = '''
        /* Input-specific styles */
        .luxury-input.small {
            padding: 12px 16px;
            font-size: 14px;
        }

        .luxury-input.large {
            padding: 20px 24px;
            font-size: 18px;
        }

        .luxury-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
            font-size: 14px;
        }

        .luxury-label.required::after {
            content: " *";
            color: #ef4444;
        }

        .luxury-error {
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
        }

        .luxury-success {
            color: #10b981;
            font-size: 14px;
            margin-top: 4px;
        }

        .form-row {
            display: grid;
            gap: 20px;
            margin-bottom: 24px;
        }

        .form-row.two {
            grid-template-columns: 1fr 1fr;
        }

        .form-row.three {
            grid-template-columns: 1fr 1fr 1fr;
        }

        .form-row.full {
            grid-template-columns: 1fr;
        }

        .form-container {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .example-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            margin-bottom: 32px;
            overflow: hidden;
        }

        .example-card h3 {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 20px 24px;
            font-size: 18px;
            font-weight: 600;
        }

        .example-card .form-container {
            margin: 24px;
            background: rgba(249, 250, 251, 0.8);
        }

        @media (max-width: 768px) {
            .form-row.two,
            .form-row.three {
                grid-template-columns: 1fr;
            }
        }'''
    
    # Insert input CSS after existing luxury input styles
    content = re.sub(r'(\.luxury-input-icon svg \{\s*width: 20px;\s*height: 20px;\s*\})', 
                     r'\1\n' + input_css, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Fixed inputs page")

def main():
    """Main function to fix all component content."""
    print("🔧 Fixing ALL component content...")
    
    fix_inputs_page()
    
    print("✅ Component content fixed!")

if __name__ == '__main__':
    main()


