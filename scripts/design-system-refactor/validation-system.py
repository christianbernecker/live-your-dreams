#!/usr/bin/env python3
"""
LYD Design System Validation System
Automatische Qualitätssicherung für alle Komponenten
"""

import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import html.parser
import urllib.request
import urllib.error

class DesignSystemValidator:
    def __init__(self, base_path: str = "/Users/christianbernecker/live-your-dreams"):
        self.base_path = Path(base_path)
        self.design_system_path = self.base_path / "design-system"
        self.components_path = self.design_system_path / "components"
        self.base_url = "http://designsystem.liveyourdreams.online"
        
        # Validation Rules
        self.required_tabs = ["variants", "examples", "implementation", "accessibility"]
        self.required_classes = ["lyd-"]  # Web Components prefix
        self.forbidden_classes = ["luxury-btn"]  # Old inconsistent classes
        self.required_structure = {
            "sidebar": True,
            "main-content": True,
            "tabs": True,
            "tab-content": True
        }
        
        self.validation_results = []
        self.auto_fixes = []
    
    def validate_component(self, component_name: str, fix: bool = True) -> Dict:
        """Validiert eine einzelne Komponente"""
        component_path = self.components_path / component_name / "index.html"
        
        if not component_path.exists():
            return {
                "component": component_name,
                "status": "missing",
                "errors": [f"Component file not found: {component_path}"]
            }
        
        with open(component_path, 'r') as f:
            content = f.read()
        
        errors = []
        warnings = []
        
        # 1. Check 4-Tab Structure using regex
        tabs = re.findall(r'<button[^>]*class="tab[^"]*"[^>]*data-tab="([^"]+)"', content)
        tab_names = tabs
        
        if len(tabs) != 4:
            errors.append(f"❌ Wrong number of tabs: {len(tabs)} (expected 4)")
            if fix:
                self.fix_tab_structure(component_path, content)
        
        for required_tab in self.required_tabs:
            if required_tab not in tab_names:
                errors.append(f"❌ Missing required tab: {required_tab}")
        
        # 2. Check for forbidden classes
        for forbidden in self.forbidden_classes:
            if forbidden in content:
                count = content.count(forbidden)
                errors.append(f"❌ Found forbidden class '{forbidden}' ({count} occurrences)")
                if fix:
                    self.fix_forbidden_classes(component_path, content, forbidden)
        
        # 3. Check for Web Components
        web_components = re.findall(r'<lyd-[^>]+>', content)
        if len(web_components) < 1:
            warnings.append(f"⚠️ No Web Components found (lyd-* elements)")
        
        # 4. Check sidebar consistency
        if '<nav class="sidebar">' not in content:
            errors.append("❌ Missing sidebar navigation")
            if fix:
                self.fix_sidebar(component_path, content)
        
        # 5. Check active navigation
        if 'nav-item active' not in content:
            warnings.append("⚠️ No active navigation item")
        
        # 6. Check accessibility
        if 'aria-' not in content.lower():
            warnings.append("⚠️ No ARIA attributes found")
        
        if 'role=' not in content.lower():
            warnings.append("⚠️ No role attributes found")
        
        # 7. Check TypeScript examples
        if 'typescript' not in content.lower() and 'tsx' not in content.lower():
            warnings.append("⚠️ No TypeScript examples found")
        
        # Calculate score
        score = 100
        score -= len(errors) * 10
        score -= len(warnings) * 3
        score = max(0, score)
        
        result = {
            "component": component_name,
            "status": "fail" if errors else "pass",
            "score": score,
            "errors": errors,
            "warnings": warnings,
            "timestamp": datetime.now().isoformat()
        }
        
        self.validation_results.append(result)
        return result
    
    def fix_tab_structure(self, component_path: Path, content: str):
        """Korrigiert die Tab-Struktur auf 4 Tabs"""
        # Find existing tabs section
        tabs_pattern = r'<div class="tabs">.*?</div>'
        correct_tabs = '''<div class="tabs">
            <button class="tab active" data-tab="variants">Variants</button>
            <button class="tab" data-tab="examples">Examples</button>
            <button class="tab" data-tab="implementation">Implementation</button>
            <button class="tab" data-tab="accessibility">Accessibility</button>
        </div>'''
        
        new_content = re.sub(tabs_pattern, correct_tabs, content, flags=re.DOTALL)
        
        with open(component_path, 'w') as f:
            f.write(new_content)
        
        self.auto_fixes.append(f"✅ Fixed tab structure for {component_path.parent.name}")
    
    def fix_forbidden_classes(self, component_path: Path, content: str, forbidden_class: str):
        """Ersetzt verbotene Klassen mit korrekten Web Components"""
        replacements = {
            "luxury-btn": "lyd-button",
            "luxury-input": "lyd-input",
            "luxury-select": "lyd-select",
            "luxury-card": "lyd-card"
        }
        
        if forbidden_class in replacements:
            new_content = content.replace(forbidden_class, replacements[forbidden_class])
            
            with open(component_path, 'w') as f:
                f.write(new_content)
            
            self.auto_fixes.append(f"✅ Replaced {forbidden_class} with {replacements[forbidden_class]}")
    
    def fix_sidebar(self, component_path: Path, content: str):
        """Fügt fehlende Sidebar hinzu"""
        # Load sidebar from template
        template_path = self.base_path / "scripts" / "design-system-refactor" / "master-template.html"
        
        if template_path.exists():
            with open(template_path, 'r') as f:
                template = f.read()
            
            # Extract sidebar from template
            sidebar_match = re.search(r'<nav class="sidebar">.*?</nav>', template, re.DOTALL)
            if sidebar_match:
                sidebar_html = sidebar_match.group(0)
                
                # Insert after <body>
                new_content = content.replace('<body>', f'<body>\n    {sidebar_html}')
                
                with open(component_path, 'w') as f:
                    f.write(new_content)
                
                self.auto_fixes.append(f"✅ Added sidebar to {component_path.parent.name}")
    
    def validate_live_url(self, component_name: str) -> Dict:
        """Validiert die Live-URL einer Komponente"""
        url = f"{self.base_url}/components/{component_name}/"
        
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                content = response.read().decode('utf-8')
                
                # Check for tabs using regex
                tabs = re.findall(r'<button[^>]*class="tab[^"]*"[^>]*data-tab="([^"]+)"', content)
                
                if len(tabs) != 4:
                    return {
                        "component": component_name,
                        "url": url,
                        "status": "invalid",
                        "error": f"Wrong number of tabs: {len(tabs)}"
                    }
                
                return {
                    "component": component_name,
                    "url": url,
                    "status": "ok",
                    "tabs": len(tabs)
                }
                
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return {
                    "component": component_name,
                    "url": url,
                    "status": "not_found",
                    "error": "Component not deployed"
                }
            return {
                "component": component_name,
                "url": url,
                "status": "error",
                "error": f"HTTP {e.code}"
            }
        except Exception as e:
            return {
                "component": component_name,
                "url": url,
                "status": "error",
                "error": str(e)
            }
    
    def validate_all_components(self, fix: bool = True) -> Dict:
        """Validiert alle Komponenten"""
        print("🔍 Starting Design System Validation...")
        print("=" * 60)
        
        # Find all components
        components = [d.name for d in self.components_path.iterdir() if d.is_dir()]
        
        total_score = 0
        passed = 0
        failed = 0
        
        for component in sorted(components):
            print(f"\n📋 Validating: {component}")
            result = self.validate_component(component, fix)
            
            if result['status'] == 'pass':
                print(f"  ✅ PASSED (Score: {result['score']})")
                passed += 1
            else:
                print(f"  ❌ FAILED (Score: {result['score']})")
                failed += 1
                
                if result['errors']:
                    print("  Errors:")
                    for error in result['errors']:
                        print(f"    {error}")
                
                if result.get('warnings'):
                    print("  Warnings:")
                    for warning in result['warnings']:
                        print(f"    {warning}")
            
            total_score += result['score']
        
        # Summary
        avg_score = total_score / len(components) if components else 0
        
        print("\n" + "=" * 60)
        print("📊 VALIDATION SUMMARY")
        print("=" * 60)
        print(f"Total Components: {len(components)}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Average Score: {avg_score:.1f}/100")
        
        if self.auto_fixes:
            print(f"\n🔧 Auto-fixes applied: {len(self.auto_fixes)}")
            for fix in self.auto_fixes[:5]:  # Show first 5 fixes
                print(f"  {fix}")
        
        # Save results
        results_file = self.base_path / "validation-results.json"
        with open(results_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "summary": {
                    "total": len(components),
                    "passed": passed,
                    "failed": failed,
                    "average_score": avg_score
                },
                "components": self.validation_results,
                "auto_fixes": self.auto_fixes
            }, f, indent=2)
        
        print(f"\n💾 Results saved to: {results_file}")
        
        return {
            "total": len(components),
            "passed": passed,
            "failed": failed,
            "average_score": avg_score
        }
    
    def continuous_validation(self):
        """Kontinuierliche Validierung bei Änderungen"""
        print("👁️ Starting continuous validation...")
        print("Watching for changes in:", self.components_path)
        
        # Use fswatch or watchdog for file monitoring
        # This is a simplified version
        import time
        
        last_check = {}
        
        while True:
            for component_path in self.components_path.iterdir():
                if component_path.is_dir():
                    index_file = component_path / "index.html"
                    if index_file.exists():
                        mtime = index_file.stat().st_mtime
                        
                        if component_path.name not in last_check or mtime > last_check[component_path.name]:
                            print(f"\n🔄 Change detected in {component_path.name}")
                            self.validate_component(component_path.name, fix=True)
                            last_check[component_path.name] = mtime
            
            time.sleep(5)  # Check every 5 seconds

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='LYD Design System Validator')
    parser.add_argument('--component', '-c', help='Validate specific component')
    parser.add_argument('--all', '-a', action='store_true', help='Validate all components')
    parser.add_argument('--live', '-l', action='store_true', help='Validate live URLs')
    parser.add_argument('--fix', '-f', action='store_true', help='Auto-fix issues', default=True)
    parser.add_argument('--watch', '-w', action='store_true', help='Continuous validation')
    
    args = parser.parse_args()
    
    validator = DesignSystemValidator()
    
    if args.component:
        result = validator.validate_component(args.component, args.fix)
        print(json.dumps(result, indent=2))
    elif args.all:
        validator.validate_all_components(args.fix)
    elif args.live:
        components = [d.name for d in validator.components_path.iterdir() if d.is_dir()]
        for component in components:
            result = validator.validate_live_url(component)
            print(f"{component}: {result['status']}")
    elif args.watch:
        validator.continuous_validation()
    else:
        # Default: validate all with fixes
        validator.validate_all_components(True)

if __name__ == "__main__":
    main()
