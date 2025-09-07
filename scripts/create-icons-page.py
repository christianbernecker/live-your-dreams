#!/usr/bin/env python3
"""
Create dedicated Icons page for the design system
Übergreifende Icon Library für alle Components
"""

import os

def create_icons_page():
    """Erstelle eine dedizierte Icons-Seite."""
    
    # Erstelle Icons-Verzeichnis
    icons_dir = '/Users/christianbernecker/live-your-dreams/design-system/icons'
    os.makedirs(icons_dir, exist_ok=True)
    
    # Lade Button-Template als Basis
    button_file = '/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html'
    with open(button_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update Meta Information
    content = content.replace('Button Components - LYD Design System', 'Icon Library - LYD Design System')
    content = content.replace('<h1 class="page-title">Button Components</h1>', '<h1 class="page-title">Icon Library</h1>')
    content = content.replace('<p class="page-subtitle">Interactive elements for user actions with luxury styling, micro-animations, and comprehensive state management.</p>', 
                             '<p class="page-subtitle">Comprehensive icon library for all LYD Design System components with consistent styling and usage guidelines.</p>')
    
    # Update Navigation
    content = content.replace('<a href="/components/buttons/" class="nav-item active">Button</a>', '<a href="/components/buttons/" class="nav-item">Button</a>')
    content = content.replace('<div class="nav-section-title">Components</div>', '''<div class="nav-section-title">Components</div>
                <a href="/icons/" class="nav-item active">Icons</a>''')
    
    # Create new tab structure for Icons
    new_tabs = '''        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="overview">Overview</button>
            <button class="tab" data-tab="categories">Categories</button>
            <button class="tab" data-tab="usage">Usage Guidelines</button>
            <button class="tab" data-tab="implementation">Implementation</button>
        </div>'''
    
    # Create Overview tab
    overview_content = '''        <!-- Tab Content: Overview -->
        <div class="tab-content active" id="overview">
        <section class="section">
                <h2 class="section-title">Icon System Overview</h2>
                <p class="section-subtitle">Comprehensive SVG icon library for all LYD Design System components</p>
                
                <div class="icon-stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">120+</div>
                        <div class="stat-label">Total Icons</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Categories</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">SVG</div>
                        <div class="stat-label">Vector Format</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">20px</div>
                        <div class="stat-label">Standard Size</div>
                    </div>
                </div>
                
                <div class="search-bar">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search icons..."
                        id="icon-search"
                    >
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </div>
                
                <div class="icon-grid" id="all-icons-grid">
                    <!-- All Icons Grid - populated by JavaScript -->
                </div>
        </section>
        </div>'''
    
    # Create Categories tab
    categories_content = '''        <!-- Tab Content: Categories -->
        <div class="tab-content" id="categories">
        <section class="section">
            <h2 class="section-title">Icon Categories</h2>
            
            <div class="category-showcase">
                <div class="category-section">
                    <h3>Real Estate</h3>
                    <div class="icon-grid category-grid">
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
                        <div class="icon-card" onclick="copyToClipboard('location')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <span class="icon-name">location</span>
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
                        <div class="icon-card" onclick="copyToClipboard('euro')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M14.5 8a2.5 2.5 0 00-2.5-2.5h-1A2.5 2.5 0 008.5 8v8a2.5 2.5 0 002.5 2.5h1a2.5 2.5 0 002.5-2.5"/>
                                    <path d="M6 10h6M6 14h6"/>
                                </svg>
                            </div>
                            <span class="icon-name">euro</span>
                        </div>
                    </div>
                </div>
                
                <div class="category-section">
                    <h3>Actions</h3>
                    <div class="icon-grid category-grid">
                        <div class="icon-card" onclick="copyToClipboard('edit')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.5-6.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 8.5-8.5z"/>
                                </svg>
                            </div>
                            <span class="icon-name">edit</span>
                        </div>
                        <div class="icon-card" onclick="copyToClipboard('delete')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </div>
                            <span class="icon-name">delete</span>
                        </div>
                        <div class="icon-card" onclick="copyToClipboard('share')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                </svg>
                            </div>
                            <span class="icon-name">share</span>
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
                        <div class="icon-card" onclick="copyToClipboard('plus')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M12 4v16m8-8H4"/>
                                </svg>
                            </div>
                            <span class="icon-name">plus</span>
                        </div>
                    </div>
                </div>
                
                <div class="category-section">
                    <h3>Communication</h3>
                    <div class="icon-grid category-grid">
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
                        <div class="icon-card" onclick="copyToClipboard('calendar')">
                            <div class="icon-display">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <span class="icon-name">calendar</span>
                        </div>
                    </div>
                </div>
                
                <div class="category-section">
                    <h3>Interface</h3>
                    <div class="icon-grid category-grid">
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
                    </div>
                </div>
                
                <div class="category-section">
                    <h3>Favorites</h3>
                    <div class="icon-grid category-grid">
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
                    </div>
                </div>
            </div>
        </section>
        </div>'''
    
    # Create Usage Guidelines tab
    usage_content = '''        <!-- Tab Content: Usage Guidelines -->
        <div class="tab-content" id="usage">
        <section class="section">
            <h2 class="section-title">Icon Usage Guidelines</h2>
            
            <div class="guidelines-grid">
                <div class="guideline-card">
                    <h3>Icon Sizes</h3>
                    <div class="size-examples">
                        <div class="size-example">
                            <svg class="icon-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>16px - Small</span>
                        </div>
                        <div class="size-example">
                            <svg class="icon-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>20px - Standard</span>
                        </div>
                        <div class="size-example">
                            <svg class="icon-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>24px - Large</span>
                        </div>
                    </div>
                </div>
                
                <div class="guideline-card">
                    <h3>Color Usage</h3>
                    <div class="color-examples">
                        <div class="color-example">
                            <svg style="color: #1f2937;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>Default - #1f2937</span>
                        </div>
                        <div class="color-example">
                            <svg style="color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>Primary - #3b82f6</span>
                        </div>
                        <div class="color-example">
                            <svg style="color: #10b981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>Success - #10b981</span>
                        </div>
                        <div class="color-example">
                            <svg style="color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>Error - #ef4444</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>'''
    
    # Create Implementation tab
    implementation_content = '''        <!-- Tab Content: Implementation -->
        <div class="tab-content" id="implementation">
        <section class="section">
            <h2 class="section-title">Icon Implementation</h2>
            
            <div class="implementation-examples">
                <div class="example-card">
                    <h3>HTML Usage</h3>
                    <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto;"><code>&lt;!-- Direct SVG usage --&gt;
&lt;svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"&gt;
  &lt;path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/&gt;
&lt;/svg&gt;

&lt;!-- With LYD components --&gt;
&lt;lyd-button icon="home"&gt;View Property&lt;/lyd-button&gt;
&lt;lyd-input icon="search" placeholder="Search..."&gt;&lt;/lyd-input&gt;</code></pre>
                </div>
                
                <div class="example-card">
                    <h3>React/Next.js Usage</h3>
                    <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto;"><code>// components/Icon.tsx
import { LYD_ICONS } from '@/lib/lyd-icons';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC&lt;IconProps&gt; = ({ 
  name, 
  size = 20, 
  className = '',
  color = 'currentColor' 
}) => {
  const iconSvg = LYD_ICONS[name];
  
  if (!iconSvg) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    &lt;span 
      className={`inline-flex ${className}`}
      style={{ width: size, height: size, color }}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    /&gt;
  );
};

// Usage in components
&lt;Icon name="home" size={20} /&gt;
&lt;Icon name="building" size={24} className="text-blue-500" /&gt;</code></pre>
                </div>
                
                <div class="example-card">
                    <h3>CSS Classes</h3>
                    <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto;"><code>/* Icon sizing classes */
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }

/* Icon color classes */
.icon-default { color: #1f2937; }
.icon-primary { color: #3b82f6; }
.icon-success { color: #10b981; }
.icon-error { color: #ef4444; }
.icon-muted { color: #6b7280; }</code></pre>
                </div>
            </div>
        </section>
        </div>'''
    
    # Replace all content sections
    import re
    
    # Replace tab navigation
    tab_pattern = r'<!-- Tab Navigation -->\s*<div class="tabs">.*?</div>'
    content = re.sub(tab_pattern, new_tabs, content, flags=re.DOTALL)
    
    # Replace all tab content
    all_tabs_pattern = r'<!-- Tab Content: Overview -->.*?</main>'
    new_all_content = f'''{overview_content}
        
        {categories_content}
        
        {usage_content}
        
        {implementation_content}
        
    </main>'''
    
    content = re.sub(all_tabs_pattern, new_all_content, content, flags=re.DOTALL)
    
    # Add icon-specific CSS
    icon_css = '''
        /* Icon Page Specific Styles */
        .icon-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            border: 1px solid #e5e7eb;
            transition: all 0.2s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 500;
        }
        
        .category-showcase {
            display: flex;
            flex-direction: column;
            gap: 48px;
        }
        
        .category-section {
            background: white;
            border-radius: 16px;
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        
        .category-section h3 {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .category-section h3::before {
            content: '';
            width: 4px;
            height: 24px;
            background: linear-gradient(135deg, #0066ff, #3366CC);
            border-radius: 2px;
        }
        
        .category-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            max-width: none;
        }
        
        .guidelines-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 24px;
        }
        
        .guideline-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .guideline-card h3 {
            margin: 0 0 20px 0;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .size-examples, .color-examples {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .size-example, .color-example {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
        }
        
        .icon-16 { width: 16px; height: 16px; }
        .icon-20 { width: 20px; height: 20px; }
        .icon-24 { width: 24px; height: 24px; }
        
        .implementation-examples {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        
        .search-bar {
            position: relative;
            margin-bottom: 32px;
        }
        
        .search-input {
            width: 100%;
            padding: 16px 20px 16px 52px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            background: white;
            transition: all 0.2s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #6b7280;
        }
'''
    
    # Add CSS
    content = content.replace('        \n    </style>', f'{icon_css}        \n    </style>')
    
    # Write Icons page
    icons_file = f'{icons_dir}/index.html'
    with open(icons_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Dedicated Icons page created!")
    print(f"  - 📁 Location: {icons_file}")
    print("  - ✅ 4-tab structure: Overview, Categories, Usage, Implementation")
    print("  - ✅ Comprehensive icon library")
    print("  - ✅ Usage guidelines and examples")

def main():
    create_icons_page()
    print("\n🎯 Next step: Update navigation to include Icons page")

if __name__ == "__main__":
    main()


