/**
 * Live Your Dreams - Force Consistency Script
 * Garantiert einheitliches Styling durch JavaScript-Injection
 * Version: 2.3.0
 */

(function() {
  'use strict';
  
  // Warte bis DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyConsistentStyling);
  } else {
    applyConsistentStyling();
  }
  
  function applyConsistentStyling() {
    console.log('🎯 LYD Design System: Forcing consistent styling...');
    
    // 1. Force Accessibility Grid Layout
    const accessibilityGrids = document.querySelectorAll('.accessibility-grid');
    accessibilityGrids.forEach(grid => {
      grid.style.cssText = `
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 24px !important;
        margin: 32px 0 !important;
        padding: 32px !important;
        background: #E8F0FE !important;
        border-radius: 8px !important;
        border: none !important;
      `;
      // Entferne evtl. inline width der Items, die Grid auf fixe Pixel spreizen
      grid.querySelectorAll('*').forEach(el => {
        el.style.maxWidth = 'none';
        el.style.width = 'auto';
      });
    });
    
    // 2. Force Accessibility Items
    const accessibilityItems = document.querySelectorAll('.accessibility-item');
    accessibilityItems.forEach(item => {
      item.style.cssText = `
        background: white !important;
        padding: 20px !important;
        border-radius: 6px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        border: none !important;
        margin: 0 !important;
        transition: all 0.3s ease !important;
      `;
      
      // Force h4 styling
      const h4 = item.querySelector('h4');
      if (h4) {
        h4.style.cssText = `
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #111111 !important;
          margin-bottom: 12px !important;
          margin-top: 0 !important;
        `;
      }
      
      // Force list styling
      const ul = item.querySelector('ul');
      if (ul) {
        ul.style.cssText = `
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        `;
        
        const lis = ul.querySelectorAll('li');
        lis.forEach(li => {
          li.style.cssText = `
            padding: 4px 0 !important;
            color: #666666 !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 8px !important;
            margin: 0 !important;
          `;
        });
      }
    });
    
    // 3. Force Page Title Styling
    const pageTitles = document.querySelectorAll('.page-title, main h1');
    pageTitles.forEach(title => {
      if (title.classList.contains('page-title') || title.tagName === 'H1') {
        title.style.cssText = `
          font-size: 48px !important;
          font-weight: 400 !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          letter-spacing: 6px !important;
          margin-bottom: 16px !important;
          background: linear-gradient(180deg, #3366CC 0%, #000066 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          text-transform: uppercase !important;
          color: transparent !important;
        `;
      }
    });
    
    // 4. Responsive Grid
    function applyResponsiveGrid() {
      const width = window.innerWidth;
      accessibilityGrids.forEach(grid => {
        if (width <= 768) {
          grid.style.gridTemplateColumns = '1fr !important';
          grid.style.padding = '16px !important';
          grid.style.gap = '16px !important';
        } else if (width <= 1200) {
          grid.style.gridTemplateColumns = 'repeat(2, 1fr) !important';
        } else {
          grid.style.gridTemplateColumns = 'repeat(4, 1fr) !important';
        }
      });
    }
    
    // Apply responsive grid on resize
    window.addEventListener('resize', applyResponsiveGrid);
    applyResponsiveGrid();
    
    console.log('✅ LYD Design System: Consistent styling applied');
  }
  
  // 5. CRITICAL: Force Button Styles
  const buttons = document.querySelectorAll('.lyd-button');
  buttons.forEach(button => {
    // Base Button Styles
    button.style.cssText = `
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      padding: 0 16px !important;
      height: 40px !important;
      border: none !important;
      border-radius: 6px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
      overflow: hidden !important;
      background: #f3f4f6 !important;
      color: #374151 !important;
    `;
    
    // Primary Variant
    if (button.classList.contains('primary')) {
      button.style.cssText += `
        background: linear-gradient(135deg, #3366CC 0%, #0052CC 100%) !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(51, 102, 204, 0.3) !important;
      `;
    }
    
    // Secondary Variant
    if (button.classList.contains('secondary')) {
      button.style.cssText += `
        background: transparent !important;
        color: #3366CC !important;
        border: 1px solid #3366CC !important;
      `;
    }
    
    // Error Variant
    if (button.classList.contains('error')) {
      button.style.cssText += `
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3) !important;
      `;
    }
    
    // Ghost Variant
    if (button.classList.contains('ghost')) {
      button.style.cssText += `
        background: transparent !important;
        color: #6b7280 !important;
      `;
    }
    
    // Copy Variant
    if (button.classList.contains('copy')) {
      button.style.cssText += `
        position: absolute !important;
        top: 16px !important;
        right: 16px !important;
        background: rgba(255, 255, 255, 0.1) !important;
        color: #374151 !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        backdrop-filter: blur(4px) !important;
      `;
    }
  });

  // CSS-Injection als Backup
  const style = document.createElement('style');
  style.textContent = `
    /* LYD Design System - Force Consistency */
    .accessibility-item li:before {
      content: "✓" !important;
      color: #3366CC !important;
      font-weight: bold !important;
      margin-right: 8px !important;
    }
    
    /* Button Styles - CSS Backup */
    .lyd-button {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      padding: 0 16px !important;
      height: 40px !important;
      border: none !important;
      border-radius: 6px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
      overflow: hidden !important;
      background: #f3f4f6 !important;
      color: #374151 !important;
    }
    
    .lyd-button.primary {
      background: linear-gradient(135deg, #3366CC 0%, #0052CC 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(51, 102, 204, 0.3) !important;
    }
    
    .lyd-button.secondary {
      background: transparent !important;
      color: #3366CC !important;
      border: 1px solid #3366CC !important;
    }
    
    .lyd-button.error {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3) !important;
    }
    
    .lyd-button.ghost {
      background: transparent !important;
      color: #6b7280 !important;
    }
    
    .lyd-button.copy {
      position: absolute !important;
      top: 16px !important;
      right: 16px !important;
      background: rgba(255, 255, 255, 0.1) !important;
      color: #374151 !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      backdrop-filter: blur(4px) !important;
    }
  `;
  document.head.appendChild(style);
  
})();
