#!/usr/bin/env python3
"""
Reorganize Select Component to new 4-tab structure:
1) Variants - All variants from Overview + Variants combined
2) Examples - Real estate use cases
3) Implementation - API documentation (renamed from API)
4) Accessibility - WCAG compliance

Remove Icon Library tab completely.
"""

import os
import re

def reorganize_select_new_structure():
    """Reorganisiere Select nach neuem 4-Tab-System."""
    file_path = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
    
    print("🔄 Reorganizing Select to new 4-tab structure...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Tab Navigation - remove Overview and Icon Library
    new_tab_navigation = '''        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="variants">Variants</button>
            <button class="tab" data-tab="examples">Examples</button>
            <button class="tab" data-tab="implementation">Implementation</button>
            <button class="tab" data-tab="accessibility">Accessibility</button>
        </div>'''
    
    # 2. New Variants Tab - combines Overview + Variants content
    new_variants_tab = '''        <!-- Tab Content: Variants -->
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
                            
                            <div class="variant-item">
                                <h4>lyd-input-search</h4>
                                <p>Search input for filtering and location lookup</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Search Location</label>
                                    <div style="position: relative;">
                                        <input type="search" class="luxury-input" placeholder="Search properties..." style="padding-left: 48px;" />
                                        <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #6b7280;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="variant-item">
                                <h4>lyd-textarea</h4>
                                <p>Multi-line text area for descriptions</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Description</label>
                                    <textarea class="luxury-input" rows="3" placeholder="Property description">Beautiful luxury villa with panoramic views...</textarea>
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
                    
                    <!-- Specialized Select Types -->
                    <div class="variant-category">
                        <h3 class="variant-title">Specialized Select Types</h3>
                        <div class="variant-grid">
                            <div class="variant-item">
                                <h4>lyd-select-multiple</h4>
                                <p>Multi-selection with chips and validation</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Amenities</label>
                                    <div class="luxury-select">
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
                            
                            <div class="variant-item">
                                <h4>lyd-select-grouped</h4>
                                <p>Organized options with section headers</p>
                                <div class="select-demo">
                                    <label class="luxury-label">Property Category</label>
                                    <div class="luxury-select">
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
                            
                            <div class="variant-item">
                                <h4>lyd-select-async</h4>
                                <p>Asynchronous loading with spinner</p>
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
                            
                            <div class="variant-item">
                                <h4>lyd-select-clearable</h4>
                                <p>Clearable selection with reset functionality</p>
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
                </div>
        </section>
        </div>'''
    
    # 3. Implementation Tab (renamed from API)
    new_implementation_tab = '''        <!-- Tab Content: Implementation -->
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
                        <li><strong>Clearable</strong> - Reset-Funktionalität</li>
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
    }
  }
}

export {};</code></pre>
        </section>
        </div>'''
    
    # Apply all changes
    try:
        # Replace tab navigation
        tab_pattern = r'<!-- Tab Navigation -->\s*<div class="tabs">.*?</div>'
        content = re.sub(tab_pattern, new_tab_navigation, content, flags=re.DOTALL)
        
        # Remove Overview tab completely
        overview_pattern = r'<!-- Tab Content: Overview -->\s*<div class="tab-content active" id="overview">.*?</div>\s*</div>'
        content = re.sub(overview_pattern, '', content, flags=re.DOTALL)
        
        # Replace Variants tab with new combined content
        variants_pattern = r'<!-- Tab Content: Variants -->\s*<div class="tab-content" id="variants">.*?</div>\s*</div>'
        content = re.sub(variants_pattern, new_variants_tab, content, flags=re.DOTALL)
        
        # Remove Icon Library tab completely
        icon_pattern = r'<!-- Tab Content: Icon Library -->\s*<div class="tab-content" id="icons">.*?</div>\s*</div>'
        content = re.sub(icon_pattern, '', content, flags=re.DOTALL)
        
        # Replace API tab with Implementation tab
        api_pattern = r'<!-- Tab Content: API -->\s*<div class="tab-content" id="api">.*?</div>\s*</div>'
        content = re.sub(api_pattern, new_implementation_tab, content, flags=re.DOTALL)
        
        # Update JavaScript to handle new tab structure
        js_update = '''
        // Updated tab switching for new 4-tab structure
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                contents.forEach(c => c.classList.remove('active'));
                const target = document.getElementById(targetId);
                if (target) target.classList.add('active');
                
                window.location.hash = targetId;
            });
        });
        
        // Handle initial hash for new structure
        if (window.location.hash) {
            const hashTab = window.location.hash.slice(1);
            const validTabs = ['variants', 'examples', 'implementation', 'accessibility'];
            if (validTabs.includes(hashTab)) {
                const tab = document.querySelector(`[data-tab="${hashTab}"]`);
                if (tab) tab.click();
            }
        }'''
        
        # Replace tab switching JavaScript
        content = re.sub(
            r'// Tab switching functionality.*?}',
            js_update,
            content,
            flags=re.DOTALL
        )
        
        # Write file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Select reorganized to new 4-tab structure!")
        print("  - ✅ Variants: Combined Overview + Variants content")
        print("  - ✅ Examples: Real estate use cases")
        print("  - ✅ Implementation: Renamed from API")
        print("  - ✅ Accessibility: WCAG compliance")
        print("  - ✅ Icon Library: Removed (will be separate page)")
        
    except Exception as e:
        print(f"❌ Error reorganizing: {str(e)}")

if __name__ == "__main__":
    reorganize_select_new_structure()


