#!/usr/bin/env python3
"""
Entfernt die Component-Typography aus der Navigation aller HTML-Dateien
"""

import os
import re

def remove_typography_from_navigation(file_path):
    """Entfernt Typography-Link aus der Navigation einer HTML-Datei"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Typography-Link aus Navigation entfernen
        # Suche nach dem Typography-Link in der Components-Navigation
        pattern = r'<a href="/components/typography/" class="nav-item"[^>]*>Typography</a>\s*'
        
        if re.search(pattern, content):
            content = re.sub(pattern, '', content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Typography-Link entfernt: {file_path}")
            return True
        else:
            print(f"⚪ Kein Typography-Link gefunden: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Fehler bei {file_path}: {e}")
        return False

def main():
    """Hauptfunktion"""
    base_dir = "/Users/christianbernecker/live-your-dreams/design-system/v2"
    
    # Alle HTML-Dateien finden
    html_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html') and not file.endswith('.backup'):
                html_files.append(os.path.join(root, file))
    
    print(f"🔍 Gefunden: {len(html_files)} HTML-Dateien")
    print("-" * 60)
    
    updated = 0
    for file_path in html_files:
        if remove_typography_from_navigation(file_path):
            updated += 1
    
    print("-" * 60)
    print(f"📊 ZUSAMMENFASSUNG:")
    print(f"   ✅ Aktualisiert: {updated}")
    print(f"   📁 Gesamt: {len(html_files)}")

if __name__ == "__main__":
    main()
