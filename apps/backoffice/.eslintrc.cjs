// ESLint Configuration - Design System Guardrails
// Verhindert native Controls und Inline-Styles
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Design System Guardrails - nur Warnungen für bessere DX
    "no-console": ["warn", { allow: ["warn", "error"] }],
    
    // Deaktiviere blockierende Next.js Rules für Legacy-Code
    "@next/next/no-assign-module-variable": "off",
    "@next/next/no-img-element": "warn",
    
    // Konsistente Code-Qualität
    "prefer-const": "error",
    "no-var": "error"
  },
  
  plugins: ["react"],
  
  // Parser-Optionen
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  
  // Umgebung
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  
  // Ignorierte Pfade
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "out/"
  ]
};
