#!/usr/bin/env python3
"""
Reorganize Select Component:
- Simplified Overview with only basic lyd-select
- Move specialized components to Variants section
"""

import os
import re

def reorganize_select_sections():
    """Reorganisiere Select-Sektionen für bessere Struktur."""
    file_path = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
    
    print("🔄 Reorganizing Select sections...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Simplified Overview - only basic components
    new_overview = '''        <section class="section">
                <h2 class="section-title">Select System Overview</h2>
                <p class="section-subtitle">Professional dropdown components inspired by HeroUI and Porsche Design System</p>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-select</h3>
                        <p>Standard dropdown with single selection and luxury styling</p>
                        <div class="component-showcase">
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
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-input-search</h3>
                        <p>Search input for filtering and location lookup</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Search Location</label>
                                <div style="position: relative;">
                                    <input type="search" class="luxury-input" placeholder="Search properties..." style="padding-left: 48px;" />
                                    <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #6b7280;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-textarea</h3>
                        <p>Multi-line text area for property descriptions</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Property Description</label>
                                <textarea class="luxury-input" rows="3" placeholder="Property description">Beautiful luxury villa with panoramic views...</textarea>
                            </div>
                        </div>
                    </div>
                </div>
        </section>'''
    
    # 2. Enhanced Variants section with specialized components
    new_variants = '''        <section class="section">
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
                            <p>Asynchronous loading with spinner and pagination</p>
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
        </section>'''
    
    # Apply replacements
    try:
        # Replace Overview section
        overview_pattern = r'<section class="section">\s*<h2 class="section-title">Select System Overview</h2>.*?</section>'
        content = re.sub(overview_pattern, new_overview, content, flags=re.DOTALL)
        
        # Replace Variants section
        variants_pattern = r'<section class="section">\s*<h2 class="section-title">Select Variants & States</h2>.*?</section>'
        content = re.sub(variants_pattern, new_variants, content, flags=re.DOTALL)
        
        # Write file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Select sections reorganized successfully!")
        print("  - ✅ Overview: Simplified with basic components only")
        print("  - ✅ Variants: Added specialized select types (multiple, grouped, async, clearable)")
        print("  - ✅ Better structure and organization")
        
    except Exception as e:
        print(f"❌ Error reorganizing: {str(e)}")

if __name__ == "__main__":
    reorganize_select_sections()


