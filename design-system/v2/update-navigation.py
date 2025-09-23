#!/usr/bin/env python3
"""
Robustes Skript zur Aktualisierung der Navigation auf allen Seiten.
Erhält den Content und ersetzt nur die Navigation.
"""

import os
import re
from pathlib import Path

def get_navigation_template():
    """Liest das Navigation-Template"""
    with open('shared/navigation-template.html', 'r', encoding='utf-8') as f:
        return f.read()

def update_navigation_in_file(filepath, nav_template):
    """Aktualisiert die Navigation in einer HTML-Datei"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Finde die aktuelle Seite aus dem Pfad
        path_parts = str(filepath).split('/')
        current_section = None
        current_page = None
        
        if 'design-principles' in path_parts:
            current_section = 'design-principles'
            if len(path_parts) > 2:
                current_page = path_parts[-2]  # z.B. 'overview', 'colors', etc.
        elif 'implementation' in path_parts:
            current_section = 'implementation'
            if len(path_parts) > 2:
                current_page = path_parts[-2]
        elif 'components' in path_parts:
            current_section = 'components'
            if len(path_parts) > 2:
                current_page = path_parts[-2]
        
        # Kopiere das Template
        new_nav = nav_template
        
        # Setze die aktive Klasse für die aktuelle Seite
        if current_page:
            # Entferne alle aktiven Klassen
            new_nav = new_nav.replace(' active', '')
            
            # Füge aktive Klasse für die aktuelle Seite hinzu
            if current_section == 'design-principles':
                pattern = f'href="/design-principles/{current_page}/" class="nav-item"'
                replacement = f'href="/design-principles/{current_page}/" class="nav-item active"'
            elif current_section == 'implementation':
                pattern = f'href="/implementation/{current_page}/" class="nav-item"'
                replacement = f'href="/implementation/{current_page}/" class="nav-item active"'
            elif current_section == 'components':
                # Spezialbehandlung für components
                if current_page == 'date-picker':
                    pattern = f'href="/components/date-picker/" class="nav-item"'
                elif current_page == 'datepicker':
                    pattern = f'href="/components/date-picker/" class="nav-item"'
                else:
                    pattern = f'href="/components/{current_page}/" class="nav-item"'
                replacement = pattern.replace('class="nav-item"', 'class="nav-item active"')
            
            if pattern in new_nav:
                new_nav = new_nav.replace(pattern, replacement)
        
        # Homepage-Spezialfall
        if 'index.html' in str(filepath) and str(filepath).count('/') == 1:
            new_nav = new_nav.replace(' active', '')  # Keine aktive Seite auf Homepage
        
        # Ersetze die Navigation im Content
        # Pattern: Alles zwischen <nav> und </nav>
        nav_pattern = r'<nav>.*?</nav>'
        
        # Prüfe ob Navigation existiert
        if re.search(nav_pattern, content, re.DOTALL):
            new_content = re.sub(nav_pattern, new_nav.strip(), content, flags=re.DOTALL)
            
            # Speichere die aktualisierte Datei
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return True, current_page
        else:
            return False, f"Keine Navigation gefunden in {filepath}"
    
    except Exception as e:
        return False, str(e)

def main():
    """Hauptfunktion"""
    print("=== NAVIGATION UPDATE SCRIPT ===\n")
    
    # Basis-Verzeichnis
    base_dir = Path('.')
    
    # Lade Navigation-Template
    nav_template = get_navigation_template()
    print(f"✅ Navigation-Template geladen ({nav_template.count('nav-item')} Links)\n")
    
    # Finde alle HTML-Dateien
    html_files = []
    
    # Hauptseite
    if (base_dir / 'index.html').exists():
        html_files.append(base_dir / 'index.html')
    
    # Alle Unterseiten
    for section in ['design-principles', 'implementation', 'components']:
        section_path = base_dir / section
        if section_path.exists():
            for subdir in section_path.iterdir():
                if subdir.is_dir():
                    index_file = subdir / 'index.html'
                    if index_file.exists():
                        html_files.append(index_file)
    
    print(f"📁 {len(html_files)} HTML-Dateien gefunden\n")
    
    # Aktualisiere alle Dateien
    success_count = 0
    error_count = 0
    
    for filepath in sorted(html_files):
        relative_path = filepath.relative_to(base_dir)
        success, info = update_navigation_in_file(filepath, nav_template)
        
        if success:
            print(f"✅ {relative_path} - Aktive Seite: {info if info else 'Homepage'}")
            success_count += 1
        else:
            print(f"❌ {relative_path} - Fehler: {info}")
            error_count += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Erfolgreich: {success_count} Dateien")
    print(f"❌ Fehler: {error_count} Dateien")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
