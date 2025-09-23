const fs = require('fs');
const path = require('path');

// Analyse-Funktionen für visuellen Vergleich
async function analyzeComponentScreenshots() {
    console.log('🔍 VISUELLER UND INHALTLICHER VERGLEICH ALLER 25 KOMPONENTEN');
    console.log('='.repeat(70));
    
    const components = [
        'inputs', 'radio', 'checkbox', 'textarea', 'switch', 'slider', 
        'alert', 'badge', 'datepicker', 'avatar', 'navbar', 'tabs',
        'progress', 'calendar', 'autocomplete', 'pagination', 'tooltip',
        'dropdown', 'modal', 'table', 'typography', 'buttons', 
        'cards', 'accordion', 'toast'
    ];
    
    const analysis = {
        fileAnalysis: [],
        consistencyIssues: [],
        visualPatterns: [],
        recommendations: []
    };
    
    // 1. DATEI-ANALYSE
    console.log('\n📊 1. DATEI-GRÖSSEN ANALYSE:');
    for (const comp of components) {
        const fullPath = `${comp}_full.png`;
        const viewportPath = `${comp}_viewport.png`;
        
        if (fs.existsSync(fullPath) && fs.existsSync(viewportPath)) {
            const fullStats = fs.statSync(fullPath);
            const viewportStats = fs.statSync(viewportPath);
            
            const fullSizeMB = (fullStats.size / 1024 / 1024).toFixed(2);
            const viewportSizeMB = (viewportStats.size / 1024 / 1024).toFixed(2);
            const ratio = (fullStats.size / viewportStats.size).toFixed(1);
            
            analysis.fileAnalysis.push({
                component: comp,
                fullSize: parseFloat(fullSizeMB),
                viewportSize: parseFloat(viewportSizeMB),
                ratio: parseFloat(ratio)
            });
            
            console.log(`${comp.padEnd(12)} | Full: ${fullSizeMB.padStart(5)}MB | Viewport: ${viewportSizeMB.padStart(5)}MB | Ratio: ${ratio}x`);
        }
    }
    
    // 2. KONSISTENZ-ANALYSE
    console.log('\n🔍 2. KONSISTENZ-ANALYSE:');
    const avgFullSize = analysis.fileAnalysis.reduce((sum, item) => sum + item.fullSize, 0) / analysis.fileAnalysis.length;
    const avgViewportSize = analysis.fileAnalysis.reduce((sum, item) => sum + item.viewportSize, 0) / analysis.fileAnalysis.length;
    const avgRatio = analysis.fileAnalysis.reduce((sum, item) => sum + item.ratio, 0) / analysis.fileAnalysis.length;
    
    console.log(`Durchschnitt - Full: ${avgFullSize.toFixed(2)}MB | Viewport: ${avgViewportSize.toFixed(2)}MB | Ratio: ${avgRatio.toFixed(1)}x`);
    
    // Identifiziere Ausreißer
    analysis.fileAnalysis.forEach(item => {
        if (item.fullSize > avgFullSize * 1.5) {
            analysis.consistencyIssues.push(`${item.component}: Überdurchschnittlich große Full-Page (${item.fullSize}MB vs ${avgFullSize.toFixed(2)}MB Durchschnitt)`);
        }
        if (item.ratio > avgRatio * 1.3) {
            analysis.consistencyIssues.push(`${item.component}: Ungewöhnlich hohe Ratio (${item.ratio}x vs ${avgRatio.toFixed(1)}x Durchschnitt) - möglicherweise sehr lange Seite`);
        }
        if (item.viewportSize > avgViewportSize * 1.3) {
            analysis.consistencyIssues.push(`${item.component}: Große Viewport-Size (${item.viewportSize}MB) - möglicherweise komplexe Visualisierung`);
        }
    });
    
    // 3. VISUELLE MUSTER ERKENNEN
    console.log('\n🎨 3. VISUELLE MUSTER:');
    
    // Sortiere nach Dateigröße für Muster
    const sortedByFullSize = [...analysis.fileAnalysis].sort((a, b) => b.fullSize - a.fullSize);
    const sortedByRatio = [...analysis.fileAnalysis].sort((a, b) => b.ratio - a.ratio);
    
    console.log('Größte Full-Page Screenshots (möglicherweise umfangreichste Komponenten):');
    sortedByFullSize.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.component}: ${item.fullSize}MB`);
    });
    
    console.log('\nHöchste Ratios (längste Seiten):');
    sortedByRatio.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.component}: ${item.ratio}x (Full: ${item.fullSize}MB)`);
    });
    
    // 4. EMPFEHLUNGEN
    console.log('\n💡 4. EMPFEHLUNGEN:');
    
    if (analysis.consistencyIssues.length > 0) {
        console.log('Identifizierte Konsistenz-Probleme:');
        analysis.consistencyIssues.forEach(issue => console.log(`⚠️  ${issue}`));
    } else {
        console.log('✅ Keine großen Konsistenz-Probleme bei Dateigrößen erkannt');
    }
    
    // Speichere Analyse
    const reportPath = 'visual-comparison-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
    console.log(`\n📄 Detaillierte Analyse gespeichert: ${reportPath}`);
    
    return analysis;
}

// Führe Analyse aus
analyzeComponentScreenshots().catch(console.error);
