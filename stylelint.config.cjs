// Stylelint Configuration - Design System Guardrails
// Verhindert Hex-Farben und nicht-tokenisierte Styles
module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    // Keine !important Regeln
    "declaration-no-important": true,
    
    // Keine Hex-Farben - nur CSS-Variablen
    "color-no-hex": true,
    
    // Nur tokenisierte Werte erlauben
    "declaration-property-value-disallowed-list": {
      // Farben müssen CSS-Variablen sein
      "/^color/": ["/^((?!var\\().)*$/"],
      "/^background/": ["/^((?!var\\().)*$/"],
      "/^border-color/": ["/^((?!var\\().)*$/"],
      
      // Abstände müssen tokenisiert sein
      "/^(margin|padding)/": ["/^((?!var\\().)*$/"],
      "/^gap/": ["/^((?!var\\().)*$/"],
      
      // Border-Radius muss tokenisiert sein
      "border-radius": ["/^((?!var\\().)*$/"],
      
      // Shadows müssen tokenisiert sein
      "box-shadow": ["/^((?!var\\().)*$/"]
    },
    
    // Warnung bei nicht-standard Eigenschaften
    "property-no-unknown": true,
    
    // Konsistente Einheiten
    "unit-no-unknown": true,
    
    // Keine doppelten Selektoren
    "no-duplicate-selectors": true,
    
    // Alphabetische Reihenfolge der Eigenschaften
    "order/properties-alphabetical-order": null
  },
  
  // Ignoriere bestimmte Dateien
  ignoreFiles: [
    "**/node_modules/**",
    "**/dist/**", 
    "**/*.stories.*",
    "**/storybook-static/**"
  ]
};
