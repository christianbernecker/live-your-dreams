const { chromium } = require('playwright');

async function takeScreenshots() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Setze Viewport für konsistente Screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const components = [
        'inputs', 'radio', 'checkbox', 'textarea', 'switch', 'slider', 
        'alert', 'badge', 'datepicker', 'avatar', 'navbar', 'tabs',
        'progress', 'calendar', 'autocomplete', 'pagination', 'tooltip',
        'dropdown', 'modal', 'table', 'typography', 'buttons', 
        'cards', 'accordion', 'toast'
    ];
    
    console.log(`📸 Erstelle Screenshots für ${components.length} Komponenten...`);
    
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const url = `http://designsystem.liveyourdreams.online/components/${component}/`;
        
        try {
            console.log(`${i+1}/25: ${component.toUpperCase()} - ${url}`);
            
            // Lade die Seite
            await page.goto(url, { waitUntil: 'networkidle' });
            
            // Warte kurz für Animationen
            await page.waitForTimeout(2000);
            
            // Erstelle Screenshot
            await page.screenshot({ 
                path: `${component}_full.png`,
                fullPage: true
            });
            
            // Erstelle auch einen Viewport-Screenshot
            await page.screenshot({ 
                path: `${component}_viewport.png`,
                fullPage: false
            });
            
            console.log(`✅ ${component} Screenshots erstellt`);
            
        } catch (error) {
            console.error(`❌ Fehler bei ${component}: ${error.message}`);
        }
    }
    
    await browser.close();
    console.log('\n🎉 Alle Screenshots erstellt!');
}

takeScreenshots().catch(console.error);
