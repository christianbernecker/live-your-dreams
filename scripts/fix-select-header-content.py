#!/usr/bin/env python3
"""
Kritischer Fix für Select-Komponente
- Header/Subtitle komplett falsch
- Content immer noch Button-bezogen
- Komplette Bereinigung erforderlich
"""

import os
import re

def fix_select_critical_issues():
    """Behebt die kritischen Probleme der Select-Seite."""
    
    print("🚨 KRITISCHER FIX: Select-Komponente Header und Content")
    
    select_file = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
    
    with open(select_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. KRITISCH: Falscher Header-Text
    content = content.replace(
        'Complete button system with variants, icons, and specialized components for real estate applications.',
        'Dropdown selection components with search, multi-select, and grouped options for data filtering.'
    )
    
    # 2. KRITISCH: Meta-Titel
    content = content.replace(
        'Select Components - LYD Design System',
        'Select Components - LYD Design System'  # Korrekt
    )
    
    # 3. Alle Button-Referenzen entfernen
    button_references = [
        'Complete button system',
        'button variants',
        'Button Components',
        'Interactive elements for user actions',
        'luxury styling, micro-animations'
    ]
    
    for ref in button_references:
        content = content.replace(ref, '')
    
    # 4. Korrekte Select-Beschreibung im Header
    header_pattern = r'<p class="page-subtitle">.*?</p>'
    correct_subtitle = '<p class="page-subtitle">Dropdown selection components with search, multi-select, and grouped options for data filtering.</p>'
    content = re.sub(header_pattern, correct_subtitle, content, flags=re.DOTALL)
    
    # 5. H1 Title korrekt setzen
    content = re.sub(
        r'<h1 class="page-title">.*?</h1>',
        '<h1 class="page-title">Select Components</h1>',
        content,
        flags=re.DOTALL
    )
    
    # 6. Entferne alle Button-spezifischen Inhalte im Variants Tab
    # Ersetze mit korrektem Select-Content
    variants_section = '''        <!-- Tab Content: Variants -->
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
    
    # 7. Ersetze den gesamten Variants Tab Content
    variants_pattern = r'<!-- Tab Content: Variants -->.*?</div>\s*<!-- Tab Content: Examples -->'
    content = re.sub(variants_pattern, variants_section + '\n        \n        <!-- Tab Content: Examples -->', content, flags=re.DOTALL)
    
    # 8. Schreibe korrigierte Datei
    with open(select_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ KRITISCHE FIXES angewendet:")
    print("  - Header-Text korrigiert")
    print("  - Subtitle korrigiert") 
    print("  - Button-Referenzen entfernt")
    print("  - Variants Tab komplett neu")

def main():
    """Hauptfunktion für kritische Select-Fixes."""
    try:
        fix_select_critical_issues()
        print("\n🎯 Kritische Select-Fixes abgeschlossen!")
        
    except Exception as e:
        print(f"❌ Fehler: {str(e)}")

if __name__ == "__main__":
    main()


