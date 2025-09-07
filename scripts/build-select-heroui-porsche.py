#!/usr/bin/env python3
"""
Build Select Component nach HeroUI + Porsche Design System Standards
Systematischer Aufbau mit allen Features und Variants
"""

import os
import re
from datetime import datetime

class SelectComponentBuilder:
    def __init__(self):
        self.base_path = '/Users/christianbernecker/live-your-dreams/design-system/components'
        self.template_path = f'{self.base_path}/buttons/index.html'
        
    def build_select_component(self):
        """Baue Select-Komponente nach HeroUI/Porsche Standards."""
        print("🚀 Building Select Component with HeroUI + Porsche standards...")
        
        # Load clean template
        with open(self.template_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Update Meta Information
        content = self.update_meta_info(content)
        
        # 2. Create Overview Section (HeroUI + Porsche style)
        content = self.create_overview_section(content)
        
        # 3. Create Variants Section (comprehensive)
        content = self.create_variants_section(content)
        
        # 4. Create Icon Library (proper sizing)
        content = self.create_icon_library_section(content)
        
        # 5. Create Examples Section (real estate focused)
        content = self.create_examples_section(content)
        
        # 6. Create API Section (Select-specific)
        content = self.create_api_section(content)
        
        # 7. Create Accessibility Section
        content = self.create_accessibility_section(content)
        
        # 8. Add Select-specific CSS
        content = self.add_select_css(content)
        
        # 9. Write file atomically
        self.write_file_atomically(content)
        
        print("✅ Professional Select component created successfully!")
    
    def update_meta_info(self, content):
        """Update title, subtitle and navigation."""
        replacements = [
            ('Button Components - LYD Design System', 'Select Components - LYD Design System'),
            ('<h1 class="page-title">Button Components</h1>', '<h1 class="page-title">Select Components</h1>'),
            ('<p class="page-subtitle">Interactive elements for user actions with luxury styling, micro-animations, and comprehensive state management.</p>', 
             '<p class="page-subtitle">Dropdown selection components with search, multi-select, and grouped options for data filtering.</p>'),
            ('<a href="/components/buttons/" class="nav-item active">Button</a>', '<a href="/components/buttons/" class="nav-item">Button</a>'),
            ('<a href="/components/select/" class="nav-item">Select</a>', '<a href="/components/select/" class="nav-item active">Select</a>')
        ]
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        return content
    
    def create_overview_section(self, content):
        """Erstelle Overview nach HeroUI/Porsche-Standards."""
        overview_html = '''        <section class="section">
                <h2 class="section-title">Select System Overview</h2>
                <p class="section-subtitle">Professional dropdown components inspired by HeroUI and Porsche Design System</p>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-select</h3>
                        <p>Standard dropdown with single selection and luxury styling</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select variant-flat">
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
                    
                    <div class="component-card">
                        <h3>lyd-select-searchable</h3>
                        <p>Searchable dropdown with real-time filtering</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Search Location</label>
                                <div class="luxury-select variant-bordered searchable">
                                    <div class="luxury-select-trigger">
                                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                        </svg>
                                        <span>Munich, Germany</span>
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

                    <div class="component-card">
                        <h3>lyd-select-multiple</h3>
                        <p>Multi-selection with chips and validation</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Amenities</label>
                                <div class="luxury-select variant-faded multiple">
                                    <div class="luxury-select-trigger">
                                        <div class="selected-chips">
                                            <span class="chip">Pool</span>
                                            <span class="chip">Garden</span>
                                            <span class="chip">+2 more</span>
                                        </div>
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

                    <div class="component-card">
                        <h3>lyd-select-grouped</h3>
                        <p>Organized options with section headers</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Property Category</label>
                                <div class="luxury-select variant-underlined">
                                    <div class="luxury-select-trigger">
                                        <span>Residential › Apartment</span>
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

                    <div class="component-card">
                        <h3>lyd-select-async</h3>
                        <p>Asynchronous loading with spinner and pagination</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Remote Data</label>
                                <div class="luxury-select loading">
                                    <div class="luxury-select-trigger">
                                        <span>Loading options...</span>
                                        <div class="loading-spinner">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <circle cx="12" cy="12" r="10"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-select-clearable</h3>
                        <p>Clearable selection with reset functionality</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Optional Filter</label>
                                <div class="luxury-select clearable">
                                    <div class="luxury-select-trigger">
                                        <span>Villa</span>
                                        <button class="clear-button">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                            </svg>
                                        </button>
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
        """Erstelle umfassende Variants nach HeroUI/Porsche-Standards."""
        variants_html = '''        <section class="section">
            <h2 class="section-title">Select Variants & States</h2>
            <p class="section-subtitle">Comprehensive select variations inspired by HeroUI and Porsche Design System</p>
            
            <div class="variants-showcase">
                <!-- Visual Variants -->
                <div class="variant-category">
                    <h3 class="variant-title">Visual Variants</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>Flat (Default)</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select variant-flat">
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
                        
                        <div class="variant-item">
                            <h4>Bordered</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select variant-bordered">
                                    <div class="luxury-select-trigger">
                                        <span>House</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Faded</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select variant-faded">
                                    <div class="luxury-select-trigger">
                                        <span>Villa</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Underlined</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select variant-underlined">
                                    <div class="luxury-select-trigger">
                                        <span>Commercial</span>
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
                
                <!-- Select States -->
                <div class="variant-category">
                    <h3 class="variant-title">Select States</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>Success State</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select state-success">
                                    <div class="luxury-select-trigger">
                                        <span>Luxury Villa</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="select-message success">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20,6 9,17 4,12"/>
                                    </svg>
                                    Valid selection
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Error State</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Property Type</label>
                                <div class="luxury-select state-error">
                                    <div class="luxury-select-trigger">
                                        <span>Please select...</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="select-message error">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                    Property type is required
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Disabled State</h4>
                            <div class="select-demo">
                                <label class="luxury-label disabled">Property Status</label>
                                <div class="luxury-select disabled">
                                    <div class="luxury-select-trigger">
                                        <span>Published</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Loading State</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Remote Data</label>
                                <div class="luxury-select loading">
                                    <div class="luxury-select-trigger">
                                        <span>Loading options...</span>
                                        <div class="loading-spinner">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <circle cx="12" cy="12" r="10"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Select Sizes -->
                <div class="variant-category">
                    <h3 class="variant-title">Select Sizes</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>Small (sm)</h4>
                            <div class="select-demo">
                                <label class="luxury-label size-sm">Compact Select</label>
                                <div class="luxury-select size-sm">
                                    <div class="luxury-select-trigger">
                                        <span>Small option</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Medium (md) - Default</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Standard Select</label>
                                <div class="luxury-select">
                                    <div class="luxury-select-trigger">
                                        <span>Medium option</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>Large (lg)</h4>
                            <div class="select-demo">
                                <label class="luxury-label size-lg">Prominent Select</label>
                                <div class="luxury-select size-lg">
                                    <div class="luxury-select-trigger">
                                        <span>Large option</span>
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
                
                <!-- Advanced Features -->
                <div class="variant-category">
                    <h3 class="variant-title">Advanced Features</h3>
                    <div class="variant-grid">
                        <div class="variant-item">
                            <h4>With Description</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Price Range</label>
                                <div class="luxury-select">
                                    <div class="luxury-select-trigger">
                                        <span>€500K - €1M</span>
                                        <div class="luxury-select-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6,9 12,15 18,9"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="select-description">Select your budget range for property search</div>
                            </div>
                        </div>
                        
                        <div class="variant-item">
                            <h4>With Start Content</h4>
                            <div class="select-demo">
                                <label class="luxury-label">Currency</label>
                                <div class="luxury-select with-start-content">
                                    <div class="luxury-select-trigger">
                                        <svg class="start-content" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path d="M14.5 8a2.5 2.5 0 00-2.5-2.5h-1A2.5 2.5 0 008.5 8v8a2.5 2.5 0 002.5 2.5h1a2.5 2.5 0 002.5-2.5"/>
                                            <path d="M6 10h6M6 14h6"/>
                                        </svg>
                                        <span>Euro (EUR)</span>
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
            </div>
        </section>'''
        
        # Replace variants section
        pattern = r'<section class="section">\s*<h2 class="section-title">Button Variants</h2>.*?</section>'
        content = re.sub(pattern, variants_html, content, flags=re.DOTALL)
        
        return content
    
    def create_icon_library_section(self, content):
        """Erstelle Icon Library mit korrekter Größe."""
        icon_html = '''            <section class="section">
                <h2 class="section-title">Select Icons</h2>
                <p class="section-subtitle">Icons for dropdown arrows, search, and selection states</p>
                
                <div class="icon-grid">
                    <div class="icon-card" onclick="copyToClipboard('chevron-down')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"/>
                            </svg>
                        </div>
                        <span class="icon-name">chevron-down</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('search')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <span class="icon-name">search</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('check')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20,6 9,17 4,12"/>
                            </svg>
                        </div>
                        <span class="icon-name">check</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('x')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </div>
                        <span class="icon-name">x</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('filter')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                            </svg>
                        </div>
                        <span class="icon-name">filter</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('location')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                        </div>
                        <span class="icon-name">location</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('home')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
                            </svg>
                        </div>
                        <span class="icon-name">home</span>
                    </div>
                    
                    <div class="icon-card" onclick="copyToClipboard('building')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                        </div>
                        <span class="icon-name">building</span>
                    </div>
                </div>
        </section>'''
        
        # Replace icon library section
        pattern = r'<section class="section">\s*<h2 class="section-title">Icon Library</h2>.*?</section>'
        content = re.sub(pattern, icon_html, content, flags=re.DOTALL)
        
        return content
    
    def create_examples_section(self, content):
        """Erstelle professionelle Real Estate Examples."""
        examples_html = '''        <section class="section">
            <h2 class="section-title">Real Estate Select Examples</h2>
            
            <div class="example-card">
                <h3>Property Search Interface</h3>
                <div class="form-container">
                    <div class="search-grid">
                        <div class="form-group">
                            <label class="luxury-label">Property Type</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>All Types</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Location</label>
                            <div class="luxury-select searchable">
                                <div class="luxury-select-trigger">
                                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                    </svg>
                                    <span>Search location...</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Price Range</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>€500K - €1M</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Amenities</label>
                            <div class="luxury-select multiple">
                                <div class="luxury-select-trigger">
                                    <div class="selected-chips">
                                        <span class="chip">Pool</span>
                                        <span class="chip">Garden</span>
                                        <span class="chip">+1 more</span>
                                    </div>
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
            
            <div class="example-card">
                <h3>Property Configuration Form</h3>
                <div class="form-container">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="luxury-label required">Property Category</label>
                            <div class="luxury-select variant-bordered">
                                <div class="luxury-select-trigger">
                                    <span>Residential</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label required">Property Sub-Type</label>
                            <div class="luxury-select variant-bordered">
                                <div class="luxury-select-trigger">
                                    <span>Luxury Apartment</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Energy Rating</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>A+</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="select-description">Energy efficiency rating (A+ to G)</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Availability Status</label>
                            <div class="luxury-select clearable">
                                <div class="luxury-select-trigger">
                                    <span>Available Now</span>
                                    <button class="clear-button">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
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
        """Erstelle Select-spezifische API-Dokumentation."""
        api_html = '''        <section class="section api-section">
                <h2 class="section-title">Select API Reference</h2>
            
                <h3>lyd-select Properties</h3>
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
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">variant</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">flat</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Visual variant: flat, bordered, faded, underlined</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">size</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">md</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Select size: sm, md, lg</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">color</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">default</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Color theme: default, primary, secondary, success, warning, danger</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isSearchable</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Enable search functionality in dropdown</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isMultiple</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Allow multiple selections with chips</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isDisabled</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Disable select interaction</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isClearable</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Show clear button when value is selected</td>
                    </tr>
                </tbody>
            </table>
            </div>
                
                <h3>Next.js Backoffice Integration</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// app/properties/create/page.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const PropertySchema = z.object({
  type: z.string().min(1, 'Property type is required'),
  location: z.string().min(1, 'Location is required'),
  priceRange: z.string().optional(),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  category: z.string().min(1, 'Category is required')
});

export default function CreatePropertyPage() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(PropertySchema)
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const locations = [
    { value: 'munich', label: 'Munich' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'frankfurt', label: 'Frankfurt' }
  ];

  const amenities = [
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'garden', label: 'Garden' },
    { value: 'garage', label: 'Garage' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'parking', label: 'Parking' }
  ];

  return (
    &lt;form className="space-y-6"&gt;
      &lt;Controller
        name="type"
        control={control}
        render={({ field }) => (
          &lt;lyd-select
            {...field}
            label="Property Type"
            placeholder="Select property type"
            isRequired
            isInvalid={!!errors.type}
            errorMessage={errors.type?.message}
            options={propertyTypes}
          /&gt;
        )}
      /&gt;
      
      &lt;Controller
        name="location"
        control={control}
        render={({ field }) => (
          &lt;lyd-select
            {...field}
            label="Location"
            placeholder="Search location..."
            isSearchable
            isRequired
            isInvalid={!!errors.location}
            errorMessage={errors.location?.message}
            options={locations}
          /&gt;
        )}
      /&gt;
      
      &lt;Controller
        name="amenities"
        control={control}
        render={({ field }) => (
          &lt;lyd-select
            {...field}
            label="Amenities"
            placeholder="Select amenities"
            isMultiple
            isRequired
            isInvalid={!!errors.amenities}
            errorMessage={errors.amenities?.message}
            options={amenities}
          /&gt;
        )}
      /&gt;
    &lt;/form&gt;
  );
}</code></pre>
                
                <h3>Select Component Features</h3>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4>Alle verfügbaren Select-Features:</h4>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li><strong>Single Selection</strong> - Standard Dropdown-Auswahl</li>
                        <li><strong>Multi Selection</strong> - Mehrfachauswahl mit Chips</li>
                        <li><strong>Searchable</strong> - Durchsuchbare Optionen mit Filter</li>
                        <li><strong>Grouped</strong> - Kategorisierte Optionen mit Headern</li>
                        <li><strong>Async Loading</strong> - Dynamisches Laden von Remote-Daten</li>
                        <li><strong>Virtualization</strong> - Performance-optimiert für große Listen</li>
                    </ul>
            </div>

                <h3>TypeScript Integration</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// types/lyd-design-system.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lyd-select': {
        variant?: 'flat' | 'bordered' | 'faded' | 'underlined';
        size?: 'sm' | 'md' | 'lg';
        color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
        label?: string;
        placeholder?: string;
        value?: string | string[];
        isRequired?: boolean;
        isDisabled?: boolean;
        isInvalid?: boolean;
        isSearchable?: boolean;
        isMultiple?: boolean;
        isClearable?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        description?: string;
        startContent?: React.ReactNode;
        endContent?: React.ReactNode;
        options?: Array<{value: string, label: string, disabled?: boolean}>;
        sections?: Array<{title: string, options: Array<{value: string, label: string}>}>;
        maxHeight?: string;
        virtualized?: boolean;
        onChange?: (value: string | string[]) => void;
        onSelectionChange?: (selection: Set<string>) => void;
        children?: React.ReactNode;
      };
      
      'lyd-select-item': {
        value: string;
        isDisabled?: boolean;
        textValue?: string;
        children?: React.ReactNode;
      };
      
      'lyd-select-section': {
        title?: string;
        children?: React.ReactNode;
      };
    }
  }
}

export {};

// Hook für Select Events
import { useEffect, useRef } from 'react';

export const useLydSelect = (
  onSelectionChange?: (selection: Set<string>) => void,
  onOpenChange?: (isOpen: boolean) => void
) => {
  const ref = useRef&lt;HTMLDivElement&gt;(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleSelectionChange = (e: CustomEvent) => {
      onSelectionChange?.(e.detail.selection);
    };
    
    const handleOpenChange = (e: CustomEvent) => {
      onOpenChange?.(e.detail.isOpen);
    };
    
    element.addEventListener('lyd-selection-change', handleSelectionChange as EventListener);
    element.addEventListener('lyd-open-change', handleOpenChange as EventListener);
    
    return () => {
      element.removeEventListener('lyd-selection-change', handleSelectionChange as EventListener);
      element.removeEventListener('lyd-open-change', handleOpenChange as EventListener);
    };
  }, [onSelectionChange, onOpenChange]);
  
  return ref;
};</code></pre>
        </section>'''
        
        # Replace API section
        pattern = r'<section class="section api-section">\s*<h2 class="section-title">API Reference</h2>.*?</section>'
        content = re.sub(pattern, api_html, content, flags=re.DOTALL)
        
        return content
    
    def create_accessibility_section(self, content):
        """Erstelle Select-spezifische Accessibility."""
        accessibility_html = '''        <section class="section">
            <div class="accessibility-badge" style="display: flex; align-items: center; gap: 16px; padding: 24px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9; border-radius: 12px; box-shadow: 0 4px 16px rgba(14, 165, 233, 0.1); margin-bottom: 32px;">
                <svg style="width: 48px; height: 48px; color: #0ea5e9;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/><path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/><path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                </svg>
                <div>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0c4a6e;">WCAG 2.1 AA Compliant</h2>
                    <p style="margin: 0; color: #0369a1; font-size: 15px; line-height: 1.5;">All select components meet accessibility standards for keyboard navigation and screen readers.</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
                <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 18px; font-weight: 600; color: #1f2937;">
                        <svg style="width: 24px; height: 24px; color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        Keyboard Navigation
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Tab</kbd>
                            <span style="color: #374151; font-size: 15px;">Focus select component</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Space/Enter</kbd>
                            <span style="color: #374151; font-size: 15px;">Open/close dropdown</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Arrow Keys</kbd>
                            <span style="color: #374151; font-size: 15px;">Navigate options</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Escape</kbd>
                            <span style="color: #374151; font-size: 15px;">Close dropdown</span>
                        </div>
                    </div>
                </div>
                
                <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 18px; font-weight: 600; color: #1f2937;">
                        <svg style="width: 24px; height: 24px; color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M8 12l2 2 4-4"/>
                        </svg>
                        Screen Reader Support
                    </h3>
                    <div style="display: grid; gap: 16px;">
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">ARIA Labels</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Proper labeling for all select components</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Selection Announcements</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Changes are announced to screen readers</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Option Navigation</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Keyboard navigation through all available options</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">State Communication</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Loading, error, and disabled states are clearly communicated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>'''
        
        # Replace accessibility section
        pattern = r'<section class="section">\s*<h2 class="section-title">Accessibility Guidelines</h2>.*?</section>'
        content = re.sub(pattern, accessibility_html, content, flags=re.DOTALL)
        
        return content
    
    def add_select_css(self, content):
        """Füge umfassendes Select-CSS hinzu."""
        css_additions = '''
        /* HeroUI + Porsche-inspired Select System */
        .luxury-select {
            position: relative;
            width: 100%;
        }

        .luxury-select-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 16px;
            color: #374151;
            min-height: 56px;
            position: relative;
            overflow: hidden;
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

        /* HeroUI-style Variants */
        .luxury-select.variant-flat .luxury-select-trigger {
            background: rgba(248, 250, 252, 0.8);
            border: none;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .luxury-select.variant-bordered .luxury-select-trigger {
            background: transparent;
            border: 2px solid #d1d5db;
        }

        .luxury-select.variant-faded .luxury-select-trigger {
            background: rgba(249, 250, 251, 0.6);
            border: 2px solid transparent;
            backdrop-filter: blur(10px);
        }

        .luxury-select.variant-underlined .luxury-select-trigger {
            background: transparent;
            border: none;
            border-bottom: 2px solid #d1d5db;
            border-radius: 0;
            padding: 12px 20px 12px 0;
        }

        /* Select States */
        .luxury-select.state-success .luxury-select-trigger {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .luxury-select.state-error .luxury-select-trigger {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .luxury-select.disabled .luxury-select-trigger {
            background: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .luxury-select.loading .luxury-select-trigger {
            pointer-events: none;
        }

        /* Select Sizes */
        .luxury-select.size-sm .luxury-select-trigger {
            padding: 10px 16px;
            min-height: 40px;
            font-size: 14px;
        }

        .luxury-select.size-lg .luxury-select-trigger {
            padding: 20px 24px;
            min-height: 64px;
            font-size: 18px;
        }

        /* Select Arrow */
        .luxury-select-arrow {
            display: flex;
            align-items: center;
            transition: transform 0.2s ease;
            color: #6b7280;
        }

        .luxury-select-arrow svg {
            width: 16px;
            height: 16px;
        }

        .luxury-select.open .luxury-select-arrow {
            transform: rotate(180deg);
        }

        /* Loading Spinner */
        .loading-spinner {
            display: flex;
            align-items: center;
            color: #3b82f6;
        }

        .loading-spinner svg {
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Multiple Selection Chips */
        .selected-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            flex: 1;
        }

        .chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
        }

        /* Searchable Select */
        .luxury-select.searchable .search-icon {
            width: 16px;
            height: 16px;
            color: #6b7280;
            margin-right: 8px;
        }

        /* Clear Button */
        .clear-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: none;
            background: rgba(107, 114, 128, 0.1);
            border-radius: 50%;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-left: 8px;
        }

        .clear-button:hover {
            background: rgba(107, 114, 128, 0.2);
            color: #374151;
        }

        .clear-button svg {
            width: 12px;
            height: 12px;
        }

        /* Start Content */
        .luxury-select.with-start-content .start-content {
            width: 16px;
            height: 16px;
            color: #6b7280;
            margin-right: 8px;
        }

        /* Messages */
        .select-message {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
            font-size: 13px;
        }

        .select-message svg {
            width: 16px;
            height: 16px;
        }

        .select-message.success {
            color: #10b981;
        }

        .select-message.error {
            color: #ef4444;
        }

        .select-description {
            margin-top: 6px;
            font-size: 13px;
            color: #6b7280;
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

        /* Demo Containers */
        .select-demo {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* Form Layout */
        .search-grid {
            display: grid;
            grid-template-columns: 2fr 1.5fr 1fr 1.5fr;
            gap: 20px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
        }

        /* Icon Grid Fixes */
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 16px;
            padding: 24px;
            background: white;
            border-radius: 6px;
        }
        
        .icon-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 16px 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
            cursor: pointer;
            min-width: 80px;
        }
        
        .icon-card:hover {
            background: #f9fafb;
            transform: translateY(-2px);
        }
        
        .icon-display {
            width: 32px !important;
            height: 32px !important;
            color: #374151;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon-display svg {
            width: 20px !important;
            height: 20px !important;
        }
        
        .icon-name {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            font-weight: 500;
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
        """Schreibe Datei atomar."""
        file_path = f'{self.base_path}/select/index.html'
        temp_path = f'{file_path}.tmp'
        
        try:
            # Write to temporary file first
            with open(temp_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Validate temporary file
            self.validate_file_content(temp_path)
            
            # If validation passes, replace original
            import shutil
            shutil.move(temp_path, file_path)
            print("✅ Select file written atomically and validated")
            
        except Exception as e:
            # Clean up temp file on error
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e
    
    def validate_file_content(self, file_path):
        """Validiere Select-spezifischen Content."""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for required elements
        required = [
            'Select Components',
            'Select System Overview',
            'lyd-select',
            'luxury-select',
            'Select Variants & States',
            'Select API Reference'
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
    """Baue professionelle Select-Komponente."""
    builder = SelectComponentBuilder()
    builder.build_select_component()
    
    print("\n🎯 Professional Select system completed!")
    print("📋 Features implemented:")
    print("  - HeroUI-inspired variants (flat, bordered, faded, underlined)")
    print("  - Comprehensive states (success, error, disabled, loading)")
    print("  - Professional sizes (sm, md, lg)")
    print("  - Advanced features (searchable, multiple, clearable, async)")
    print("  - Proper icon sizing (20px instead of 32px)")
    print("  - Select-specific API documentation")
    print("  - WCAG 2.1 AA accessibility compliance")

if __name__ == "__main__":
    main()


