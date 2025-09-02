#!/usr/bin/env node
/**
 * LYD Design System Automation Tools
 * MCP-style automation für Design System Entwicklung
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DESIGN_SYSTEM_PATH = '/Users/christianbernecker/live-your-dreams/design-system';

class LYDDesignSystemTools {
    constructor() {
        this.log = {
            info: (msg) => console.log(`ℹ️  ${msg}`),
            success: (msg) => console.log(`✅ ${msg}`),
            warning: (msg) => console.log(`⚠️  ${msg}`),
            error: (msg) => console.log(`❌ ${msg}`)
        };
    }

    // MCP-Style: Filesystem Operations
    async createComponent(componentName, section = 'components') {
        this.log.info(`Creating ${componentName} component...`);
        
        const componentDir = path.join(DESIGN_SYSTEM_PATH, section, componentName.toLowerCase());
        const indexPath = path.join(componentDir, 'index.html');
        
        // Erstelle Verzeichnis
        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }
        
        // Generiere HTML Content
        const htmlContent = this.generateComponentHTML(componentName, section);
        fs.writeFileSync(indexPath, htmlContent);
        
        // Update Navigation in allen Dateien
        await this.updateNavigationInAllFiles(componentName, section);
        
        this.log.success(`Component ${componentName} created and navigation updated`);
        return indexPath;
    }

    // MCP-Style: Batch Updates
    async updateNavigationInAllFiles(newComponent, section) {
        this.log.info('Updating navigation in all HTML files...');
        
        const htmlFiles = this.findAllHTMLFiles();
        let updatedCount = 0;
        
        for (const filePath of htmlFiles) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                const updatedContent = this.addComponentToNavigation(content, newComponent, section);
                
                if (content !== updatedContent) {
                    fs.writeFileSync(filePath, updatedContent);
                    updatedCount++;
                }
            } catch (error) {
                this.log.warning(`Could not update ${filePath}: ${error.message}`);
            }
        }
        
        this.log.success(`Updated navigation in ${updatedCount} files`);
    }

    // MCP-Style: Design Token Updates
    async updateDesignTokens(tokenType, oldValue, newValue) {
        this.log.info(`Updating ${tokenType} tokens: ${oldValue} → ${newValue}`);
        
        const htmlFiles = this.findAllHTMLFiles();
        const cssFiles = this.findAllCSSFiles();
        const allFiles = [...htmlFiles, ...cssFiles];
        
        let updatedCount = 0;
        
        for (const filePath of allFiles) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                const updatedContent = content.replaceAll(oldValue, newValue);
                
                if (content !== updatedContent) {
                    fs.writeFileSync(filePath, updatedContent);
                    updatedCount++;
                }
            } catch (error) {
                this.log.warning(`Could not update ${filePath}: ${error.message}`);
            }
        }
        
        this.log.success(`Updated ${tokenType} in ${updatedCount} files`);
    }

    // MCP-Style: Git Operations
    async commitChanges(message) {
        this.log.info('Committing changes to Git...');
        
        try {
            execSync('git add .', { cwd: '/Users/christianbernecker/live-your-dreams' });
            execSync(`git commit -m "${message}"`, { cwd: '/Users/christianbernecker/live-your-dreams' });
            this.log.success('Changes committed to Git');
        } catch (error) {
            this.log.error(`Git commit failed: ${error.message}`);
        }
    }

    // Helper Methods
    findAllHTMLFiles() {
        const files = [];
        const walkDir = (dir) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    walkDir(fullPath);
                } else if (item.endsWith('.html')) {
                    files.push(fullPath);
                }
            }
        };
        
        walkDir(DESIGN_SYSTEM_PATH);
        return files;
    }

    findAllCSSFiles() {
        const files = [];
        const walkDir = (dir) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    walkDir(fullPath);
                } else if (item.endsWith('.css')) {
                    files.push(fullPath);
                }
            }
        };
        
        walkDir(DESIGN_SYSTEM_PATH);
        return files;
    }

    generateComponentHTML(componentName, section) {
        const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
        
        return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} - LYD Design System</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Standard LYD Design System Styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Inter", system-ui, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); color: #1f2937; display: flex; min-height: 100vh; }
        .sidebar { width: 280px; background: #ffffff; border-right: 1px solid #e5e7eb; position: fixed; height: 100vh; overflow-y: auto; z-index: 1000; }
        .sidebar-header { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .sidebar-logo { width: 100%; height: auto; max-height: 60px; }
        .nav-section-title { padding: 16px 24px 8px; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .nav-item { display: block; padding: 12px 24px; color: #374151; text-decoration: none; font-size: 15px; font-weight: 500; transition: all 0.2s ease; border-left: 3px solid transparent; }
        .nav-item:hover { background: #f9fafb; color: #0066ff; border-left-color: #0066ff; }
        .nav-item.active { background: #eff6ff; color: #0066ff; border-left-color: #0066ff; }
        .main-content { margin-left: 280px; flex: 1; min-height: 100vh; padding: 48px; }
        .page-title { font-size: 48px; font-weight: 800; color: #1f2937; margin-bottom: 16px; }
        .page-subtitle { font-size: 20px; color: #6b7280; line-height: 1.6; margin-bottom: 48px; }
        .section { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 40px; margin-bottom: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .section-title { font-size: 28px; font-weight: 700; color: #0066ff; margin-bottom: 24px; }
        .placeholder-content { text-align: center; padding: 60px 20px; color: #6b7280; }
        .placeholder-icon { font-size: 64px; margin-bottom: 24px; }
        .placeholder-title { font-size: 24px; font-weight: 600; color: #374151; margin-bottom: 16px; }
        .placeholder-description { font-size: 16px; line-height: 1.6; max-width: 500px; margin: 0 auto; }
    </style>
</head>
<body>
    <nav class="sidebar">
        <div class="sidebar-header">
            <img src="/assets/lyd-designsystem-logo.svg" alt="LYD Design System" class="sidebar-logo">
        </div>
        
        <div class="sidebar-nav">
            <!-- Navigation wird automatisch generiert -->
            ${this.generateNavigation(componentName, section)}
        </div>
    </nav>
    
    <main class="main-content">
        <h1 class="page-title">${componentName}</h1>
        <p class="page-subtitle">
            Professional ${componentName.toLowerCase()} component for real estate applications.
        </p>
        
        <section class="section">
            <h2 class="section-title">${componentName} Component</h2>
            <div class="placeholder-content">
                <div class="placeholder-icon">🔧</div>
                <h3 class="placeholder-title">${componentName} In Development</h3>
                <p class="placeholder-description">
                    This component is currently being developed with professional design standards, 
                    accessibility features, and real estate specific optimizations.
                </p>
            </div>
        </section>
    </main>
</body>
</html>`;
    }

    generateNavigation(activeComponent, activeSection) {
        return `
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
                <a href="/components/introduction/" class="nav-item${activeSection === 'components' && activeComponent === 'Introduction' ? ' active' : ''}">Introduction</a>
                <a href="/components/buttons/" class="nav-item${activeSection === 'components' && activeComponent === 'Button' ? ' active' : ''}">Button</a>
                <a href="/components/inputs/" class="nav-item${activeSection === 'components' && activeComponent === 'Input' ? ' active' : ''}">Input</a>
                <a href="/components/cards/" class="nav-item${activeSection === 'components' && activeComponent === 'Card' ? ' active' : ''}">Card</a>
                <a href="/components/select/" class="nav-item${activeSection === 'components' && activeComponent === 'Select' ? ' active' : ''}">Select</a>
                <a href="/components/checkbox/" class="nav-item${activeSection === 'components' && activeComponent === 'Checkbox' ? ' active' : ''}">Checkbox</a>
                <a href="/components/radio/" class="nav-item${activeSection === 'components' && activeComponent === 'Radio' ? ' active' : ''}">Radio</a>
                <a href="/components/modal/" class="nav-item${activeSection === 'components' && activeComponent === 'Modal' ? ' active' : ''}">Modal</a>
                <a href="/components/toast/" class="nav-item${activeSection === 'components' && activeComponent === 'Toast' ? ' active' : ''}">Toast</a>
                <a href="/components/table/" class="nav-item${activeSection === 'components' && activeComponent === 'Table' ? ' active' : ''}">Table</a>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Styles</div>
                <a href="/styles/introduction/" class="nav-item${activeSection === 'styles' && activeComponent === 'Introduction' ? ' active' : ''}">Introduction</a>
                <a href="/styles/grid/" class="nav-item${activeSection === 'styles' && activeComponent === 'Grid' ? ' active' : ''}">Grid</a>
                <a href="/styles/typography/" class="nav-item${activeSection === 'styles' && activeComponent === 'Typography' ? ' active' : ''}">Typography</a>
                <a href="/styles/colors/" class="nav-item${activeSection === 'styles' && activeComponent === 'Colors' ? ' active' : ''}">Colors</a>
                <a href="/styles/spacing/" class="nav-item${activeSection === 'styles' && activeComponent === 'Spacing' ? ' active' : ''}">Spacing</a>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Patterns</div>
                <a href="/patterns/introduction/" class="nav-item${activeSection === 'patterns' && activeComponent === 'Introduction' ? ' active' : ''}">Introduction</a>
                <a href="/patterns/property-cards/" class="nav-item${activeSection === 'patterns' && activeComponent === 'Property Cards' ? ' active' : ''}">Property Cards</a>
                <a href="/patterns/header/" class="nav-item${activeSection === 'patterns' && activeComponent === 'Header' ? ' active' : ''}">Header</a>
                <a href="/patterns/footer/" class="nav-item${activeSection === 'patterns' && activeComponent === 'Footer' ? ' active' : ''}">Footer</a>
                <a href="/patterns/forms/" class="nav-item${activeSection === 'patterns' && activeComponent === 'Forms' ? ' active' : ''}">Forms</a>
                <a href="/patterns/lead-management/" class="nav-item${activeSection === 'patterns' && activeComponent === 'Lead Management' ? ' active' : ''}">Lead Management</a>
            </div>
        `;
    }

    addComponentToNavigation(htmlContent, componentName, section) {
        // Füge neuen Komponenten zur Navigation hinzu
        const sectionMap = {
            'components': 'Components',
            'patterns': 'Patterns', 
            'styles': 'Styles'
        };
        
        const sectionTitle = sectionMap[section];
        const newNavItem = `                <a href="/${section}/${componentName.toLowerCase()}/" class="nav-item">${componentName}</a>`;
        
        // Finde die richtige Stelle zum Einfügen
        const sectionRegex = new RegExp(`(<div class="nav-section-title">${sectionTitle}</div>[\\s\\S]*?)(<a href="#"[\\s\\S]*?</div>)`, 'g');
        
        return htmlContent.replace(sectionRegex, (match, beforePlaceholder, afterPlaceholder) => {
            return beforePlaceholder + newNavItem + '\n' + afterPlaceholder;
        });
    }

    // MCP-Style: Git Operations
    async gitCommit(message) {
        this.log.info('Committing changes to Git...');
        
        try {
            execSync('git add .', { 
                cwd: '/Users/christianbernecker/live-your-dreams',
                stdio: 'inherit'
            });
            
            execSync(`git commit -m "${message}"`, { 
                cwd: '/Users/christianbernecker/live-your-dreams',
                stdio: 'inherit'
            });
            
            this.log.success('Changes committed to Git');
        } catch (error) {
            this.log.error(`Git commit failed: ${error.message}`);
        }
    }

    // MCP-Style: Deployment
    async deployToAWS() {
        this.log.info('Deploying to AWS ECS...');
        
        try {
            // Build Docker Image
            execSync('docker build --platform linux/amd64 -f deployment/docker/Dockerfile.designsystem -t lyd-design-system:latest .', {
                cwd: '/Users/christianbernecker/live-your-dreams',
                stdio: 'inherit'
            });
            
            // Tag for ECR
            execSync('docker tag lyd-design-system:latest 835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:latest', {
                cwd: '/Users/christianbernecker/live-your-dreams'
            });
            
            // Push to ECR
            execSync('docker push 835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:latest', {
                cwd: '/Users/christianbernecker/live-your-dreams',
                stdio: 'inherit'
            });
            
            // Update ECS Service
            execSync('aws ecs update-service --cluster lyd-cluster --service lyd-design-system --force-new-deployment --region eu-central-1', {
                cwd: '/Users/christianbernecker/live-your-dreams'
            });
            
            this.log.success('Deployed to AWS ECS');
        } catch (error) {
            this.log.error(`AWS deployment failed: ${error.message}`);
        }
    }

    // CLI Interface
    async run() {
        const args = process.argv.slice(2);
        const command = args[0];
        
        switch (command) {
            case 'create-component':
                const componentName = args[1];
                const section = args[2] || 'components';
                if (!componentName) {
                    this.log.error('Usage: create-component <name> [section]');
                    return;
                }
                await this.createComponent(componentName, section);
                break;
                
            case 'update-tokens':
                const tokenType = args[1];
                const oldValue = args[2];
                const newValue = args[3];
                if (!tokenType || !oldValue || !newValue) {
                    this.log.error('Usage: update-tokens <type> <old-value> <new-value>');
                    return;
                }
                await this.updateDesignTokens(tokenType, oldValue, newValue);
                break;
                
            case 'commit':
                const message = args.slice(1).join(' ') || 'Update Design System';
                await this.gitCommit(message);
                break;
                
            case 'deploy':
                await this.deployToAWS();
                break;
                
            case 'full-workflow':
                const workflowComponent = args[1];
                if (!workflowComponent) {
                    this.log.error('Usage: full-workflow <component-name>');
                    return;
                }
                await this.createComponent(workflowComponent);
                await this.gitCommit(`feat: Add ${workflowComponent} component with full documentation`);
                await this.deployToAWS();
                break;
                
            default:
                console.log(`
🎯 LYD Design System Tools - MCP-Style Automation

Usage:
  node scripts/design-system-tools.js <command> [args]

Commands:
  create-component <name> [section]     Create new component with navigation updates
  update-tokens <type> <old> <new>      Update design tokens across all files
  commit <message>                      Commit changes to Git
  deploy                                Deploy to AWS ECS
  full-workflow <component>             Create component + commit + deploy

Examples:
  node scripts/design-system-tools.js create-component "Dropdown" components
  node scripts/design-system-tools.js update-tokens "color" "#0066ff" "#0052cc"
  node scripts/design-system-tools.js commit "Add new Dropdown component"
  node scripts/design-system-tools.js full-workflow "Accordion"
                `);
        }
    }
}

// Führe CLI aus
if (require.main === module) {
    const tools = new LYDDesignSystemTools();
    tools.run().catch(console.error);
}

module.exports = LYDDesignSystemTools;
