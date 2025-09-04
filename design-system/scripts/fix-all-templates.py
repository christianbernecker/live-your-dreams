#!/usr/bin/env python3
"""
LYD Design System - Fix All Templates
Behebt Logo und Navigation auf ALLEN Seiten
"""

import os
import re
from pathlib import Path

# Korrektes Logo SVG (von patterns/introduction)
CORRECT_LOGO_SVG = '''<svg class="sidebar-logo" viewBox="0 0 990 800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#000066;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#3366CC;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="textGradient" x1="0" y1="360" x2="0" y2="700" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" style="stop-color:#3366CC;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#000066;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <g transform="translate(0,748) scale(0.1,-0.1)" fill="url(#crescentGradient)">
                    <path d="M3049 5306 c-8 -7 -66 -45 -131 -84 -386 -239 -848 -602 -1168 -922 -612 -610 -818 -1104 -650 -1558 46 -122 119 -239 257 -408 43 -53 118 -148 166 -212 294 -387 385 -708 302 -1067 -68 -294 -287 -641 -619 -983 -51 -52 -65 -72 -52 -72 34 0 328 159 471 255 371 248 627 534 751 839 54 131 92 298 106 456 15 181 2 423 -54 965 -39 382 -42 431 -42 715 -1 310 3 369 45 610 82 474 274 935 576 1379 61 90 73 116 42 87z"/>
                </g>
                <g fill="url(#textGradient)">
                    <text x="370" y="420" font-family="system-ui, -apple-system, sans-serif" font-size="132" font-weight="400" letter-spacing="6px">LIVE</text>
                    <text x="370" y="540" font-family="system-ui, -apple-system, sans-serif" font-size="132" font-weight="400" letter-spacing="22px">YOUR</text>
                    <text x="370" y="660" font-family="system-ui, -apple-system, sans-serif" font-size="132" font-weight="400" letter-spacing="6px">DREAMS</text>
                </g>
            </svg>'''

# Korrekte Navigation Struktur
CORRECT_NAVIGATION = '''            <div class="nav-section">
                <div class="nav-section-title">Designing</div>
                <a href="/designing/introduction/" class="nav-item">Introduction</a>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Developing</div>
                <a href="/developing/introduction/" class="nav-item">Introduction</a>
                <a href="/developing/nextjs-integration/" class="nav-item">Next.js Integration</a>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Components</div>
                <a href="/components/introduction/" class="nav-item">Introduction</a>
                <a href="/components/buttons/" class="nav-item">Button</a>
                <a href="/components/buttons-enhanced/" class="nav-item">Enhanced Buttons</a>
                <a href="/components/inputs/" class="nav-item">Input</a>
                <a href="/components/cards/" class="nav-item">Card</a>
                <a href="/components/select/" class="nav-item">Select</a>
                <a href="/components/accordion/" class="nav-item">Accordion</a>
                <a href="/components/modal/" class="nav-item">Modal</a>
                <a href="/components/dropdown/" class="nav-item">Dropdown</a>
                <a href="/components/checkbox/" class="nav-item">Checkbox</a>
                <a href="/components/radio/" class="nav-item">Radio</a>
                <a href="/components/toast/" class="nav-item">Toast</a>
                <a href="/components/table/" class="nav-item">Table</a>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Styles</div>
                <a href="/styles/introduction/" class="nav-item">Introduction</a>
                <a href="/styles/grid/" class="nav-item">Grid</a>
                <a href="/styles/typography/" class="nav-item">Typography</a>
                <a href="/styles/colors/" class="nav-item">Colors</a>
                <a href="/styles/spacing/" class="nav-item">Spacing</a>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Patterns</div>
                <a href="/patterns/introduction/" class="nav-item">Introduction</a>
                <a href="/patterns/property-cards/" class="nav-item">Property Cards</a>
                <a href="/patterns/header/" class="nav-item">Header</a>
                <a href="/patterns/footer/" class="nav-item">Footer</a>
                <a href="/patterns/forms/" class="nav-item">Forms</a>
                <a href="/patterns/lead-management/" class="nav-item">Lead Management</a>
            </div>'''

def fix_html_file(file_path):
    """Behebt Logo und Navigation in einer HTML-Datei"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Backup erstellen
        backup_path = file_path.with_suffix('.html.backup-fix')
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Logo ersetzen (alle möglichen Logo-Varianten)
        logo_patterns = [
            r'<svg class="lyd-logo"[^>]*>.*?</svg>',
            r'<svg class="sidebar-logo"[^>]*>.*?</svg>',
            r'<svg[^>]*viewBox="0 0 200 60"[^>]*>.*?</svg>'
        ]
        
        for pattern in logo_patterns:
            content = re.sub(pattern, CORRECT_LOGO_SVG, content, flags=re.DOTALL)
        
        # Navigation ersetzen
        nav_patterns = [
            r'<div class="lyd-nav-section">.*?</div>\s*</nav>',
            r'<div class="nav-section">.*?</div>\s*</nav>',
            r'<div class="lyd-nav-section-title">Getting Started</div>.*?</div>\s*</nav>'
        ]
        
        for pattern in nav_patterns:
            content = re.sub(pattern, CORRECT_NAVIGATION + '\n        </div>\n    </nav>', content, flags=re.DOTALL)
        
        # CSS-Klassen vereinheitlichen
        content = content.replace('lyd-sidebar', 'sidebar')
        content = content.replace('lyd-sidebar-header', 'sidebar-header')
        content = content.replace('lyd-nav-section', 'nav-section')
        content = content.replace('lyd-nav-item', 'nav-item')
        content = content.replace('lyd-main-content', 'main-content')
        content = content.replace('lyd-page-header', 'page-header')
        content = content.replace('lyd-page-title', 'page-title')
        content = content.replace('lyd-page-subtitle', 'page-subtitle')
        content = content.replace('lyd-section', 'section')
        content = content.replace('lyd-section-title', 'section-title')
        content = content.replace('lyd-component-grid', 'component-grid')
        content = content.replace('lyd-component-card', 'component-card')
        content = content.replace('lyd-component-showcase', 'component-showcase')
        
        # Aktualisierte Datei schreiben
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
        
    except Exception as e:
        print(f"Fehler bei {file_path}: {e}")
        return False

def main():
    """Behebt alle HTML-Dateien"""
    design_system_root = Path(__file__).parent.parent
    
    # Alle HTML-Dateien finden
    html_files = list(design_system_root.rglob('*.html'))
    html_files = [f for f in html_files if 'node_modules' not in str(f) and 'backup' not in str(f)]
    
    print(f"Gefunden: {len(html_files)} HTML-Dateien")
    
    success_count = 0
    for html_file in html_files:
        print(f"Bearbeite: {html_file.relative_to(design_system_root)}")
        if fix_html_file(html_file):
            success_count += 1
            print("✅ Erfolgreich")
        else:
            print("❌ Fehler")
    
    print(f"\n🎉 {success_count}/{len(html_files)} Dateien erfolgreich bearbeitet")

if __name__ == "__main__":
    main()
