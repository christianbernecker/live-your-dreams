#!/usr/bin/env python3
"""
HeroUI-inspired Design System Builder
Implementiert robuste Input-Komponenten nach HeroUI-Standards mit Porsche-Qualität
"""

import os
import shutil
import re
from datetime import datetime

class HeroUIInspiredBuilder:
    def __init__(self):
        self.base_path = '/Users/christianbernecker/live-your-dreams/design-system/components'
        self.template_path = f'{self.base_path}/buttons/index.html'
        
    def create_stable_inputs_page(self):
        """Erstelle eine stabile, HeroUI-inspirierte Inputs-Seite."""
        print("🚀 Building HeroUI-inspired Input Components...")
        
        # Load clean template
        with open(self.template_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Update Meta Information
        content = self.update_meta_info(content)
        
        # 2. Create Overview Section (HeroUI-style)
        content = self.create_overview_section(content)
        
        # 3. Create Variants Section (HeroUI-style)
        content = self.create_variants_section(content)
        
        # 4. Create Examples Section
        content = self.create_examples_section(content)
        
        # 5. Create API Section
        content = self.create_api_section(content)
        
        # 6. Add Input-specific CSS
        content = self.add_heroui_inspired_css(content)
        
        # 7. Write file atomically
        self.write_file_atomically(content)
        
        print("✅ HeroUI-inspired Inputs page created successfully!")
    
    def update_meta_info(self, content):
        """Update title, subtitle and navigation."""
        replacements = [
            ('Button Components - LYD Design System', 'Input Components - LYD Design System'),
            ('<h1 class="page-title">Button Components</h1>', '<h1 class="page-title">Input Components</h1>'),
            ('<p class="page-subtitle">Interactive elements for user actions with luxury styling, micro-animations, and comprehensive state management.</p>', 
             '<p class="page-subtitle">Complete input system with validation, icons, and specialized components for real estate data entry.</p>'),
            ('<a href="/components/buttons/" class="nav-item active">Button</a>', '<a href="/components/buttons/" class="nav-item">Button</a>'),
            ('<a href="/components/inputs/" class="nav-item">Input</a>', '<a href="/components/inputs/" class="nav-item active">Input</a>')
        ]
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        return content
    
    def create_overview_section(self, content):
        """Erstelle Overview nach HeroUI-Vorbild."""
        overview_html = '''        <section class="section">
                <h2 class="section-title">Input System Overview</h2>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-input-text</h3>
                        <p>Standard text input with luxury styling and validation</p>
                        <div class="component-showcase">
                            <div class="input-demo">
                                <label class="luxury-label">Property Title</label>
                                <input type="text" class="luxury-input" placeholder="Enter property title" value="Luxury Villa Munich" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-input-number</h3>
                        <p>Number input for prices, areas, and room counts</p>
                        <div class="component-showcase">
                            <div class="input-demo">
                                <label class="luxury-label">Price in €</label>
                                <input type="number" class="luxury-input" placeholder="0" value="2500000" />
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-input-email</h3>
                        <p>Email input with built-in validation patterns</p>
                        <div class="component-showcase">
                            <div class="input-demo">
                                <label class="luxury-label">Contact Email</label>
                                <input type="email" class="luxury-input" placeholder="agent@example.com" value="agent@liveyourdreams.de" />
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-input-search</h3>
                        <p>Search input with integrated icon and filtering</p>
                        <div class="component-showcase">
                            <div class="input-demo">
                                <label class="luxury-label">Search Properties</label>
                                <div class="input-with-icon">
                                    <input type="search" class="luxury-input search-input" placeholder="Search properties..." />
                                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-textarea</h3>
                        <p>Multi-line text area for descriptions and notes</p>
                        <div class="component-showcase">
                            <div class="input-demo">
                                <label class="luxury-label">Property Description</label>
                                <textarea class="luxury-input" rows="3" placeholder="Property description">Beautiful luxury villa with panoramic views and premium amenities...</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-select</h3>
                        <p>Dropdown selection with custom luxury styling</p>
                        <div class="component-showcase">
                            <div class="input-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select">
                                    <div class="luxury-select-trigger">
                                        <span>Apartment</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>'''
        
        # Replace overview section completely
        pattern = r'<section class="section">\s*<h2 class="section-title">Button System Overview</h2>.*?</section>'
        content = re.sub(pattern, overview_html, content, flags=re.DOTALL)
        
        return content
    
    def create_variants_section(self, content):
        """Erstelle Variants nach HeroUI-Systematik."""
        variants_html = '''        <section class="section">
            <h2 class="section-title">Input Variants & States</h2>
            <p class="section-subtitle">Comprehensive input states inspired by HeroUI design patterns</p>
            
            <div class="variants-showcase">
                <!-- Input Variants Grid -->
                <div class="variant-category">
                    <h3 class="variant-title">Visual Variants</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>Flat (Default)</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Property Title</label>
                                <input type="text" class="luxury-input variant-flat" placeholder="Enter title" />
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Bordered</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Property Title</label>
                                <input type="text" class="luxury-input variant-bordered" placeholder="Enter title" />
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Faded</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Property Title</label>
                                <input type="text" class="luxury-input variant-faded" placeholder="Enter title" />
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Underlined</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Property Title</label>
                                <input type="text" class="luxury-input variant-underlined" placeholder="Enter title" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Input States Grid -->
                <div class="variant-category">
                    <h3 class="variant-title">Input States</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>Success State</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Property Title</label>
                                <input type="text" class="luxury-input state-success" value="Luxury Villa Munich" />
                                <div class="input-message success">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>
                                    Valid property title
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Error State</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Email Address</label>
                                <input type="email" class="luxury-input state-error" value="invalid-email" />
                                <div class="input-message error">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                    Please enter a valid email address
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Disabled State</h4>
                            <div class="input-demo">
                                <label class="luxury-label disabled">Property ID</label>
                                <input type="text" class="luxury-input" value="AUTO-GENERATED" disabled />
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Required State</h4>
                            <div class="input-demo">
                                <label class="luxury-label required">Property Title</label>
                                <input type="text" class="luxury-input" placeholder="Required field" required />
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Input Sizes Grid -->
                <div class="variant-category">
                    <h3 class="variant-title">Input Sizes</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>Small (sm)</h4>
                            <div class="input-demo">
                                <label class="luxury-label size-sm">Compact Input</label>
                                <input type="text" class="luxury-input size-sm" placeholder="Small input" />
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Medium (md) - Default</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Standard Input</label>
                                <input type="text" class="luxury-input" placeholder="Medium input" />
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Large (lg)</h4>
                            <div class="input-demo">
                                <label class="luxury-label size-lg">Prominent Input</label>
                                <input type="text" class="luxury-input size-lg" placeholder="Large input" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Advanced Features -->
                <div class="variant-category">
                    <h3 class="variant-title">Advanced Features</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>With Clear Button</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Search Location</label>
                                <div class="input-clearable">
                                    <input type="text" class="luxury-input" placeholder="Enter location" value="Munich, Germany" />
                                    <button class="clear-button">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>With Description</h4>
                            <div class="input-demo">
                                <label class="luxury-label">Property Price</label>
                                <input type="number" class="luxury-input" placeholder="0" />
                                <div class="input-description">Enter the total property price in Euro</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>'''
        
        # Replace variants section
        pattern = r'<section class="section">\s*<h2 class="section-title">Button Variants</h2>.*?</section>'
        content = re.sub(pattern, variants_html, content, flags=re.DOTALL)
        
        return content
    
    def create_examples_section(self, content):
        """Erstelle professionelle Examples."""
        examples_html = '''        <section class="section">
            <h2 class="section-title">Real Estate Form Examples</h2>
            
            <div class="example-card">
                <h3>Property Registration Form</h3>
                <div class="form-container">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="luxury-label required">Property Title</label>
                            <input type="text" class="luxury-input" placeholder="Enter property title" required />
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label required">Property Type</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Select type</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Price in €</label>
                            <div class="input-with-icon">
                                <input type="number" class="luxury-input" placeholder="0" min="0" step="1000" />
                                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M14.5 8a2.5 2.5 0 00-2.5-2.5h-1A2.5 2.5 0 008.5 8v8a2.5 2.5 0 002.5 2.5h1a2.5 2.5 0 002.5-2.5"/>
                                    <path d="M6 10h6M6 14h6"/>
                                </svg>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Area in m²</label>
                            <input type="number" class="luxury-input" placeholder="0" min="1" />
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Rooms</label>
                            <input type="number" class="luxury-input" placeholder="0" min="1" max="20" />
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Contact Email</label>
                            <input type="email" class="luxury-input" placeholder="agent@example.com" />
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="luxury-label">Property Description</label>
                        <textarea class="luxury-input" rows="4" placeholder="Describe the property features, location, and unique selling points..."></textarea>
                        <div class="input-description">Detailed description helps attract potential buyers</div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="luxury-label">Search Location</label>
                        <div class="input-clearable">
                            <div class="input-with-icon">
                                <input type="search" class="luxury-input search-input" placeholder="Search for address or area..." />
                                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                </svg>
                            </div>
                            <button class="clear-button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="example-card">
                <h3>Advanced Search Filters</h3>
                <div class="form-container">
                    <div class="search-grid">
                        <div class="form-group">
                            <label class="luxury-label">Search Properties</label>
                            <div class="input-with-icon">
                                <input type="search" class="luxury-input search-input" placeholder="Villa, apartment, location..." />
                                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                </svg>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Min Price €</label>
                            <input type="number" class="luxury-input" placeholder="Min price" min="0" step="50000" />
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Max Price €</label>
                            <input type="number" class="luxury-input" placeholder="Max price" min="0" step="50000" />
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Property Type</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>All types</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>'''
        
        # Replace examples section
        pattern = r'<section class="section">\s*<h2 class="section-title">Real Estate Use Cases</h2>.*?</section>'
        content = re.sub(pattern, examples_html, content, flags=re.DOTALL)
        
        return content
    
    def create_api_section(self, content):
        """Erstelle Input-spezifische API-Dokumentation."""
        api_html = '''        <section class="section api-section">
                <h2 class="section-title">Input API Reference</h2>
            
                <h3>lyd-input Properties</h3>
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
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">type</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">text</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Input type: text, email, number, search, tel, url</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">variant</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">flat</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Visual variant: flat, bordered, faded, underlined</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">size</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">md</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Input size: sm, md, lg</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">color</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">default</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Color theme: default, primary, secondary, success, warning, danger</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isRequired</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Mark input as required for validation</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isDisabled</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Disable input interaction</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isInvalid</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Mark input as invalid with error styling</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isClearable</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Show clear button when input has value</td>
                    </tr>
                </tbody>
            </table>
            </div>
                
                <h3>Next.js Backoffice Integration</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// app/properties/create/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const PropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['apartment', 'house', 'villa', 'commercial']),
  price: z.number().min(0, 'Price must be positive'),
  area: z.number().min(1, 'Area must be positive'),
  rooms: z.number().min(1, 'At least 1 room required'),
  email: z.string().email('Invalid email format'),
  description: z.string().min(10, 'Description too short')
});

export default function CreatePropertyPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(PropertySchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        router.push('/properties');
      }
    } catch (error) {
      console.error('Failed to create property:', error);
    }
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)} className="space-y-6"&gt;
      &lt;lyd-input
        {...register('title')}
        label="Property Title"
        placeholder="Enter property title"
        isRequired
        isInvalid={!!errors.title}
        errorMessage={errors.title?.message}
      /&gt;
      
      &lt;lyd-input
        {...register('price', { valueAsNumber: true })}
        type="number"
        label="Price in €"
        placeholder="0"
        startContent="€"
        isInvalid={!!errors.price}
        errorMessage={errors.price?.message}
      /&gt;
      
      &lt;lyd-textarea
        {...register('description')}
        label="Property Description"
        placeholder="Describe the property..."
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
      /&gt;
      
      &lt;div className="flex gap-4"&gt;
        &lt;lyd-button variant="outline" type="button"&gt;Cancel&lt;/lyd-button&gt;
        &lt;lyd-button variant="primary" type="submit" loading={isSubmitting}&gt;
          Create Property
        &lt;/lyd-button&gt;
      &lt;/div&gt;
    &lt;/form&gt;
  );
}</code></pre>
        </section>'''
        
        # Replace API section
        pattern = r'<section class="section api-section">\s*<h2 class="section-title">API Reference</h2>.*?</section>'
        content = re.sub(pattern, api_html, content, flags=re.DOTALL)
        
        return content
    
    def add_heroui_inspired_css(self, content):
        """Füge HeroUI-inspirierte CSS-Klassen hinzu."""
        css_additions = '''
        /* HeroUI-inspired Input System */
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

        /* HeroUI-style Variants */
        .luxury-input.variant-flat {
            background: rgba(248, 250, 252, 0.8);
            border: none;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .luxury-input.variant-bordered {
            background: transparent;
            border: 2px solid #d1d5db;
        }

        .luxury-input.variant-faded {
            background: rgba(249, 250, 251, 0.6);
            border: 2px solid transparent;
            backdrop-filter: blur(10px);
        }

        .luxury-input.variant-underlined {
            background: transparent;
            border: none;
            border-bottom: 2px solid #d1d5db;
            border-radius: 0;
            padding: 12px 0;
        }

        /* HeroUI-style States */
        .luxury-input.state-success {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .luxury-input.state-error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        /* HeroUI-style Sizes */
        .luxury-input.size-sm {
            padding: 10px 16px;
            min-height: 40px;
            font-size: 14px;
        }

        .luxury-input.size-lg {
            padding: 20px 24px;
            min-height: 64px;
            font-size: 18px;
        }

        /* Labels */
        .luxury-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
        }

        .luxury-label.required::after {
            content: " *";
            color: #ef4444;
        }

        .luxury-label.disabled {
            color: #9ca3af;
        }

        .luxury-label.size-sm {
            font-size: 12px;
        }

        .luxury-label.size-lg {
            font-size: 16px;
        }

        /* Input with Icon */
        .input-with-icon {
            position: relative;
        }

        .input-with-icon .search-input {
            padding-left: 48px;
        }

        .input-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #6b7280;
            pointer-events: none;
        }

        /* Clearable Input */
        .input-clearable {
            position: relative;
        }

        .clear-button {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border: none;
            background: rgba(107, 114, 128, 0.1);
            border-radius: 50%;
            color: #6b7280;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .clear-button:hover {
            background: rgba(107, 114, 128, 0.2);
            color: #374151;
        }

        .clear-button svg {
            width: 16px;
            height: 16px;
        }

        /* Input Messages */
        .input-message {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
            font-size: 13px;
        }

        .input-message svg {
            width: 16px;
            height: 16px;
        }

        .input-message.success {
            color: #10b981;
        }

        .input-message.error {
            color: #ef4444;
        }

        .input-description {
            margin-top: 6px;
            font-size: 13px;
            color: #6b7280;
        }

        /* Form Layout */
        .form-container {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 32px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 24px;
        }

        .search-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .input-demo {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* Variants Showcase */
        .variants-showcase {
            display: flex;
            flex-direction: column;
            gap: 48px;
        }

        .variant-category {
            background: white;
            border-radius: 16px;
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .variant-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .variant-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: linear-gradient(135deg, #0066ff, #3366CC);
            border-radius: 2px;
        }

        .variant-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }

        .variant-item {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }

        .variant-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .variant-item h4 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }

        @media (max-width: 768px) {
            .search-grid {
                grid-template-columns: 1fr;
            }
            
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
'''
        
        # Insert CSS before closing </style>
        content = content.replace('        \n    </style>', f'{css_additions}        \n    </style>')
        return content
    
    def write_file_atomically(self, content):
        """Schreibe Datei atomar (alles oder nichts)."""
        file_path = f'{self.base_path}/inputs/index.html'
        temp_path = f'{file_path}.tmp'
        
        try:
            # Write to temporary file first
            with open(temp_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Validate temporary file
            self.validate_file_content(temp_path)
            
            # If validation passes, replace original
            shutil.move(temp_path, file_path)
            print("✅ File written atomically and validated")
            
        except Exception as e:
            # Clean up temp file on error
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e
    
    def validate_file_content(self, file_path):
        """Validiere Datei-Inhalt."""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for required elements
        required = [
            'Input Components',
            'Input System Overview',
            'lyd-input-text',
            'luxury-input',
            'Input Variants & States'
        ]
        
        # Check for forbidden elements
        forbidden = [
            'Button System Overview',
            'lyd-button" class="nav-item active"',
            'Primary button component'
        ]
        
        for item in required:
            if item not in content:
                raise ValueError(f"Missing required content: {item}")
        
        for item in forbidden:
            if item in content:
                raise ValueError(f"Found forbidden button content: {item}")

def main():
    """Baue robuste Input-Komponente nach HeroUI-Standards."""
    builder = HeroUIInspiredBuilder()
    builder.create_stable_inputs_page()
    
    print("\n🎯 HeroUI-inspired Input system completed!")
    print("📋 Features implemented:")
    print("  - Systematic variants (flat, bordered, faded, underlined)")
    print("  - Comprehensive states (success, error, disabled, required)")
    print("  - Professional sizes (sm, md, lg)")
    print("  - Advanced features (clearable, with icons, descriptions)")
    print("  - Robust validation and error handling")

if __name__ == "__main__":
    main()


