#!/usr/bin/env python3
"""
Fix Select Component with HeroUI-inspired systematic approach
"""

import os
import re

def fix_select_component():
    """Korrigiere Select-Komponente systematisch."""
    file_path = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
    
    print("🔧 Fixing Select Component with HeroUI standards...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Fix API section - replace lyd-button with lyd-select
    api_section = '''        <section class="section api-section">
                <h2 class="section-title">Select API Reference</h2>
            
                <h3>lyd-select</h3>
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
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Allow multiple selections</td>
                    </tr>
                    <tr>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">isDisabled</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Disable select interaction</td>
                    </tr>
                </tbody>
            </table>
            </div>
                
                <h3>Next.js Backoffice Integration</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// app/properties/create/page.tsx
'use client';

import { useForm } from 'react-hook-form';

export default function CreatePropertyPage() {
  const { register, watch, setValue } = useForm();
  
  const selectedType = watch('propertyType');

  return (
    &lt;form className="space-y-6"&gt;
      &lt;lyd-select
        label="Property Type"
        placeholder="Select property type"
        isRequired
        {...register('propertyType')}
      &gt;
        &lt;option value="apartment"&gt;Apartment&lt;/option&gt;
        &lt;option value="house"&gt;House&lt;/option&gt;
        &lt;option value="villa"&gt;Villa&lt;/option&gt;
        &lt;option value="commercial"&gt;Commercial&lt;/option&gt;
      &lt;/lyd-select&gt;
      
      &lt;lyd-select
        label="Location"
        placeholder="Search location..."
        isSearchable
        {...register('location')}
      &gt;
        &lt;option value="munich"&gt;Munich&lt;/option&gt;
        &lt;option value="berlin"&gt;Berlin&lt;/option&gt;
        &lt;option value="hamburg"&gt;Hamburg&lt;/option&gt;
      &lt;/lyd-select&gt;
      
      &lt;lyd-select
        label="Amenities"
        placeholder="Select amenities"
        isMultiple
        {...register('amenities')}
      &gt;
        &lt;option value="pool"&gt;Swimming Pool&lt;/option&gt;
        &lt;option value="garden"&gt;Garden&lt;/option&gt;
        &lt;option value="garage"&gt;Garage&lt;/option&gt;
        &lt;option value="balcony"&gt;Balcony&lt;/option&gt;
      &lt;/lyd-select&gt;
    &lt;/form&gt;
  );
}</code></pre>
                
                <h3>Select Component Props</h3>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4>Alle verfügbaren Select-Features:</h4>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li><strong>Single Selection</strong> - Standard Dropdown</li>
                        <li><strong>Multi Selection</strong> - Mehrfachauswahl mit Checkboxes</li>
                        <li><strong>Searchable</strong> - Durchsuchbare Optionen</li>
                        <li><strong>Grouped</strong> - Kategorisierte Optionen</li>
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
        errorMessage?: string;
        description?: string;
        onChange?: (event: CustomEvent) => void;
        children?: React.ReactNode;
      };
    }
  }
}

export {};</code></pre>
        </section>'''
    
    # 2. Fix Icon Library - smaller icons
    icon_section = '''            <section class="section">
            <h2 class="section-title">Select Icons</h2>
            <p class="section-subtitle">Icons for dropdown arrows, search, and selection states</p>
            
            <div class="icon-grid">
                <div class="icon-card" onclick="copyToClipboard('chevron-down')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                    <span class="icon-name">chevron-down</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('search')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
                    <span class="icon-name">search</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('check')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg></div>
                    <span class="icon-name">check</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('x')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
                    <span class="icon-name">x</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('filter')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg></div>
                    <span class="icon-name">filter</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('location')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                    <span class="icon-name">location</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('home')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg></div>
                    <span class="icon-name">home</span>
                </div>
                
                <div class="icon-card" onclick="copyToClipboard('building')">
                    <div class="icon-display" style="width: 24px; height: 24px; color: #374151;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></div>
                    <span class="icon-name">building</span>
                </div>
            </div>
        </section>'''
    
    # 3. Add proper CSS for icon sizing
    icon_css = '''
        /* Select-specific icon styling */
        .icon-grid .icon-card .icon-display {
            width: 32px !important;
            height: 32px !important;
            color: #374151;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon-grid .icon-card .icon-display svg {
            width: 20px;
            height: 20px;
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
        
        .icon-name {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            font-weight: 500;
        }
        
        /* Enhanced Select Variants */
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
'''
    
    # Apply replacements
    replacements = [
        # Fix API section
        (r'<section class="section api-section">\s*<h2 class="section-title">API Reference</h2>.*?</section>', api_section),
        # Fix icon library section
        (r'<section class="section">\s*<h2 class="section-title">Select Icons</h2>.*?</section>', icon_section)
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Add CSS improvements
    content = content.replace('        \n    </style>', f'{icon_css}        \n    </style>')
    
    # Write file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Select component fixed with proper icon sizing and Select API!")

if __name__ == "__main__":
    fix_select_component()


