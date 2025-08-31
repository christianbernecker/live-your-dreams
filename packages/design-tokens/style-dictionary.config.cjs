module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: { 
      transformGroup: 'css', 
      buildPath: 'dist/css/', 
      files: [{ 
        destination: 'tokens.css', 
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }] 
    },
    ts: { 
      transformGroup: 'js', 
      buildPath: 'dist/ts/', 
      files: [{ 
        destination: 'tokens.ts', 
        format: 'javascript/es6' 
      }] 
    }
  }
};
