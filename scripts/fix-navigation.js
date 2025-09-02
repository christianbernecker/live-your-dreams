#!/usr/bin/env node
// Navigation Consistency Fix für LYD Design System

const fs = require('fs');
const path = require('path');

const DESIGN_SYSTEM_PATH = '/Users/christianbernecker/live-your-dreams/design-system';

// Vollständige Navigation Template
const COMPLETE_NAVIGATION = `
            <div class="nav-section">
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
            </div>
        `;

function findAllHTMLFiles() {
    const files = [];
    const walkDir = (dir) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (item === 'index.html') {
                files.push(fullPath);
            }
        }
    };
    
    walkDir(DESIGN_SYSTEM_PATH);
    return files;
}

function updateNavigationInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Finde aktuelle Seite für Active State
        const relativePath = path.relative(DESIGN_SYSTEM_PATH, filePath);
        const urlPath = '/' + relativePath.replace('/index.html', '/');
        
        // Erstelle Navigation mit korrektem Active State
        let navigationWithActive = COMPLETE_NAVIGATION;
        navigationWithActive = navigationWithActive.replace(
            `href="${urlPath}" class="nav-item"`,
            `href="${urlPath}" class="nav-item active"`
        );
        
        // Ersetze die Navigation
        const navRegex = /(<div class="sidebar-nav">)([\s\S]*?)(<\/div>\s*<\/nav>)/;
        const newContent = content.replace(navRegex, `$1${navigationWithActive}        $3`);
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent);
            console.log(`✅ Updated navigation in ${relativePath}`);
            return true;
        }
    } catch (error) {
        console.log(`❌ Error updating ${filePath}: ${error.message}`);
    }
    return false;
}

function main() {
    console.log('🔧 Fixing navigation consistency across all HTML files...');
    console.log('');
    
    const htmlFiles = findAllHTMLFiles();
    let updatedCount = 0;
    
    for (const filePath of htmlFiles) {
        if (updateNavigationInFile(filePath)) {
            updatedCount++;
        }
    }
    
    console.log('');
    console.log(`🎉 Navigation updated in ${updatedCount} of ${htmlFiles.length} files`);
    console.log('');
    console.log('📋 All navigation links now include:');
    console.log('- /designing/introduction/');
    console.log('- /developing/introduction/ + /developing/nextjs-integration/');
    console.log('- /components/accordion/, /components/dropdown/, /components/buttons-enhanced/');
    console.log('- All existing patterns and styles');
}

main();
