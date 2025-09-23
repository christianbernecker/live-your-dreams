const { chromium } = require('playwright');
const fs = require('fs');

async function analyzeComponentContent() {
    console.log('📋 INHALTLICHER VERGLEICH ALLER 25 KOMPONENTEN');
    console.log('='.repeat(70));
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const components = [
        'inputs', 'radio', 'checkbox', 'textarea', 'switch', 'slider', 
        'alert', 'badge', 'datepicker', 'avatar', 'navbar', 'tabs',
        'progress', 'calendar', 'autocomplete', 'pagination', 'tooltip',
        'dropdown', 'modal', 'table', 'typography', 'buttons', 
        'cards', 'accordion', 'toast'
    ];
    
    const contentAnalysis = {
        components: [],
        inconsistencies: [],
        patterns: {
            sectionCounts: {},
            germanWords: {},
            realEstateContent: {},
            apiReferences: {}
        }
    };
    
    console.log('\n🔍 Analysiere Inhaltsstruktur jeder Komponente...\n');
    
    for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        const url = `http://designsystem.liveyourdreams.online/components/${comp}/`;
        
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            
            // Strukturanalyse
            const sections = await page.$$eval('.section', els => els.length);
            const sectionTitles = await page.$$eval('.section-title', els => els.map(el => el.textContent.trim()));
            const hasHtmlUsage = await page.$eval('body', el => el.textContent.includes('HTML Usage'));
            const hasNextJs = await page.$eval('body', el => el.textContent.includes('Next.js Integration'));
            const hasApiReference = await page.$eval('body', el => el.textContent.includes('API Reference'));
            const hasAccessibility = await page.$eval('body', el => el.textContent.includes('Accessibility & Best Practices'));
            
            // Deutsche Wörter zählen
            const bodyText = await page.$eval('body', el => el.textContent);
            const germanWordCount = (bodyText.match(/\b(fuer|mit|und|der|die|das|für|über|dass|ist|sind|haben|wird|werden|können|müssen|soll|sollte|möchte|würde|gegen|durch|ohne|nach|vor|bei|zu|vom|zum|zur|im|am|an|auf|in|von|bis|seit)\b/gi) || []).length;
            
            // Real Estate Content
            const realEstateCount = (bodyText.match(/\b(property|real estate|immobilien|wohnung|haus|villa|apartment|viewing|besichtigung|miete|kauf|verkauf|makler|agent)\b/gi) || [].length);
            
            // API Reference Details
            let apiClasses = 0;
            try {
                apiClasses = await page.$$eval('.api-table tbody tr', rows => rows.length);
            } catch (e) {
                apiClasses = 0;
            }
            
            const componentData = {
                name: comp,
                url: url,
                structure: {
                    sections: sections,
                    sectionTitles: sectionTitles,
                    hasHtmlUsage: hasHtmlUsage,
                    hasNextJs: hasNextJs,
                    hasApiReference: hasApiReference,
                    hasAccessibility: hasAccessibility
                },
                content: {
                    germanWords: germanWordCount,
                    realEstateReferences: realEstateCount,
                    apiClasses: apiClasses
                }
            };
            
            contentAnalysis.components.push(componentData);
            
            // Sammle Muster
            contentAnalysis.patterns.sectionCounts[sections] = (contentAnalysis.patterns.sectionCounts[sections] || 0) + 1;
            contentAnalysis.patterns.germanWords[comp] = germanWordCount;
            contentAnalysis.patterns.realEstateContent[comp] = realEstateCount;
            contentAnalysis.patterns.apiReferences[comp] = apiClasses;
            
            // Ausgabe pro Komponente
            const status = [
                hasHtmlUsage ? '✅' : '❌',
                hasNextJs ? '✅' : '❌', 
                hasApiReference ? '✅' : '❌',
                hasAccessibility ? '✅' : '❌'
            ].join(' ');
            
            console.log(`${(i+1).toString().padStart(2)}/25 ${comp.padEnd(12)} | Sections: ${sections} | ${status} | DE: ${germanWordCount.toString().padStart(3)} | RE: ${realEstateCount.toString().padStart(2)} | API: ${apiClasses.toString().padStart(2)}`);
            
        } catch (error) {
            console.error(`❌ Fehler bei ${comp}: ${error.message}`);
        }
    }
    
    await browser.close();
    
    // KONSISTENZ-ANALYSE
    console.log('\n📊 KONSISTENZ-ANALYSE:');
    console.log('='.repeat(50));
    
    // Section-Verteilung
    console.log('\n📋 Section-Verteilung:');
    Object.entries(contentAnalysis.patterns.sectionCounts).sort((a,b) => b[1] - a[1]).forEach(([count, components]) => {
        console.log(`${count} Sections: ${components} Komponenten`);
    });
    
    // Deutsche Wörter Statistik
    const germanWordValues = Object.values(contentAnalysis.patterns.germanWords);
    const avgGerman = germanWordValues.reduce((a,b) => a+b, 0) / germanWordValues.length;
    const maxGerman = Math.max(...germanWordValues);
    const minGerman = Math.min(...germanWordValues);
    
    console.log(`\n🇩🇪 Deutsche Wörter: Ø ${avgGerman.toFixed(1)} | Min: ${minGerman} | Max: ${maxGerman}`);
    
    // Top 5 mit meisten deutschen Wörtern
    const topGerman = Object.entries(contentAnalysis.patterns.germanWords)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 5);
    console.log('Top 5 mit meisten deutschen Wörtern:');
    topGerman.forEach(([comp, count], index) => {
        console.log(`${index + 1}. ${comp}: ${count} deutsche Wörter`);
    });
    
    // Real Estate Content Statistik
    const realEstateValues = Object.values(contentAnalysis.patterns.realEstateContent);
    const avgRealEstate = realEstateValues.reduce((a,b) => a+b, 0) / realEstateValues.length;
    console.log(`\n🏠 Real Estate Referenzen: Ø ${avgRealEstate.toFixed(1)} pro Komponente`);
    
    // Speichere detaillierte Analyse
    fs.writeFileSync('content-analysis-report.json', JSON.stringify(contentAnalysis, null, 2));
    console.log('\n📄 Detaillierte Inhaltsanalyse gespeichert: content-analysis-report.json');
    
    return contentAnalysis;
}

// Führe Analyse aus
analyzeComponentContent().catch(console.error);
