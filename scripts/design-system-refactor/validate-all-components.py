#!/usr/bin/env python3
"""
LYD Design System - Component Validation Script
Prüft alle Komponenten gegen die definierten Standards
"""

import os
import sys
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError
import json
from datetime import datetime

class ComponentValidator:
    def __init__(self):
        self.base_path = Path("/Users/christianbernecker/live-your-dreams/design-system/components")
        self.base_url = "http://designsystem.liveyourdreams.online/components"
        self.results = {}
        
    def validate_component(self, component_dir):
        """Validiert eine einzelne Komponente"""
        component_name = component_dir.name
        index_file = component_dir / "index.html"
        
        if not index_file.exists():
            return {
                "exists": False,
                "checks": {}
            }
        
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        checks = {
            "file_exists": True,
            "correct_logo": self.check_logo(content),
            "navigation_present": self.check_navigation(content),
            "navigation_consistent": self.check_navigation_consistency(content),
            "structure_correct": self.check_structure(content),
            "premium_styles": self.check_premium_styles(content),
            "micro_animations": self.check_animations(content),
            "accessibility": self.check_accessibility(content),
            "javascript_present": self.check_javascript(content),
            "responsive_design": self.check_responsive(content),
            "live_url": self.check_live_url(component_name)
        }
        
        # Berechne Score
        passed = sum(1 for v in checks.values() if v)
        total = len(checks)
        score = (passed / total) * 100
        
        return {
            "exists": True,
            "checks": checks,
            "score": score,
            "passed": passed,
            "total": total
        }
    
    def check_logo(self, content):
        """Prüft ob das korrekte Logo verwendet wird"""
        correct_logos = [
            "Live_Your_Dreams_Perfect.svg",
            "/docs/CI/exports/Live_Your_Dreams_Perfect.svg"
        ]
        return any(logo in content for logo in correct_logos)
    
    def check_navigation(self, content):
        """Prüft ob Navigation vorhanden ist"""
        required_elements = [
            '<nav class="sidebar">',
            'nav-section-title',
            'nav-item',
            'Designing',
            'Developing',
            'Components',
            'Styles',
            'Patterns'
        ]
        return all(elem in content for elem in required_elements)
    
    def check_navigation_consistency(self, content):
        """Prüft ob alle Navigation-Links vorhanden sind"""
        required_links = [
            '/components/buttons/',
            '/components/cards/',
            '/components/modal/',
            '/components/select/',
            '/components/inputs/',
            '/patterns/property-cards/'
        ]
        return all(link in content for link in required_links)
    
    def check_structure(self, content):
        """Prüft die Seitenstruktur"""
        required_structure = [
            'main-content',
            'section-title',
            '<section',
            'showcase-grid" OR "showcase-item" OR "examples-grid'
        ]
        return all(elem in content for elem in required_structure[:3])
    
    def check_premium_styles(self, content):
        """Prüft auf Premium-Styling"""
        premium_indicators = [
            'linear-gradient',
            'backdrop-filter',
            'box-shadow',
            'rgba',
            'cubic-bezier'
        ]
        count = sum(1 for indicator in premium_indicators if indicator in content)
        return count >= 3
    
    def check_animations(self, content):
        """Prüft auf Micro-Animationen"""
        animation_indicators = [
            '@keyframes',
            'transition:',
            'animation:',
            'transform:',
            ':hover'
        ]
        count = sum(1 for indicator in animation_indicators if indicator in content)
        return count >= 3
    
    def check_accessibility(self, content):
        """Prüft Barrierefreiheit"""
        a11y_indicators = [
            'aria-',
            'role=',
            'alt=',
            ':focus',
            'tabindex'
        ]
        count = sum(1 for indicator in a11y_indicators if indicator in content)
        return count >= 2
    
    def check_javascript(self, content):
        """Prüft ob JavaScript vorhanden ist"""
        return '<script>' in content and 'addEventListener' in content
    
    def check_responsive(self, content):
        """Prüft auf Responsive Design"""
        responsive_indicators = [
            '@media',
            'max-width:',
            'min-width:',
            'flex',
            'grid'
        ]
        count = sum(1 for indicator in responsive_indicators if indicator in content)
        return count >= 2
    
    def check_live_url(self, component_name):
        """Prüft ob die Live-URL erreichbar ist"""
        url = f"{self.base_url}/{component_name}/"
        try:
            req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urlopen(req, timeout=5)
            return response.status == 200
        except:
            return False
    
    def validate_all(self):
        """Validiert alle Komponenten"""
        print("\n" + "="*80)
        print("🔍 LYD DESIGN SYSTEM - COMPONENT VALIDATION")
        print("="*80)
        print(f"\n📅 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📁 Base Path: {self.base_path}")
        print(f"🌐 Base URL: {self.base_url}\n")
        print("="*80)
        
        components = sorted([d for d in self.base_path.iterdir() 
                           if d.is_dir() and not d.name.startswith('_')])
        
        total_score = 0
        component_count = 0
        
        # Detaillierte Ergebnisse
        for component_dir in components:
            result = self.validate_component(component_dir)
            self.results[component_dir.name] = result
            
            if result["exists"]:
                component_count += 1
                total_score += result["score"]
                
                # Status-Symbol basierend auf Score
                if result["score"] >= 90:
                    status = "✅"
                elif result["score"] >= 70:
                    status = "⚠️"
                else:
                    status = "❌"
                
                print(f"\n{status} {component_dir.name.upper()} - Score: {result['score']:.1f}% ({result['passed']}/{result['total']})")
                print("  " + "-"*40)
                
                for check_name, passed in result["checks"].items():
                    icon = "✓" if passed else "✗"
                    check_display = check_name.replace("_", " ").title()
                    print(f"  {icon} {check_display}")
        
        # Zusammenfassung
        print("\n" + "="*80)
        print("📊 ZUSAMMENFASSUNG")
        print("="*80)
        
        if component_count > 0:
            avg_score = total_score / component_count
            print(f"\n🎯 Durchschnittlicher Score: {avg_score:.1f}%")
            print(f"📦 Komponenten geprüft: {component_count}")
            
            # Top Issues
            print("\n⚠️  HÄUFIGSTE PROBLEME:")
            issue_counts = {}
            for comp_name, result in self.results.items():
                if result["exists"]:
                    for check_name, passed in result["checks"].items():
                        if not passed:
                            if check_name not in issue_counts:
                                issue_counts[check_name] = []
                            issue_counts[check_name].append(comp_name)
            
            sorted_issues = sorted(issue_counts.items(), key=lambda x: len(x[1]), reverse=True)
            for issue, components in sorted_issues[:5]:
                issue_display = issue.replace("_", " ").title()
                print(f"  • {issue_display}: {len(components)} Komponenten")
                if len(components) <= 3:
                    print(f"    Betroffen: {', '.join(components)}")
            
            # Empfehlungen
            print("\n💡 EMPFEHLUNGEN:")
            if "correct_logo" in issue_counts and len(issue_counts["correct_logo"]) > 0:
                print("  1. Logo-Migration: Alle Komponenten auf Live_Your_Dreams_Perfect.svg umstellen")
            if avg_score < 80:
                print("  2. Premium-Upgrade: Micro-Animationen und Glassmorphism hinzufügen")
            if "navigation_consistent" in issue_counts:
                print("  3. Navigation-Fix: Einheitliche Sidebar auf allen Seiten implementieren")
            if "accessibility" in issue_counts and len(issue_counts["accessibility"]) > 3:
                print("  4. A11y-Verbesserung: ARIA-Labels und Keyboard-Navigation ergänzen")
        
        print("\n" + "="*80)
        print("✨ Validation Complete")
        print("="*80 + "\n")
        
        # Export Ergebnisse als JSON
        self.export_results()
        
        return avg_score if component_count > 0 else 0
    
    def export_results(self):
        """Exportiert Ergebnisse als JSON"""
        output_file = Path("/Users/christianbernecker/live-your-dreams/docs/design-system/validation-results.json")
        
        export_data = {
            "timestamp": datetime.now().isoformat(),
            "components": self.results,
            "summary": {
                "total_components": len(self.results),
                "average_score": sum(r["score"] for r in self.results.values() if r["exists"]) / 
                               sum(1 for r in self.results.values() if r["exists"])
                               if any(r["exists"] for r in self.results.values()) else 0
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"📄 Ergebnisse exportiert nach: {output_file}")

def main():
    validator = ComponentValidator()
    score = validator.validate_all()
    
    # Exit-Code basierend auf Score
    if score >= 80:
        sys.exit(0)  # Success
    else:
        sys.exit(1)  # Failure

if __name__ == "__main__":
    main()

