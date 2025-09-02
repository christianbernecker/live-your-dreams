// Live Your Dreams Component Configurator
// Professional Interactive Interface like Porsche Design System

class LydConfigurator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      component: 'button',
      props: {
        variant: 'primary',
        size: 'medium',
        disabled: false,
        loading: false
      }
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('change', (e) => {
      const { name, value, type, checked } = e.target;
      
      if (type === 'checkbox') {
        this.state.props[name] = checked;
      } else {
        this.state.props[name] = value;
      }
      
      this.updatePreview();
      this.updateCode();
    });
  }

  updatePreview() {
    const preview = this.shadowRoot.querySelector('.preview-area');
    const { component, props } = this.state;
    
    if (component === 'button') {
      const attributes = Object.entries(props)
        .filter(([key, value]) => {
          if (typeof value === 'boolean') return value;
          return value && value !== 'medium' && value !== 'primary';
        })
        .map(([key, value]) => {
          if (typeof value === 'boolean') return key;
          return `${key}="${value}"`;
        })
        .join(' ');
      
      preview.innerHTML = `
        <lyd-button ${attributes}>
          ${props.loading ? 'Processing...' : 'Schedule Viewing'}
        </lyd-button>
      `;
    }
  }

  updateCode() {
    const codeArea = this.shadowRoot.querySelector('.code-preview');
    const { component, props } = this.state;
    
    // Generate code for Next.js (our primary framework)
    const nextjsCode = this.generateNextjsCode(component, props);
    const vanillaCode = this.generateVanillaCode(component, props);
    
    codeArea.innerHTML = `
      <div class="code-tabs">
        <button class="code-tab active" data-framework="nextjs">Next.js</button>
        <button class="code-tab" data-framework="vanilla">Web Component</button>
      </div>
      
      <div class="code-content">
        <pre class="code-block active" data-framework="nextjs"><code>${nextjsCode}</code></pre>
        <pre class="code-block" data-framework="vanilla"><code>${vanillaCode}</code></pre>
      </div>
      
      <button class="copy-button" onclick="this.getRootNode().host.copyCode()">
        📋 Copy Code
      </button>
    `;
    
            // Setup tab switching
        this.shadowRoot.querySelectorAll('.code-tab').forEach(tab => {
          tab.addEventListener('click', (e) => {
            const framework = e.target.dataset.framework;
            
            // Update active states
            this.shadowRoot.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            this.shadowRoot.querySelectorAll('.code-block').forEach(b => b.classList.remove('active'));
            
            e.target.classList.add('active');
            this.shadowRoot.querySelector(`[data-framework="${framework}"]`).classList.add('active');
          });
        });
      }

  generateNextjsCode(component, props) {
    const propsStr = Object.entries(props)
      .filter(([key, value]) => {
        if (typeof value === 'boolean') return value;
        return value && value !== 'medium' && value !== 'primary';
      })
      .map(([key, value]) => {
        if (typeof value === 'boolean') return `      ${key}`;
        return `      ${key}="${value}"`;
      })
      .join('\\n');

    return `'use client';

import { useEffect } from 'react';

export default function PropertyPage() {
  useEffect(() => {
    // Load LYD Design System components
    import('@liveyourdreams/design-system');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Property Management
      </h1>
      
      <lyd-${component}${propsStr ? '\\n' + propsStr : ''}>
        ${props.loading ? 'Processing...' : 'Schedule Viewing'}
      </lyd-${component}>
    </div>
  );
}`;
  }

  generateVanillaCode(component, props) {
    const attributes = Object.entries(props)
      .filter(([key, value]) => {
        if (typeof value === 'boolean') return value;
        return value && value !== 'medium' && value !== 'primary';
      })
      .map(([key, value]) => {
        if (typeof value === 'boolean') return `  ${key}`;
        return `  ${key}="${value}"`;
      })
      .join('\\n');

    return `&lt;!doctype html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;script type="module" src="lyd-components.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;lyd-${component}${attributes ? '\\n' + attributes : ''}&gt;
  ${props.loading ? 'Processing...' : 'Schedule Viewing'}
&lt;/lyd-${component}&gt;

&lt;/body&gt;
&lt;/html&gt;`;
  }



  copyCode() {
    const activeCode = this.shadowRoot.querySelector('.code-block.active code');
    if (activeCode) {
      const text = activeCode.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const button = this.shadowRoot.querySelector('.copy-button');
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = '📋 Copy Code';
        }, 2000);
      });
    }
  }

  render() {
    const { props } = this.state;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .configurator {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }
        
        .controls-panel {
          padding: 32px;
          background: #f8fafc;
          border-right: 1px solid #e5e7eb;
        }
        
        .preview-panel {
          padding: 32px;
          display: flex;
          flex-direction: column;
        }
        
        .panel-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 24px 0;
        }
        
        .control-group {
          margin-bottom: 24px;
        }
        
        .control-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .control-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          color: #1f2937;
        }
        
        .control-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .control-checkbox input {
          width: 16px;
          height: 16px;
          accent-color: #0066ff;
        }
        
        .preview-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          margin-bottom: 24px;
          min-height: 200px;
          position: relative;
        }
        
        .preview-area::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(0, 102, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 66, 153, 0.1) 0%, transparent 50%);
          border-radius: 12px;
          pointer-events: none;
        }
        
        .code-preview {
          background: #1e293b;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        
        .code-tabs {
          display: flex;
          background: #334155;
          padding: 0;
          margin: 0;
          border-bottom: 1px solid #475569;
        }
        
        .code-tab {
          padding: 12px 20px;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .code-tab:hover {
          background: #475569;
          color: #e2e8f0;
        }
        
        .code-tab.active {
          background: #1e293b;
          color: #e2e8f0;
          position: relative;
        }
        
        .code-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #0066ff;
        }
        
        .code-content {
          position: relative;
        }
        
        .code-block {
          display: none;
          margin: 0;
          padding: 20px;
          color: #e2e8f0;
          font-family: "JetBrains Mono", "Fira Code", monospace;
          font-size: 13px;
          line-height: 1.6;
          overflow-x: auto;
        }
        
        .code-block.active {
          display: block;
        }
        
        .copy-button {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          background: rgba(0, 102, 255, 0.1);
          border: 1px solid rgba(0, 102, 255, 0.3);
          border-radius: 6px;
          color: #0066ff;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .copy-button:hover {
          background: rgba(0, 102, 255, 0.2);
          border-color: rgba(0, 102, 255, 0.5);
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .configurator {
            grid-template-columns: 1fr;
          }
          
          .controls-panel {
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
          }
        }
      </style>
      
      <div class="configurator">
        <div class="controls-panel">
          <h3 class="panel-title">Properties</h3>
          
          <div class="control-group">
            <label class="control-label">Variant</label>
            <select class="control-select" name="variant">
              <option value="primary" ${props.variant === 'primary' ? 'selected' : ''}>Primary</option>
              <option value="secondary" ${props.variant === 'secondary' ? 'selected' : ''}>Secondary</option>
              <option value="outline" ${props.variant === 'outline' ? 'selected' : ''}>Outline</option>
              <option value="ghost" ${props.variant === 'ghost' ? 'selected' : ''}>Ghost</option>
            </select>
          </div>
          
          <div class="control-group">
            <label class="control-label">Size</label>
            <select class="control-select" name="size">
              <option value="small" ${props.size === 'small' ? 'selected' : ''}>Small</option>
              <option value="medium" ${props.size === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="large" ${props.size === 'large' ? 'selected' : ''}>Large</option>
            </select>
          </div>
          
          <div class="control-group">
            <label class="control-checkbox">
              <input type="checkbox" name="disabled" ${props.disabled ? 'checked' : ''}>
              Disabled
            </label>
            
            <label class="control-checkbox">
              <input type="checkbox" name="loading" ${props.loading ? 'checked' : ''}>
              Loading
            </label>
          </div>
          
          <div class="control-group">
            <label class="control-label">Real Estate Context</label>
            <select class="control-select" name="context">
              <option value="viewing">Schedule Viewing</option>
              <option value="favorites">Add to Favorites</option>
              <option value="download">Download Exposé</option>
              <option value="contact">Contact Agent</option>
            </select>
          </div>
        </div>
        
        <div class="preview-panel">
          <h3 class="panel-title">Preview</h3>
          
          <div class="preview-area">
            <lyd-button variant="${props.variant}" size="${props.size}" ${props.disabled ? 'disabled' : ''} ${props.loading ? 'loading' : ''}>
              ${props.loading ? 'Processing...' : 'Schedule Viewing'}
            </lyd-button>
          </div>
          
          <div class="code-preview">
            <!-- Code will be inserted here -->
          </div>
        </div>
      </div>
    `;
    
    this.updateCode();
  }
}

customElements.define('lyd-configurator', LydConfigurator);

export { LydConfigurator };
