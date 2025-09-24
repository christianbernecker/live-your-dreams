#!/usr/bin/env python3
"""
Screenshot-Generator für alle Seiten der Design System Navigation
Erstellt Screenshots aller über die linke Navigation aufrufbaren Seiten
"""

import subprocess
import time
from datetime import datetime
import os

# Base URL des Design Systems
BASE_URL = "http://designsystem.liveyourdreams.online"

# Alle URLs aus der Navigation (basierend auf der Gold Standard Navigation)
NAVIGATION_URLS = [
    # Homepage
    "/",
    
    # Design Principles
    "/design-principles/overview/",
    "/design-principles/colors/",
    "/design-principles/typography/",
    "/design-principles/grid/",
    "/design-principles/spacing/",
    
    # Implementation Guide  
    "/implementation/overview/",
    "/implementation/getting-started/",
    "/implementation/architecture/",
    "/implementation/best-practices/",
    
    # Components Overview
    "/components/overview/",
    
    # Components
    "/components/accordion/",
    "/components/alert/",
    "/components/avatar/",
    "/components/badge/",
    "/components/breadcrumb/",
    "/components/buttons/",
    "/components/cards/",
    "/components/checkbox/",
    "/components/dropdown/",
    "/components/inputs/",
    "/components/modal/",
    "/components/navbar/",
    "/components/pagination/",
    "/components/progress/",
    "/components/radio/",
    "/components/select/",
    "/components/slider/",
    "/components/switch/",
    "/components/table/",
    "/components/tabs/",
    "/components/textarea/",
    "/components/toast/",
    "/components/tooltip/",
    "/components/upload/"
]

def create_screenshot(url, filename):
    """Erstellt einen Screenshot einer URL mit Playwright"""
    full_url = BASE_URL + url
    
    # Playwright Screenshot Command
    cmd = [
        "npx", "playwright", "screenshot", 
        "--wait-for-timeout", "3000",  # 3 Sekunden warten
        "--viewport-size", "1920,1080",  # Desktop Auflösung
        "--full-page",  # Komplette Seite
        full_url,
        filename
    ]
    
    try:
        print(f"📸 Screenshot: {full_url} -> {filename}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print(f"   ✅ Erfolgreich gespeichert")
            return True
        else:
            print(f"   ❌ Fehler: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"   ⏱️ Timeout bei {full_url}")
        return False
    except Exception as e:
        print(f"   💥 Exception: {e}")
        return False

def main():
    """Hauptfunktion - erstellt alle Screenshots"""
    
    # Datum für Dateinamen
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Screenshots Ordner
    screenshots_dir = "/Users/christianbernecker/live-your-dreams/screenshots"
    
    print(f"🚀 Starte Screenshot-Erstellung für {len(NAVIGATION_URLS)} Seiten")
    print(f"📅 Datum: {today}")
    print(f"📁 Ordner: {screenshots_dir}")
    print("-" * 60)
    
    successful = 0
    failed = 0
    
    for url in NAVIGATION_URLS:
        # Dateiname generieren
        if url == "/":
            filename = f"{screenshots_dir}/homepage_{today}.png"
        else:
            # URL zu Dateiname konvertieren
            clean_url = url.strip("/").replace("/", "_")
            filename = f"{screenshots_dir}/{clean_url}_{today}.png"
        
        # Screenshot erstellen
        if create_screenshot(url, filename):
            successful += 1
        else:
            failed += 1
            
        # Kurze Pause zwischen Screenshots
        time.sleep(1)
    
    print("-" * 60)
    print(f"📊 ZUSAMMENFASSUNG:")
    print(f"   ✅ Erfolgreich: {successful}")
    print(f"   ❌ Fehlgeschlagen: {failed}")
    print(f"   📁 Screenshots in: {screenshots_dir}")
    
    # Liste aller erstellten Screenshots
    print(f"\n📋 Erstellte Screenshots:")
    try:
        files = sorted([f for f in os.listdir(screenshots_dir) if f.endswith('.png')])
        for i, file in enumerate(files, 1):
            print(f"   {i:2d}. {file}")
    except:
        print("   Fehler beim Auflisten der Dateien")

if __name__ == "__main__":
    main()
