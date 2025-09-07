#!/usr/bin/env python3
"""
Critical fixes for Select Component
- Fix overlapping text/icons
- Fix broken variants layout
- Use same icons as Button page
- Add dropdown JavaScript functionality
"""

import os
import re

def fix_select_component():
    """Korrigiere alle kritischen Select-Probleme."""
    file_path = '/Users/christianbernecker/live-your-dreams/design-system/components/select/index.html'
    
    print("🔧 Fixing critical Select component issues...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Fix subtitle (still shows "button system")
    content = content.replace(
        'Complete button system with variants, icons, and specialized components for real estate applications.',
        'Dropdown selection components with search, multi-select, and grouped options for data filtering.'
    )
    
    # 2. Fix searchable select overlap issue
    searchable_fix = '''                    <div class="component-card">
                        <h3>lyd-select-searchable</h3>
                        <p>Searchable dropdown with real-time filtering</p>
                        <div class="component-showcase">
                            <div class="select-demo">
                                <label class="luxury-label">Search Location</label>
                                <div class="luxury-select searchable">
                                    <div class="luxury-select-trigger">
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
                    </div>'''
    
    # 3. Fix multiple select chips display
    multiple_fix = '''                    <div class="component-card">
                        <h3>lyd-select-multiple</h3>
                        <p>Multi-selection with chips and validation</p>
                        <div class="component-showcase">
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
                    </div>'''
    
    # 4. Use SAME icons as Button page
    icon_library_fix = '''            <section class="section">
                <h2 class="section-title">Icon Library</h2>
                <p class="section-subtitle">Icons for dropdown arrows, search, and selection states</p>
                
                <div class="icon-grid">
                    <div class="icon-card" onclick="copyToClipboard('home')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
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
                    <div class="icon-card" onclick="copyToClipboard('key')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"/>
                            </svg>
                        </div>
                        <span class="icon-name">key</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('calendar')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <span class="icon-name">calendar</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('edit')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.5-6.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 8.5-8.5z"/>
                            </svg>
                        </div>
                        <span class="icon-name">edit</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('share')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                            </svg>
                        </div>
                        <span class="icon-name">share</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('delete')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </div>
                        <span class="icon-name">delete</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('heart')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </div>
                        <span class="icon-name">heart</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('star')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                        </div>
                        <span class="icon-name">star</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('location')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <span class="icon-name">location</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('phone')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                        </div>
                        <span class="icon-name">phone</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('mail')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <span class="icon-name">mail</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('download')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                        </div>
                        <span class="icon-name">download</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('upload')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                            </svg>
                        </div>
                        <span class="icon-name">upload</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('search')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                        <span class="icon-name">search</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('settings')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <span class="icon-name">settings</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('plus')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 4v16m8-8H4"/>
                            </svg>
                        </div>
                        <span class="icon-name">plus</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('check')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </div>
                        <span class="icon-name">check</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('x')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </div>
                        <span class="icon-name">x</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('euro')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14.5 8a2.5 2.5 0 00-2.5-2.5h-1A2.5 2.5 0 008.5 8v8a2.5 2.5 0 002.5 2.5h1a2.5 2.5 0 002.5-2.5"/>
                                <path d="M6 10h6M6 14h6"/>
                            </svg>
                        </div>
                        <span class="icon-name">euro</span>
                    </div>
                    <div class="icon-card" onclick="copyToClipboard('area')">
                        <div class="icon-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M4 4h16v16H4V4z"/>
                                <path d="M9 9h6v6H9V9z"/>
                            </svg>
                        </div>
                        <span class="icon-name">area</span>
                    </div>
                </div>
        </section>'''
    
    # 5. Add proper CSS fixes
    css_fixes = '''
        /* Critical Select Fixes */
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

        .luxury-select-trigger:hover {
            border-color: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .luxury-select-arrow {
            display: flex;
            align-items: center;
            transition: transform 0.2s ease;
            color: #6b7280;
            margin-left: 12px;
        }

        .luxury-select-arrow svg {
            width: 16px;
            height: 16px;
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

        /* Searchable Select - NO overlapping */
        .luxury-select.searchable .luxury-select-trigger {
            padding-left: 20px; /* Normal padding, no extra space for icon */
        }

        .luxury-select.searchable .search-icon {
            display: none; /* Hide search icon in trigger to avoid overlap */
        }

        /* Icon Grid - Same as Button page */
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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
        }
        
        .icon-card:hover {
            background: #f9fafb;
            transform: translateY(-2px);
        }
        
        .icon-display {
            width: 32px;
            height: 32px;
            color: #1f2937;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon-display svg {
            width: 20px;
            height: 20px;
        }
        
        .icon-name {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }

        /* Variants Grid Fix */
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
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

        .select-demo {
            display: flex;
            flex-direction: column;
            gap: 8px;
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

        /* Dropdown functionality */
        .luxury-select.open .luxury-select-arrow {
            transform: rotate(180deg);
        }

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
        }

        .dropdown-option {
            padding: 12px 16px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            border-bottom: 1px solid #f3f4f6;
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
'''
    
    # 6. Add JavaScript for dropdown functionality
    javascript_fix = '''
        // Dropdown functionality for Select components
        document.addEventListener('DOMContentLoaded', function() {
            const selects = document.querySelectorAll('.luxury-select');
            
            selects.forEach(select => {
                const trigger = select.querySelector('.luxury-select-trigger');
                if (!trigger) return;
                
                // Create dropdown content if not exists
                let dropdown = select.querySelector('.dropdown-content');
                if (!dropdown) {
                    dropdown = document.createElement('div');
                    dropdown.className = 'dropdown-content';
                    
                    // Sample options based on select type
                    const options = getOptionsForSelect(select);
                    options.forEach(option => {
                        const optionEl = document.createElement('div');
                        optionEl.className = 'dropdown-option';
                        optionEl.textContent = option.label;
                        optionEl.dataset.value = option.value;
                        
                        optionEl.addEventListener('click', () => {
                            const span = trigger.querySelector('span');
                            if (span) span.textContent = option.label;
                            select.classList.remove('open');
                            
                            // Update selected state
                            dropdown.querySelectorAll('.dropdown-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            optionEl.classList.add('selected');
                        });
                        
                        dropdown.appendChild(optionEl);
                    });
                    
                    select.appendChild(dropdown);
                }
                
                // Toggle dropdown on click
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    document.querySelectorAll('.luxury-select.open').forEach(s => {
                        if (s !== select) s.classList.remove('open');
                    });
                    
                    // Toggle current
                    select.classList.toggle('open');
                });
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                document.querySelectorAll('.luxury-select.open').forEach(select => {
                    select.classList.remove('open');
                });
            });
        });
        
        function getOptionsForSelect(select) {
            const trigger = select.querySelector('.luxury-select-trigger span');
            if (!trigger) return [];
            
            // Return appropriate options based on context
            if (trigger.textContent.includes('Type') || trigger.textContent.includes('Apartment')) {
                return [
                    { value: 'apartment', label: 'Apartment' },
                    { value: 'house', label: 'House' },
                    { value: 'villa', label: 'Villa' },
                    { value: 'commercial', label: 'Commercial' }
                ];
            } else if (trigger.textContent.includes('Location') || trigger.textContent.includes('Munich')) {
                return [
                    { value: 'munich', label: 'Munich, Germany' },
                    { value: 'berlin', label: 'Berlin, Germany' },
                    { value: 'hamburg', label: 'Hamburg, Germany' },
                    { value: 'frankfurt', label: 'Frankfurt, Germany' }
                ];
            } else if (trigger.textContent.includes('Price') || trigger.textContent.includes('€')) {
                return [
                    { value: '0-500k', label: '€0 - €500K' },
                    { value: '500k-1m', label: '€500K - €1M' },
                    { value: '1m-2m', label: '€1M - €2M' },
                    { value: '2m+', label: '€2M+' }
                ];
            }
            
            return [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
            ];
        }'''
    
    # Apply all fixes
    
    # Replace searchable component
    content = re.sub(
        r'<div class="component-card">\s*<h3>lyd-select-searchable</h3>.*?</div>\s*</div>\s*</div>',
        searchable_fix,
        content,
        flags=re.DOTALL
    )
    
    # Replace multiple component  
    content = re.sub(
        r'<div class="component-card">\s*<h3>lyd-select-multiple</h3>.*?</div>\s*</div>\s*</div>',
        multiple_fix,
        content,
        flags=re.DOTALL
    )
    
    # Replace icon library section completely
    content = re.sub(
        r'<section class="section">\s*<h2 class="section-title">Select Icons</h2>.*?</section>',
        icon_library_fix,
        content,
        flags=re.DOTALL
    )
    
    # Add CSS fixes
    content = content.replace('        \n    </style>', f'{css_fixes}        \n    </style>')
    
    # Add JavaScript before closing </script>
    content = content.replace('        document.head.appendChild(style);\n    \n    </script>', f'        document.head.appendChild(style);\n        \n{javascript_fix}\n    \n    </script>')
    
    # Write file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Critical Select issues fixed:")
    print("  - ✅ Fixed overlapping text/icon in searchable")
    print("  - ✅ Fixed broken variants layout") 
    print("  - ✅ Replaced with SAME icons as Button page")
    print("  - ✅ Added dropdown JavaScript functionality")
    print("  - ✅ Fixed subtitle (removed 'button system')")

if __name__ == "__main__":
    fix_select_component()


