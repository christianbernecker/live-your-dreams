#!/usr/bin/env python3
"""
LYD Design System V2 - Component Generator
Erstellt alle Komponenten-Seiten mit konsistenter Struktur
"""

import os
from pathlib import Path

# Komponenten-Definitionen
COMPONENTS = {
    'buttons': 'Button',
    'inputs': 'Input',
    'cards': 'Card',
    'select': 'Select',
    'accordion': 'Accordion',
    'modal': 'Modal',
    'dropdown': 'Dropdown',
    'checkbox': 'Checkbox',
    'radio': 'Radio',
    'toast': 'Toast',
    'table': 'Table',
    'typography': 'Typography'
}

# Andere Seiten
OTHER_PAGES = {
    'designing': 'Designing',
    'developing': 'Developing',
    'developing/nextjs': 'Next.js Integration',
    'styles': 'Styles',
    'styles/grid': 'Grid',
    'styles/typography': 'Typography', 
    'styles/colors': 'Colors',
    'styles/spacing': 'Spacing',
    'patterns': 'Patterns',
    'patterns/property-cards': 'Property Cards',
    'patterns/header': 'Header',
    'patterns/footer': 'Footer',
    'patterns/forms': 'Forms',
    'patterns/lead-management': 'Lead Management'
}

def load_template():
    """Lädt das Master-Template"""
    template_path = Path("/Users/christianbernecker/live-your-dreams/scripts/design-system-refactor/v2-component-template.html")
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def generate_component_page(component_key, component_name, template):
    """Generiert eine Komponenten-Seite"""
    
    # Setze Active-States für Navigation
    active_states = {f"{comp.upper().replace('-', '_')}_ACTIVE": "" for comp in COMPONENTS.keys()}
    active_states[f"{component_key.upper().replace('-', '_')}_ACTIVE"] = "active"
    
    # Template-Variablen ersetzen
    content = template.replace('{{COMPONENT_NAME}}', component_name)
    
    # Navigation Active-States setzen
    for key, value in active_states.items():
        content = content.replace('{{' + key + '}}', value)
    
    return content

def create_directory_structure():
    """Erstellt die V2-Verzeichnisstruktur"""
    base_path = Path("/Users/christianbernecker/live-your-dreams/design-system/v2")
    
    # Komponenten-Verzeichnisse
    for component_key in COMPONENTS.keys():
        component_dir = base_path / "components" / component_key
        component_dir.mkdir(parents=True, exist_ok=True)
    
    # Andere Verzeichnisse
    for page_path in OTHER_PAGES.keys():
        page_dir = base_path / page_path
        page_dir.mkdir(parents=True, exist_ok=True)
    
    print("✅ Verzeichnisstruktur erstellt")

def generate_all_pages():
    """Generiert alle Seiten"""
    template = load_template()
    base_path = Path("/Users/christianbernecker/live-your-dreams/design-system/v2")
    
    # Komponenten-Seiten generieren
    print("\n🔧 Generiere Komponenten-Seiten...")
    for component_key, component_name in COMPONENTS.items():
        content = generate_component_page(component_key, component_name, template)
        
        # Speichere die Seite
        output_file = base_path / "components" / component_key / "index.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ {component_name} → /v2/components/{component_key}/")
    
    # Andere Seiten generieren (nur mit Headline)
    print("\n📄 Generiere andere Seiten...")
    for page_path, page_name in OTHER_PAGES.items():
        content = template.replace('{{COMPONENT_NAME}}', page_name)
        
        # Entferne alle {{ACTIVE}} Platzhalter
        for comp_key in COMPONENTS.keys():
            content = content.replace('{{' + comp_key.upper().replace('-', '_') + '_ACTIVE}}', '')
        
        # Speichere die Seite
        output_file = base_path / page_path / "index.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ {page_name} → /v2/{page_path}/")

def create_components_index():
    """Erstellt die Components-Übersichtsseite"""
    # Diese bleibt die bestehende index.html im v2-Root
    print("\n📋 Components-Übersichtsseite bereits vorhanden")

def main():
    print("🚀 LYD Design System V2 - Component Generator")
    print("=" * 50)
    
    # 1. Verzeichnisstruktur erstellen
    create_directory_structure()
    
    # 2. Alle Seiten generieren
    generate_all_pages()
    
    # 3. Zusammenfassung
    print("\n" + "=" * 50)
    print("✨ GENERIERUNG ABGESCHLOSSEN")
    print("=" * 50)
    print(f"\n📊 Generierte Seiten:")
    print(f"  • {len(COMPONENTS)} Komponenten-Seiten")
    print(f"  • {len(OTHER_PAGES)} weitere Seiten")
    print(f"  • Gesamt: {len(COMPONENTS) + len(OTHER_PAGES)} Seiten")
    
    print(f"\n🌐 Verfügbare URLs:")
    print(f"  • Hauptseite: http://designsystem.liveyourdreams.online/v2/")
    for comp_key in COMPONENTS.keys():
        print(f"  • {COMPONENTS[comp_key]}: http://designsystem.liveyourdreams.online/v2/components/{comp_key}/")
    
    print(f"\n📋 Alle Seiten haben:")
    print(f"  ✅ Konsistente Navigation")
    print(f"  ✅ Einheitliches Styling") 
    print(f"  ✅ Korrekte Active-States")
    print(f"  ✅ Responsive Design")
    print(f"  ✅ Nur Headlines (bereit für Content)")

if __name__ == "__main__":
    main()
