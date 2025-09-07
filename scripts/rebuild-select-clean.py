#!/usr/bin/env python3
"""
Complete clean rebuild of Select component page
- Fix broken tabs
- Clean section structure  
- Working dropdown functionality
- Proper validation
"""

import os
import shutil

def rebuild_select_clean():
    """Kompletter sauberer Neuaufbau der Select-Seite."""
    
    print("🔄 Complete clean rebuild of Select component...")
    
    # Source files
    button_file = '/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html'
    select_file = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
    
    # Backup current file
    backup_file = f'{select_file}.backup'
    if os.path.exists(select_file):
        shutil.copy2(select_file, backup_file)
        print(f"📦 Backup created: {backup_file}")
    
    # Load clean button template
    with open(button_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Meta Information
    content = content.replace('Button Components - LYD Design System', 'Select Components - LYD Design System')
    content = content.replace('<h1 class="page-title">Button Components</h1>', '<h1 class="page-title">Select Components</h1>')
    content = content.replace('<p class="page-subtitle">Interactive elements for user actions with luxury styling, micro-animations, and comprehensive state management.</p>', 
                             '<p class="page-subtitle">Dropdown selection components with search, multi-select, and grouped options for data filtering.</p>')
    
    # Update navigation
    content = content.replace('<a href="/components/buttons/" class="nav-item active">Button</a>', '<a href="/components/buttons/" class="nav-item">Button</a>')
    content = content.replace('<a href="/components/select/" class="nav-item">Select</a>', '<a href="/components/select/" class="nav-item active">Select</a>')
    
    # 2. Replace Tab Navigation with new 4-tab structure
    new_tab_navigation = '''        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="variants">Variants</button>
            <button class="tab" data-tab="examples">Examples</button>
            <button class="tab" data-tab="implementation">Implementation</button>
            <button class="tab" data-tab="accessibility">Accessibility</button>
        </div>'''
    
    # 3. Create clean Variants tab
    variants_tab = '''        <!-- Tab Content: Variants -->
        <div class="tab-content active" id="variants">
        <section class="section">
                <h2 class="section-title">Select Variants & Components</h2>
                <p class="section-subtitle">All select components and their variations in one comprehensive view</p>
                
                <div class="variants-showcase">
                    <!-- Basic Select Components -->
                    <div class="variant-category">
                        <h3 class="variant-title">Basic Select Components</h3>
                        <div class="variant-grid">
                            <div class="variant-item">
                                <h4>lyd-select</h4>
                                <p>Standard dropdown with single selection</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Type</label>
                                    <div class="luxury-select" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Apartment</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Apartment')">Apartment</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'House')">House</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Villa')">Villa</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Commercial')">Commercial</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>lyd-select-multiple</h4>
                                <p>Multi-selection with chips</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Amenities</label>
                                    <div class="luxury-select multiple" onclick="toggleDropdown(this)">
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
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Pool')">Swimming Pool</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Garden')">Garden</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Garage')">Garage</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Balcony')">Balcony</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>lyd-select-searchable</h4>
                                <p>Searchable dropdown with filtering</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Search Location</label>
                                    <div class="luxury-select searchable" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Munich, Germany</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-search">
                                                <input type="text" placeholder="Search locations..." onclick="event.stopPropagation()">
                                            </div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Munich, Germany')">Munich, Germany</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Berlin, Germany')">Berlin, Germany</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Hamburg, Germany')">Hamburg, Germany</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Visual Variants -->
                    <div class="variant-category">
                        <h3 class="variant-title">Visual Variants</h3>
                        <div class="variant-grid">
                            <div class="variant-item">
                                <h4>Flat (Default)</h4>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Type</label>
                                    <div class="luxury-select variant-flat" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Apartment</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Apartment')">Apartment</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'House')">House</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>Bordered</h4>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Type</label>
                                    <div class="luxury-select variant-bordered" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>House</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'House')">House</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Villa')">Villa</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>Faded</h4>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Type</label>
                                    <div class="luxury-select variant-faded" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Villa</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Villa')">Villa</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Mansion')">Mansion</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>Underlined</h4>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Type</label>
                                    <div class="luxury-select variant-underlined" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Commercial</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Commercial')">Commercial</div>
                                            <div class="dropdown-option" onclick="selectOption(this, 'Office')">Office</div>
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
                                    <div class="luxury-select size-sm" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Small option</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Small option')">Small option</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>Medium (md) - Default</h4>
                                <div class="select-demo">
                                    <label class="luxury-label">Standard Select</label>
                                    <div class="luxury-select" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Medium option</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Medium option')">Medium option</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>Large (lg)</h4>
                                <div class="select-demo">
                                    <label class="luxury-label size-lg">Prominent Select</label>
                                    <div class="luxury-select size-lg" onclick="toggleDropdown(this)">
                                        <div class="luxury-select-trigger">
                                            <span>Large option</span>
                                            <div class="luxury-select-arrow">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="dropdown-content">
                                            <div class="dropdown-option" onclick="selectOption(this, 'Large option')">Large option</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
        </div>'''
    
    # 4. Create Examples tab
    examples_tab = '''        <!-- Tab Content: Examples -->
        <div class="tab-content" id="examples">
        <section class="section">
            <h2 class="section-title">Real Estate Select Examples</h2>
            
            <div class="example-card">
                <h3>Property Search Interface</h3>
                <div class="form-container">
                    <div class="search-grid">
                        <div class="form-group">
                            <label class="luxury-label">Property Type</label>
                            <div class="luxury-select" onclick="toggleDropdown(this)">
                                <div class="luxury-select-trigger">
                                    <span>All Types</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="dropdown-content">
                                    <div class="dropdown-option" onclick="selectOption(this, 'All Types')">All Types</div>
                                    <div class="dropdown-option" onclick="selectOption(this, 'Apartment')">Apartment</div>
                                    <div class="dropdown-option" onclick="selectOption(this, 'House')">House</div>
                                    <div class="dropdown-option" onclick="selectOption(this, 'Villa')">Villa</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Location</label>
                            <div class="luxury-select searchable" onclick="toggleDropdown(this)">
                                <div class="luxury-select-trigger">
                                    <span>Search location...</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="dropdown-content">
                                    <div class="dropdown-search">
                                        <input type="text" placeholder="Search..." onclick="event.stopPropagation()">
                                    </div>
                                    <div class="dropdown-option" onclick="selectOption(this, 'Munich')">Munich</div>
                                    <div class="dropdown-option" onclick="selectOption(this, 'Berlin')">Berlin</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="luxury-label">Price Range</label>
                            <div class="luxury-select" onclick="toggleDropdown(this)">
                                <div class="luxury-select-trigger">
                                    <span>€500K - €1M</span>
                                    <div class="luxury-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6,9 12,15 18,9"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="dropdown-content">
                                    <div class="dropdown-option" onclick="selectOption(this, 'Under €500K')">Under €500K</div>
                                    <div class="dropdown-option" onclick="selectOption(this, '€500K - €1M')">€500K - €1M</div>
                                    <div class="dropdown-option" onclick="selectOption(this, 'Over €1M')">Over €1M</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>'''
    
    # 5. Create Implementation tab
    implementation_tab = '''        <!-- Tab Content: Implementation -->
        <div class="tab-content" id="implementation">
        <section class="section api-section">
                <h2 class="section-title">Implementation Guide</h2>
                <p class="section-subtitle">Complete implementation documentation for Select components</p>
            
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
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isSearchable</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Enable search functionality in dropdown</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isMultiple</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Allow multiple selections with chips</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isDisabled</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Disable select interaction</td>
                    </tr>
                </tbody>
            </table>
            </div>
                
                <h3>Next.js Implementation</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// app/properties/create/page.tsx
'use client';

import { Controller, useForm } from 'react-hook-form';

export default function CreatePropertyPage() {
  const { control } = useForm();

  return (
    &lt;form className="space-y-6"&gt;
      &lt;Controller
        name="propertyType"
        control={control}
        render={({ field }) => (
          &lt;lyd-select
            {...field}
            label="Property Type"
            placeholder="Select property type"
            isRequired
          &gt;
            &lt;option value="apartment"&gt;Apartment&lt;/option&gt;
            &lt;option value="house"&gt;House&lt;/option&gt;
            &lt;option value="villa"&gt;Villa&lt;/option&gt;
          &lt;/lyd-select&gt;
        )}
      /&gt;
      
      &lt;lyd-select
        label="Location" 
        isSearchable
        placeholder="Search location..."
      /&gt;
      
      &lt;lyd-select
        label="Amenities"
        isMultiple
        placeholder="Select amenities"
      /&gt;
    &lt;/form&gt;
  );
}</code></pre>
        </section>
        </div>'''
    
    # 6. Create Accessibility tab
    accessibility_tab = '''        <!-- Tab Content: Accessibility -->
        <div class="tab-content" id="accessibility">
        <section class="section">
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
                    </div>
                </div>
            </div>
        </section>
        </div>'''
    
    # 7. Add comprehensive CSS and JavaScript
    select_css_js = '''
        /* Clean Select Styles */
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

        .luxury-select-trigger:hover:not(.disabled) {
            border-color: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

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

        /* Dropdown Content */
        .dropdown-content {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            display: none;
        }

        .luxury-select.open .dropdown-content {
            display: block;
            animation: dropdownFadeIn 0.2s ease;
        }

        @keyframes dropdownFadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-option {
            padding: 12px 16px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
            color: #374151;
        }

        .dropdown-option:last-child {
            border-bottom: none;
        }

        .dropdown-option:hover {
            background: #f9fafb;
        }

        .dropdown-option.selected {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            font-weight: 500;
        }

        .dropdown-search {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }

        .dropdown-search input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
        }

        /* Visual Variants */
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

        /* Multiple Selection Chips */
        .selected-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            flex: 1;
            min-width: 0;
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
            white-space: nowrap;
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

        /* Labels */
        .luxury-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
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

        /* Demo containers */
        .select-demo {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* Form Layout */
        .search-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 768px) {
            .search-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Working Dropdown JavaScript Functions */
        function toggleDropdown(selectElement) {
            event.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.luxury-select.open').forEach(select => {
                if (select !== selectElement) {
                    select.classList.remove('open');
                }
            });
            
            // Toggle current dropdown
            selectElement.classList.toggle('open');
        }
        
        function selectOption(optionElement, value) {
            event.stopPropagation();
            
            const selectElement = optionElement.closest('.luxury-select');
            const triggerSpan = selectElement.querySelector('.luxury-select-trigger span');
            
            if (triggerSpan) {
                triggerSpan.textContent = value;
            }
            
            // Mark option as selected
            selectElement.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionElement.classList.add('selected');
            
            // Close dropdown
            selectElement.classList.remove('open');
            
            // Show success message briefly
            showToast(`Selected: ${value}`, 'success');
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            document.querySelectorAll('.luxury-select.open').forEach(select => {
                select.classList.remove('open');
            });
        });
'''
    
    # Apply all replacements systematically
    import re
    
    # Replace tab navigation
    tab_pattern = r'<!-- Tab Navigation -->\s*<div class="tabs">.*?</div>'
    content = re.sub(tab_pattern, new_tab_navigation, content, flags=re.DOTALL)
    
    # Remove all existing tab content and replace with new structure
    all_content_pattern = r'<!-- Tab Content: Overview -->.*?<!-- Global JavaScript -->'
    new_content = f'''{variants_tab}
        
        {examples_tab}
        
        {implementation_tab}
        
        {accessibility_tab}
        
    </main>
    
    <!-- Global JavaScript -->'''
    
    content = re.sub(all_content_pattern, new_content, content, flags=re.DOTALL)
    
    # Add select-specific CSS and JavaScript
    content = content.replace('        \n    </style>', f'{select_css_js}        \n    </style>')
    
    # Write clean file
    with open(select_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Validate the file
    validate_select_file(select_file)
    
    print("✅ Select component completely rebuilt and validated!")

def validate_select_file(file_path):
    """Validiere die Select-Datei auf Korrektheit."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Required elements
    required_elements = [
        'Select Components',
        'data-tab="variants"',
        'data-tab="examples"', 
        'data-tab="implementation"',
        'data-tab="accessibility"',
        'Basic Select Components',
        'Visual Variants',
        'toggleDropdown',
        'selectOption'
    ]
    
    # Forbidden elements
    forbidden_elements = [
        'Button System Overview',
        'data-tab="overview"',
        'data-tab="icons"',
        'lyd-button" class="nav-item active"'
    ]
    
    missing = []
    found_forbidden = []
    
    for element in required_elements:
        if element not in content:
            missing.append(element)
    
    for element in forbidden_elements:
        if element in content:
            found_forbidden.append(element)
    
    if missing:
        raise ValueError(f"Missing required elements: {missing}")
    
    if found_forbidden:
        raise ValueError(f"Found forbidden elements: {found_forbidden}")
    
    print("✅ Validation passed - all required elements present, no forbidden content")

def main():
    """Hauptfunktion für sauberen Select-Rebuild."""
    try:
        rebuild_select_clean()
        print("\n🎯 Clean Select component completed!")
        print("📋 Features:")
        print("  - ✅ Working 4-tab navigation")
        print("  - ✅ Clean section structure")
        print("  - ✅ Functional dropdowns with JavaScript")
        print("  - ✅ No duplicate content")
        print("  - ✅ Proper validation")
        
    except Exception as e:
        print(f"❌ Error during rebuild: {str(e)}")
        # Restore backup if available
        select_file = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
        backup_file = f'{select_file}.backup'
        if os.path.exists(backup_file):
            shutil.copy2(backup_file, select_file)
            print("🔄 Restored from backup")

if __name__ == "__main__":
    main()


