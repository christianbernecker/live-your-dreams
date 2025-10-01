#!/usr/bin/env node

/**
 * Live Your Dreams - Backoffice Visual Validator
 * Automated Screenshot & Design System Compliance Checker
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class BackofficeVisualValidator {
    constructor() {
        this.baseUrl = 'https://backoffice.liveyourdreams.online';
        this.screenshotDir = './screenshots/backoffice';
        this.pages = [
            { name: 'login', url: '/login', auth: false },
            { name: 'dashboard', url: '/dashboard', auth: true },
            { name: 'properties', url: '/properties', auth: true },
            { name: 'leads', url: '/leads', auth: true },
            { name: 'pricing', url: '/pricing', auth: true },
            { name: 'settings', url: '/settings', auth: true }
        ];
    }

    async init() {
        // Screenshot Directory erstellen
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }

        this.browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async authenticate(page) {
        console.log('🔐 Authentifizierung...');
        
        await page.goto(`${this.baseUrl}/login`);
        await page.waitForSelector('input[type="email"]');
        
        // Login-Daten eingeben
        await page.type('input[type="email"]', 'admin@liveyourdreams.de');
        await page.type('input[type="password"]', 'lyd-admin-2024');
        
        // Submit und warten auf Redirect
        await Promise.all([
            page.waitForNavigation(),
            page.click('button[type="submit"]')
        ]);
    }

    async takeScreenshot(pageName, url) {
        const page = await this.browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        try {
            console.log(`📸 Screenshot: ${pageName}`);
            
            if (url !== '/login') {
                await this.authenticate(page);
            }
            
            await page.goto(`${this.baseUrl}${url}`);
            await page.waitForTimeout(2000); // CSS Loading warten
            
            // Screenshot mit timestamp
            const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
            const filename = `${pageName}_${timestamp}.png`;
            
            await page.screenshot({
                path: path.join(this.screenshotDir, filename),
                fullPage: true
            });
            
            console.log(`✅ Gespeichert: ${filename}`);
            return filename;
            
        } catch (error) {
            console.error(`❌ Fehler bei ${pageName}:`, error.message);
            return null;
        } finally {
            await page.close();
        }
    }

    async checkDesignSystemCompliance(pageName, url) {
        const page = await this.browser.newPage();
        
        try {
            if (url !== '/login') {
                await this.authenticate(page);
            }
            
            await page.goto(`${this.baseUrl}${url}`);
            await page.waitForTimeout(2000);

            // Design System Compliance Checks
            const results = await page.evaluate(() => {
                const checks = {};
                
                // ❌ Emoji Check
                const allElements = document.querySelectorAll('*');
                const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
                
                let emojiCount = 0;
                const emojiElements = [];
                
                Array.from(allElements).forEach(el => {
                    if (emojiRegex.test(el.textContent)) {
                        emojiCount++;
                        emojiElements.push({
                            tag: el.tagName,
                            class: el.className,
                            text: el.textContent.trim()
                        });
                    }
                });
                
                checks.emojis = {
                    count: emojiCount,
                    status: emojiCount === 0 ? '✅' : '❌',
                    elements: emojiElements
                };

                // ✅ Design System Classes Check
                checks.lydButtons = {
                    count: document.querySelectorAll('.lyd-button').length,
                    status: document.querySelectorAll('.lyd-button').length > 0 ? '✅' : '❌'
                };
                
                checks.lydCards = {
                    count: document.querySelectorAll('.lyd-card').length,
                    status: document.querySelectorAll('.lyd-card').length > 0 ? '✅' : '❌'
                };
                
                checks.lydInputs = {
                    count: document.querySelectorAll('.lyd-input').length,
                    status: document.querySelectorAll('.lyd-input').length > 0 ? '✅' : '❌'
                };

                // CSS Variables Check
                const computedStyle = getComputedStyle(document.documentElement);
                checks.colors = {
                    lydPrimary: computedStyle.getPropertyValue('--lyd-primary').trim(),
                    lydRoyalBlue: computedStyle.getPropertyValue('--lyd-royal-blue').trim(),
                    lydAccent: computedStyle.getPropertyValue('--lyd-accent').trim(),
                    status: computedStyle.getPropertyValue('--lyd-primary').trim() === '#000066' ? '✅' : '❌'
                };

                // Logo Check
                const logoImg = document.querySelector('img[alt*="Live Your Dreams"], img[alt*="LYD"]');
                checks.logo = {
                    found: !!logoImg,
                    src: logoImg ? logoImg.src : null,
                    status: logoImg ? '✅' : '❌'
                };

                return checks;
            });
            
            console.log(`🔍 Design System Check: ${pageName}`);
            console.log(`  Emojis: ${results.emojis.status} (${results.emojis.count} gefunden)`);
            console.log(`  LYD Buttons: ${results.lydButtons.status} (${results.lydButtons.count})`);
            console.log(`  LYD Cards: ${results.lydCards.status} (${results.lydCards.count})`);
            console.log(`  LYD Inputs: ${results.lydInputs.status} (${results.lydInputs.count})`);
            console.log(`  Colors: ${results.colors.status}`);
            console.log(`  Logo: ${results.logo.status}`);
            
            if (results.emojis.count > 0) {
                console.log(`  ⚠️ Gefundene Emojis:`, results.emojis.elements);
            }
            
            return results;
            
        } catch (error) {
            console.error(`❌ Compliance Check Error bei ${pageName}:`, error.message);
            return null;
        } finally {
            await page.close();
        }
    }

    async runFullValidation() {
        console.log('🚀 BACKOFFICE VISUAL VALIDATION STARTET');
        console.log('═════════════════════════════════════════');
        
        const results = {
            screenshots: [],
            compliance: [],
            timestamp: new Date().toISOString()
        };

        for (const pageConfig of this.pages) {
            console.log(`\n📄 Verarbeite: ${pageConfig.name} (${pageConfig.url})`);
            
            // Screenshot
            const screenshot = await this.takeScreenshot(pageConfig.name, pageConfig.url);
            if (screenshot) {
                results.screenshots.push({
                    page: pageConfig.name,
                    file: screenshot,
                    url: pageConfig.url
                });
            }
            
            // Compliance Check
            const compliance = await this.checkDesignSystemCompliance(pageConfig.name, pageConfig.url);
            if (compliance) {
                results.compliance.push({
                    page: pageConfig.name,
                    url: pageConfig.url,
                    ...compliance
                });
            }
        }

        // Report generieren
        await this.generateReport(results);
        
        console.log('\n✅ VALIDATION ABGESCHLOSSEN');
        return results;
    }

    async generateReport(results) {
        const reportPath = path.join(this.screenshotDir, 'validation-report.json');
        const htmlReportPath = path.join(this.screenshotDir, 'validation-report.html');
        
        // JSON Report
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        
        // HTML Report
        const htmlReport = this.generateHTMLReport(results);
        fs.writeFileSync(htmlReportPath, htmlReport);
        
        console.log(`\n📊 Reports erstellt:`);
        console.log(`  • JSON: ${reportPath}`);
        console.log(`  • HTML: ${htmlReportPath}`);
    }

    generateHTMLReport(results) {
        const compliance = results.compliance;
        const screenshots = results.screenshots;
        
        return `<!DOCTYPE html>
<html>
<head>
    <title>Backoffice Design System Validation Report</title>
    <style>
        body { font-family: 'Inter', sans-serif; margin: 40px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px; }
        .status-ok { color: #10b981; font-weight: bold; }
        .status-error { color: #ef4444; font-weight: bold; }
        .page-section { margin-bottom: 32px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .screenshot { max-width: 300px; border: 1px solid #e5e7eb; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .summary-card { padding: 20px; border-radius: 6px; text-align: center; }
        .summary-ok { background: #d1fae5; }
        .summary-error { background: #fee2e2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Backoffice Design System Validation Report</h1>
            <p>Generated: ${results.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card summary-ok">
                <h3>Screenshots</h3>
                <div style="font-size: 24px; font-weight: bold;">${screenshots.length}</div>
            </div>
            <div class="summary-card ${compliance.every(c => c.emojis.status === '✅') ? 'summary-ok' : 'summary-error'}">
                <h3>Emoji-Free</h3>
                <div style="font-size: 24px; font-weight: bold;">${compliance.filter(c => c.emojis.status === '✅').length}/${compliance.length}</div>
            </div>
            <div class="summary-card ${compliance.every(c => c.lydButtons.status === '✅') ? 'summary-ok' : 'summary-error'}">
                <h3>LYD Buttons</h3>
                <div style="font-size: 24px; font-weight: bold;">${compliance.filter(c => c.lydButtons.status === '✅').length}/${compliance.length}</div>
            </div>
            <div class="summary-card ${compliance.every(c => c.colors.status === '✅') ? 'summary-ok' : 'summary-error'}">
                <h3>Color System</h3>
                <div style="font-size: 24px; font-weight: bold;">${compliance.filter(c => c.colors.status === '✅').length}/${compliance.length}</div>
            </div>
        </div>

        ${compliance.map((page, index) => `
        <div class="page-section">
            <h2>📄 ${page.page.charAt(0).toUpperCase() + page.page.slice(1)} (${page.url})</h2>
            
            ${screenshots[index] ? `<img src="${screenshots[index].file}" class="screenshot" alt="Screenshot ${page.page}" />` : ''}
            
            <table>
                <tr><th>Check</th><th>Status</th><th>Details</th></tr>
                <tr>
                    <td>🚫 Emojis</td>
                    <td class="${page.emojis.status === '✅' ? 'status-ok' : 'status-error'}">${page.emojis.status}</td>
                    <td>${page.emojis.count} gefunden</td>
                </tr>
                <tr>
                    <td>🔘 LYD Buttons</td>
                    <td class="${page.lydButtons.status === '✅' ? 'status-ok' : 'status-error'}">${page.lydButtons.status}</td>
                    <td>${page.lydButtons.count} Buttons</td>
                </tr>
                <tr>
                    <td>📦 LYD Cards</td>
                    <td class="${page.lydCards.status === '✅' ? 'status-ok' : 'status-error'}">${page.lydCards.status}</td>
                    <td>${page.lydCards.count} Cards</td>
                </tr>
                <tr>
                    <td>📝 LYD Inputs</td>
                    <td class="${page.lydInputs.status === '✅' ? 'status-ok' : 'status-error'}">${page.lydInputs.status}</td>
                    <td>${page.lydInputs.count} Inputs</td>
                </tr>
                <tr>
                    <td>🎨 Colors</td>
                    <td class="${page.colors.status === '✅' ? 'status-ok' : 'status-error'}">${page.colors.status}</td>
                    <td>Primary: ${page.colors.lydPrimary}</td>
                </tr>
                <tr>
                    <td>🏢 Logo</td>
                    <td class="${page.logo.status === '✅' ? 'status-ok' : 'status-error'}">${page.logo.status}</td>
                    <td>${page.logo.found ? 'Found' : 'Missing'}</td>
                </tr>
            </table>
            
            ${page.emojis.count > 0 ? `
            <h4>⚠️ Gefundene Emojis:</h4>
            <ul>
                ${page.emojis.elements.map(el => `<li><code>&lt;${el.tag.toLowerCase()} class="${el.class}"&gt;</code>: ${el.text}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// CLI Usage
if (require.main === module) {
    (async () => {
        const validator = new BackofficeVisualValidator();
        
        try {
            await validator.init();
            await validator.runFullValidation();
        } catch (error) {
            console.error('❌ Validation Error:', error);
        } finally {
            await validator.cleanup();
        }
    })();
}

module.exports = BackofficeVisualValidator;

