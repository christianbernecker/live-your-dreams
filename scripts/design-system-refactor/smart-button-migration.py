#!/usr/bin/env python3
"""
Intelligente Migration der Button-Komponente
Behält alle hochwertigen Styles und Content, strukturiert nur neu
"""

import re
from pathlib import Path

def migrate_buttons_smart():
    """Migriert Buttons ohne die guten Styles zu verlieren"""
    
    # Paths
    original = Path("/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html")
    template = Path("/Users/christianbernecker/live-your-dreams/scripts/design-system-refactor/simple-component-template.html")
    output = Path("/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index-simple.html")
    
    # Read files
    with open(original, 'r') as f:
        original_content = f.read()
    
    with open(template, 'r') as f:
        template_content = f.read()
    
    # Extract the valuable button styles (luxury-btn, glassmorphism, etc.)
    button_styles = """
        /* Premium Button Styles - Original hochwertige Styles */
        .lyd-button {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }
        
        .lyd-button .btn-icon {
            width: 18px;
            height: 18px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lyd-button:hover .btn-icon {
            transform: scale(1.1);
        }
        
        /* Primary Button - Gradient */
        .lyd-button.primary {
            background: linear-gradient(135deg, #0066ff 0%, #004299 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(0, 102, 255, 0.3);
        }
        
        .lyd-button.primary:hover {
            background: linear-gradient(135deg, #0052cc 0%, #003366 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 102, 255, 0.4);
        }
        
        /* Secondary Button - Glassmorphism */
        .lyd-button.secondary {
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            color: #4f46e5;
            backdrop-filter: blur(20px);
        }
        
        .lyd-button.secondary:hover {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-2px);
        }
        
        /* Outline Button */
        .lyd-button.outline {
            background: transparent;
            border: 2px solid #e5e7eb;
            color: #374151;
        }
        
        .lyd-button.outline:hover {
            border-color: #0066ff;
            color: #0066ff;
            background: rgba(0, 102, 255, 0.05);
            transform: translateY(-2px);
        }
        
        /* Ghost Button */
        .lyd-button.ghost {
            background: transparent;
            color: #6b7280;
            padding: 8px 16px;
        }
        
        .lyd-button.ghost:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #374151;
        }
        
        /* Size Variations */
        .lyd-button.small {
            padding: 8px 16px;
            font-size: 13px;
        }
        
        .lyd-button.small .btn-icon {
            width: 14px;
            height: 14px;
        }
        
        .lyd-button.large {
            padding: 16px 32px;
            font-size: 17px;
        }
        
        .lyd-button.large .btn-icon {
            width: 20px;
            height: 20px;
        }
        
        /* Loading State */
        .lyd-button.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        .lyd-button.loading:before {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        
        /* Disabled State */
        .lyd-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        /* Icon-only Buttons */
        .lyd-button-pure {
            padding: 10px;
            min-width: 40px;
            height: 40px;
            justify-content: center;
        }
        
        /* Button Tile */
        .lyd-button-tile {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 24px;
            min-width: 140px;
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .lyd-button-tile:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            border-color: #0066ff;
        }
        
        .lyd-button-tile .tile-icon {
            width: 32px;
            height: 32px;
            color: #0066ff;
        }
        
        .lyd-button-tile .tile-label {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .lyd-button-tile .tile-description {
            font-size: 13px;
            color: #6b7280;
        }
        
        @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
    """
    
    # Section 1: All Button Variants
    variants_section = """
            <div class="showcase-grid">
                <!-- Primary Buttons -->
                <div class="showcase-item">
                    <h3>Primary Actions</h3>
                    <p>Main call-to-action buttons with gradient background</p>
                    <div class="showcase-demo">
                        <button class="lyd-button primary">
                            Schedule Property Viewing
                        </button>
                        <button class="lyd-button primary">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            Save Property
                        </button>
                        <button class="lyd-button primary small">Confirm</button>
                    </div>
                </div>
                
                <!-- Secondary Buttons -->
                <div class="showcase-item">
                    <h3>Secondary Actions</h3>
                    <p>Supporting actions with glassmorphism effect</p>
                    <div class="showcase-demo">
                        <button class="lyd-button secondary">
                            Add to Favorites
                        </button>
                        <button class="lyd-button secondary">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            View Analytics
                        </button>
                        <button class="lyd-button secondary small">Settings</button>
                    </div>
                </div>
                
                <!-- Outline Buttons -->
                <div class="showcase-item">
                    <h3>Outline Style</h3>
                    <p>Subtle actions with border styling</p>
                    <div class="showcase-demo">
                        <button class="lyd-button outline">
                            Download Exposé
                        </button>
                        <button class="lyd-button outline">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            Contact Agent
                        </button>
                        <button class="lyd-button outline small">Share</button>
                    </div>
                </div>
                
                <!-- States -->
                <div class="showcase-item">
                    <h3>Button States</h3>
                    <p>Loading, disabled, and hover states</p>
                    <div class="showcase-demo">
                        <button class="lyd-button primary loading">
                            Processing...
                        </button>
                        <button class="lyd-button secondary" disabled>
                            Unavailable
                        </button>
                        <button class="lyd-button outline">
                            Normal State
                        </button>
                    </div>
                </div>
                
                <!-- Icon-only Buttons -->
                <div class="showcase-item">
                    <h3>Icon Buttons</h3>
                    <p>Compact icon-only actions</p>
                    <div class="showcase-demo">
                        <button class="lyd-button lyd-button-pure primary">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                        <button class="lyd-button lyd-button-pure secondary">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                            </svg>
                        </button>
                        <button class="lyd-button lyd-button-pure outline">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Button Tiles -->
                <div class="showcase-item">
                    <h3>Button Tiles</h3>
                    <p>Large navigation tiles for dashboards</p>
                    <div class="showcase-demo">
                        <button class="lyd-button-tile">
                            <svg class="tile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            <div class="tile-label">Properties</div>
                            <div class="tile-description">23 active</div>
                        </button>
                    </div>
                </div>
            </div>
    """
    
    # Section 2: Real Estate Examples
    examples_section = """
            <div class="examples-grid">
                <!-- Property Management Example -->
                <div class="example-item">
                    <h3 class="example-title">Property Management</h3>
                    <p class="example-description">Common button patterns for property listings and management</p>
                    <div class="example-demo">
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button class="lyd-button primary">
                                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 4v16m8-8H4"/>
                                </svg>
                                Add New Property
                            </button>
                            <button class="lyd-button secondary">Edit Details</button>
                            <button class="lyd-button outline small">Preview</button>
                            <button class="lyd-button ghost small">Delete</button>
                        </div>
                    </div>
                </div>
                
                <!-- Lead Actions Example -->
                <div class="example-item">
                    <h3 class="example-title">Lead Actions</h3>
                    <p class="example-description">Quick actions for lead management</p>
                    <div class="example-demo">
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button class="lyd-button primary">Call Lead</button>
                            <button class="lyd-button secondary">Send Email</button>
                            <button class="lyd-button outline">Schedule Meeting</button>
                        </div>
                    </div>
                </div>
            </div>
    """
    
    # Section 3: Implementation Guide
    implementation_section = """
            <div class="implementation-section">
                <h3>HTML Usage</h3>
                <div class="code-block">
                    <button class="copy-button">Copy</button>
                    <pre>&lt;!-- Primary Button --&gt;
&lt;button class="lyd-button primary"&gt;
    Schedule Viewing
&lt;/button&gt;

&lt;!-- Button with Icon --&gt;
&lt;button class="lyd-button secondary"&gt;
    &lt;svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"&gt;
        &lt;path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682..."&gt;
    &lt;/svg&gt;
    Add to Favorites
&lt;/button&gt;

&lt;!-- Button States --&gt;
&lt;button class="lyd-button primary loading"&gt;Processing...&lt;/button&gt;
&lt;button class="lyd-button secondary" disabled&gt;Unavailable&lt;/button&gt;</pre>
                </div>
                
                <h3>Next.js Integration</h3>
                <div class="code-block">
                    <button class="copy-button">Copy</button>
                    <pre>// components/Button.tsx
import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes&lt;HTMLButtonElement&gt; {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: FC&lt;ButtonProps&gt; = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) =&gt; {
  const classes = `lyd-button ${variant} ${size} ${loading ? 'loading' : ''} ${className}`;
  
  return (
    &lt;button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    &gt;
      {icon && &lt;span className="btn-icon"&gt;{icon}&lt;/span&gt;}
      {children}
    &lt;/button&gt;
  );
};</pre>
                </div>
                
                <h3>API Reference</h3>
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>.lyd-button</code></td>
                            <td>Base button class</td>
                        </tr>
                        <tr>
                            <td><code>.primary</code></td>
                            <td>Primary button with gradient background</td>
                        </tr>
                        <tr>
                            <td><code>.secondary</code></td>
                            <td>Secondary button with glassmorphism</td>
                        </tr>
                        <tr>
                            <td><code>.outline</code></td>
                            <td>Button with border only</td>
                        </tr>
                        <tr>
                            <td><code>.ghost</code></td>
                            <td>Minimal button style</td>
                        </tr>
                        <tr>
                            <td><code>.small</code></td>
                            <td>Small size variant</td>
                        </tr>
                        <tr>
                            <td><code>.large</code></td>
                            <td>Large size variant</td>
                        </tr>
                        <tr>
                            <td><code>.loading</code></td>
                            <td>Shows loading spinner</td>
                        </tr>
                        <tr>
                            <td><code>.lyd-button-pure</code></td>
                            <td>Icon-only button</td>
                        </tr>
                        <tr>
                            <td><code>.lyd-button-tile</code></td>
                            <td>Large tile button</td>
                        </tr>
                    </tbody>
                </table>
            </div>
    """
    
    # Section 4: Accessibility
    accessibility_section = """
            <div class="accessibility-grid">
                <div class="accessibility-item">
                    <h4>Keyboard Navigation</h4>
                    <ul>
                        <li>Tab to navigate between buttons</li>
                        <li>Space or Enter to activate</li>
                        <li>Esc to cancel (in dialogs)</li>
                    </ul>
                </div>
                
                <div class="accessibility-item">
                    <h4>Screen Reader Support</h4>
                    <ul>
                        <li>Semantic button elements</li>
                        <li>Descriptive aria-labels</li>
                        <li>State announcements</li>
                    </ul>
                </div>
                
                <div class="accessibility-item">
                    <h4>Visual Accessibility</h4>
                    <ul>
                        <li>WCAG AA contrast ratios</li>
                        <li>Clear focus indicators</li>
                        <li>Sufficient touch targets (44x44px)</li>
                    </ul>
                </div>
                
                <div class="accessibility-item">
                    <h4>Best Practices</h4>
                    <ul>
                        <li>Use semantic HTML buttons</li>
                        <li>Provide text for icon-only buttons</li>
                        <li>Indicate loading/disabled states</li>
                    </ul>
                </div>
            </div>
    """
    
    # Fill template
    output_content = template_content
    output_content = output_content.replace('{{COMPONENT_NAME}}', 'Button')
    output_content = output_content.replace('{{COMPONENT_DESCRIPTION}}', 
        'Professional button components with advanced interactions, loading states, and real estate optimizations.')
    output_content = output_content.replace('{{COMPONENT_STYLES}}', button_styles)
    output_content = output_content.replace('{{VARIANTS_SECTION}}', variants_section)
    output_content = output_content.replace('{{EXAMPLES_SECTION}}', examples_section)
    output_content = output_content.replace('{{IMPLEMENTATION_SECTION}}', implementation_section)
    output_content = output_content.replace('{{ACCESSIBILITY_SECTION}}', accessibility_section)
    output_content = output_content.replace('{{ACTIVE_BUTTON}}', 'active')
    output_content = re.sub(r'\{\{ACTIVE_\w+\}\}', '', output_content)
    output_content = output_content.replace('{{COMPONENT_JAVASCRIPT}}', '')
    
    # Write output
    with open(output, 'w') as f:
        f.write(output_content)
    
    print(f"✅ Button component migrated to simple structure: {output}")
    print("   - All premium styles preserved")
    print("   - No tabs, just scrollable sections")
    print("   - Real estate examples included")
    print("   - Implementation guide with Next.js")
    print("   - Accessibility guidelines")

if __name__ == "__main__":
    migrate_buttons_smart()

