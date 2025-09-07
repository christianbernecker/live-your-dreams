#!/usr/bin/env python3
"""
Complete rebuild of the Inputs page with proper content and structure.
"""

import os
import shutil

def rebuild_inputs_page():
    """Rebuild the inputs page completely from the button template."""
    
    # Source and target files
    button_file = '/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html'
    inputs_file = '/Users/christianbernecker/live-your-dreams/design-system/components/inputs/index.html'
    
    print("🔄 Rebuilding Inputs page from Button template...")
    
    # Read the button template
    with open(button_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace title and metadata
    content = content.replace('Button Components - LYD Design System', 'Input Components - LYD Design System')
    content = content.replace('<h1 class="page-title">Button Components</h1>', '<h1 class="page-title">Input Components</h1>')
    content = content.replace('<p class="page-subtitle">Interactive elements for user actions with luxury styling, micro-animations, and comprehensive state management.</p>', '<p class="page-subtitle">Complete input system with validation, icons, and specialized components for real estate data entry.</p>')
    
    # Update navigation active state
    content = content.replace('<a href="/components/buttons/" class="nav-item active">Button</a>', '<a href="/components/buttons/" class="nav-item">Button</a>')
    content = content.replace('<a href="/components/inputs/" class="nav-item">Input</a>', '<a href="/components/inputs/" class="nav-item active">Input</a>')
    
    # Replace Overview section
    overview_content = '''        <section class="section">
                <h2 class="section-title">Input System Overview</h2>
                
                <div class="component-grid">
                    <div class="component-card">
                        <h3>lyd-input-text</h3>
                        <p>Standard text input with luxury styling and validation</p>
                        <div class="component-showcase">
                            <input type="text" class="luxury-input" placeholder="Property title" value="Luxury Villa Munich" />
                        </div>
                    </div>
                    
                    <div class="component-card">
                        <h3>lyd-input-number</h3>
                        <p>Number input for prices, areas, and room counts</p>
                        <div class="component-showcase">
                            <input type="number" class="luxury-input" placeholder="Price in €" value="2500000" />
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-input-email</h3>
                        <p>Email input with built-in validation patterns</p>
                        <div class="component-showcase">
                            <input type="email" class="luxury-input" placeholder="Contact email" value="agent@example.com" />
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-input-search</h3>
                        <p>Search input with integrated icon and filtering</p>
                        <div class="component-showcase">
                            <div style="position: relative;">
                                <input type="search" class="luxury-input" placeholder="Search properties..." style="padding-left: 48px;" />
                                <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #6b7280;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-textarea</h3>
                        <p>Multi-line text area for descriptions and notes</p>
                        <div class="component-showcase">
                            <textarea class="luxury-input" rows="3" placeholder="Property description">Beautiful luxury villa with panoramic views and premium amenities...</textarea>
                        </div>
                    </div>

                    <div class="component-card">
                        <h3>lyd-select</h3>
                        <p>Dropdown selection with custom luxury styling</p>
                        <div class="component-showcase">
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Apartment</span>
                                    <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>'''
    
    # Replace Variants section
    variants_content = '''        <section class="section">
            <h2 class="section-title">Input Variants & States</h2>
            
            <div class="variant-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
                <div class="variant-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Default State</h3>
                    <div class="variant-showcase" style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Property Title</label>
                            <input type="text" class="luxury-input" placeholder="Enter property title" />
                        </div>
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Price Range</label>
                            <div class="luxury-select">
                                <div class="luxury-select-trigger">
                                    <span>Select price range</span>
                                    <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="variant-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Success State</h3>
                    <div class="variant-showcase" style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Property Title</label>
                            <input type="text" class="luxury-input" value="Luxury Villa Munich" style="border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);" />
                            <div style="margin-top: 6px; font-size: 13px; color: #10b981; display: flex; align-items: center; gap: 6px;">
                                <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>
                                Valid property title
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="variant-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Error State</h3>
                    <div class="variant-showcase" style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Email Address</label>
                            <input type="email" class="luxury-input" value="invalid-email" style="border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);" />
                            <div style="margin-top: 6px; font-size: 13px; color: #ef4444; display: flex; align-items: center; gap: 6px;">
                                <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                Please enter a valid email address
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="variant-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Disabled State</h3>
                    <div class="variant-showcase" style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #9ca3af;">Property ID</label>
                            <input type="text" class="luxury-input" value="AUTO-GENERATED" disabled style="background: #f9fafb; color: #9ca3af; cursor: not-allowed;" />
                        </div>
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #9ca3af;">Status</label>
                            <div class="luxury-select" style="opacity: 0.6; pointer-events: none;">
                                <div class="luxury-select-trigger" style="background: #f9fafb; color: #9ca3af;">
                                    <span>Published</span>
                                    <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="variant-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Input Sizes</h3>
                    <div class="variant-showcase" style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: #374151;">Small Input</label>
                            <input type="text" class="luxury-input" placeholder="Small input" style="padding: 10px 16px; min-height: 40px; font-size: 14px;" />
                        </div>
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Medium Input (Default)</label>
                            <input type="text" class="luxury-input" placeholder="Medium input" />
                        </div>
                        <div>
                            <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 16px; font-weight: 500; color: #374151;">Large Input</label>
                            <input type="text" class="luxury-input" placeholder="Large input" style="padding: 20px 24px; min-height: 64px; font-size: 18px;" />
                        </div>
                    </div>
                </div>
            </div>
        </section>'''
    
    # Replace Examples section
    examples_content = '''        <section class="section">
            <h2 class="section-title">Real Estate Form Examples</h2>
            
            <div class="example-card">
                <h3>Property Creation Form</h3>
                <div class="form-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Property Title *</label>
                        <input type="text" class="luxury-input" placeholder="Enter property title" required />
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Property Type *</label>
                        <div class="luxury-select">
                            <div class="luxury-select-trigger">
                                <span>Select type</span>
                                <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Price in €</label>
                        <input type="number" class="luxury-input" placeholder="0" min="0" step="1000" />
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Area in m²</label>
                        <input type="number" class="luxury-input" placeholder="0" min="1" />
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Rooms</label>
                        <input type="number" class="luxury-input" placeholder="0" min="1" max="20" />
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Contact Email</label>
                        <input type="email" class="luxury-input" placeholder="agent@example.com" />
                    </div>
                </div>
                
                <div style="margin-top: 24px;">
                    <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Property Description</label>
                    <textarea class="luxury-input" rows="4" placeholder="Describe the property features, location, and unique selling points..."></textarea>
                </div>
                
                <div style="margin-top: 24px;">
                    <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Search Location</label>
                    <div style="position: relative;">
                        <input type="search" class="luxury-input" placeholder="Search for address or area..." style="padding-left: 48px;" />
                        <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #6b7280;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </div>
                </div>
            </div>
            
            <div class="example-card">
                <h3>Search & Filter Form</h3>
                <div class="form-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    <div style="position: relative;">
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Search Properties</label>
                        <input type="search" class="luxury-input" placeholder="Villa, apartment, location..." style="padding-left: 48px;" />
                        <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #6b7280;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Min Price €</label>
                        <input type="number" class="luxury-input" placeholder="Min price" min="0" step="50000" />
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Max Price €</label>
                        <input type="number" class="luxury-input" placeholder="Max price" min="0" step="50000" />
                    </div>
                    
                    <div>
                        <label class="luxury-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151;">Property Type</label>
                        <div class="luxury-select">
                            <div class="luxury-select-trigger">
                                <span>All types</span>
                                <div class="luxury-select-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>'''
    
    # Replace API section
    api_content = '''        <section class="section api-section">
                <h2 class="section-title">Input API Reference</h2>
            
                <h3>lyd-input</h3>
            <div style="overflow-x: auto; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <thead>
                        <tr style="background: linear-gradient(135deg, #f8fafc, #e2e8f0);">
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Property</th>
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Type</th>
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Default</th>
                            <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 14px;">Description</th>
                    </tr>
                </thead>
                <tbody>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">type</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">text</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Input type: text, email, number, search, tel, url</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">size</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">medium</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Input size: small, medium, large</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">state</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">string</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">default</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Visual state: default, success, error, disabled</td>
                    </tr>
                        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafbfc;">
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">required</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Mark input as required for validation</td>
                    </tr>
                    <tr>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6;"><code style="background: #f1f5f9; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 13px;">disabled</code></td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">boolean</td>
                            <td style="padding: 16px; border-right: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">false</td>
                            <td style="padding: 16px; color: #6b7280; font-size: 14px;">Disable input interaction</td>
                    </tr>
                </tbody>
            </table>
            </div>
                
                <h3>Next.js Backoffice Integration</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// app/properties/create/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';

const PropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['apartment', 'house', 'villa', 'commercial']),
  price: z.number().min(0, 'Price must be positive'),
  area: z.number().min(1, 'Area must be positive'),
  rooms: z.number().min(1, 'At least 1 room required'),
  email: z.string().email('Invalid email format'),
  description: z.string().min(10, 'Description too short')
});

export default function CreatePropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: 0,
    area: 0,
    rooms: 1,
    email: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load LYD Design System
    import('@/lib/lyd-design-system');
  }, []);

  const validateForm = () => {
    try {
      PropertySchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const fieldErrors = {};
      error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        router.push('/properties');
      }
    } catch (error) {
      console.error('Failed to create property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    &lt;div className="min-h-screen bg-gray-50 py-8"&gt;
      &lt;div className="max-w-4xl mx-auto px-4"&gt;
        &lt;h1 className="text-3xl font-bold mb-8"&gt;Create New Property&lt;/h1&gt;
        
        &lt;form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8"&gt;
          &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-6"&gt;
            &lt;lyd-input-text
              label="Property Title"
              placeholder="Enter property title"
              required
              state={errors.title ? 'error' : 'default'}
              error-message={errors.title}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            /&gt;
            
            &lt;lyd-select
              label="Property Type"
              placeholder="Select type"
              required
              state={errors.type ? 'error' : 'default'}
              error-message={errors.type}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            &gt;
              &lt;option value="apartment"&gt;Apartment&lt;/option&gt;
              &lt;option value="house"&gt;House&lt;/option&gt;
              &lt;option value="villa"&gt;Villa&lt;/option&gt;
              &lt;option value="commercial"&gt;Commercial&lt;/option&gt;
            &lt;/lyd-select&gt;
            
            &lt;lyd-input-number
              label="Price in €"
              placeholder="0"
              min="0"
              step="1000"
              state={errors.price ? 'error' : 'default'}
              error-message={errors.price}
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
            /&gt;
            
            &lt;lyd-input-number
              label="Area in m²"
              placeholder="0"
              min="1"
              state={errors.area ? 'error' : 'default'}
              error-message={errors.area}
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: parseInt(e.target.value)})}
            /&gt;
          &lt;/div&gt;
          
          &lt;div className="mt-6"&gt;
            &lt;lyd-textarea
              label="Property Description"
              placeholder="Describe the property features, location, and unique selling points..."
              rows="4"
              state={errors.description ? 'error' : 'default'}
              error-message={errors.description}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            /&gt;
          &lt;/div&gt;
          
          &lt;div className="flex justify-end gap-4 mt-8"&gt;
            &lt;lyd-button variant="outline" type="button"&gt;
              Cancel
            &lt;/lyd-button&gt;
            &lt;lyd-button variant="primary" type="submit" loading={isSubmitting}&gt;
              Create Property
            &lt;/lyd-button&gt;
          &lt;/div&gt;
        &lt;/form&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
                
                <h3>Input Component Props</h3>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4>Alle verfügbaren Input-Typen:</h4>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li><strong>text</strong> - Standard Texteingabe</li>
                        <li><strong>email</strong> - E-Mail mit Validierung</li>
                        <li><strong>number</strong> - Zahlen für Preise und Flächen</li>
                        <li><strong>search</strong> - Suche mit Icon</li>
                        <li><strong>tel</strong> - Telefonnummern</li>
                        <li><strong>url</strong> - Website-URLs</li>
                    </ul>
            </div>

                <h3>TypeScript Integration</h3>
                <pre style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; border: 1px solid #313244;"><code>// types/lyd-design-system.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lyd-input-text': {
        type?: 'text' | 'email' | 'number' | 'search' | 'tel' | 'url';
        size?: 'small' | 'medium' | 'large';
        state?: 'default' | 'success' | 'error' | 'disabled';
        label?: string;
        placeholder?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        'error-message'?: string;
        'help-text'?: string;
        onChange?: (event: CustomEvent) => void;
        onBlur?: (event: CustomEvent) => void;
      };
      
      'lyd-textarea': {
        size?: 'small' | 'medium' | 'large';
        state?: 'default' | 'success' | 'error' | 'disabled';
        label?: string;
        placeholder?: string;
        value?: string;
        rows?: number;
        required?: boolean;
        disabled?: boolean;
        'error-message'?: string;
        'help-text'?: string;
        onChange?: (event: CustomEvent) => void;
        onBlur?: (event: CustomEvent) => void;
      };
      
      'lyd-select': {
        size?: 'small' | 'medium' | 'large';
        state?: 'default' | 'success' | 'error' | 'disabled';
        label?: string;
        placeholder?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        'error-message'?: string;
        'help-text'?: string;
        searchable?: boolean;
        multiple?: boolean;
        onChange?: (event: CustomEvent) => void;
        children?: React.ReactNode;
      };
    }
  }
}

export {};

// Hook für Input Events
import { useEffect, useRef } from 'react';

export const useLydInput = (
  onChange?: (value: string) => void,
  onValidation?: (isValid: boolean, errors: string[]) => void
) => {
  const ref = useRef&lt;HTMLDivElement&gt;(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleChange = (e: CustomEvent) => {
      onChange?.(e.detail.value);
    };
    
    const handleValidation = (e: CustomEvent) => {
      onValidation?.(e.detail.isValid, e.detail.errors);
    };
    
    element.addEventListener('lyd-input-change', handleChange as EventListener);
    element.addEventListener('lyd-validation', handleValidation as EventListener);
    
    return () => {
      element.removeEventListener('lyd-input-change', handleChange as EventListener);
      element.removeEventListener('lyd-validation', handleValidation as EventListener);
    };
  }, [onChange, onValidation]);
  
  return ref;
};</code></pre>
        </section>'''
    
    # Replace Accessibility section
    accessibility_content = '''        <section class="section">
            <div class="accessibility-badge" style="display: flex; align-items: center; gap: 16px; padding: 24px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9; border-radius: 12px; box-shadow: 0 4px 16px rgba(14, 165, 233, 0.1); margin-bottom: 32px;">
                <svg style="width: 48px; height: 48px; color: #0ea5e9;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/><path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/><path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/></svg>
                <div>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0c4a6e;">WCAG 2.1 AA Compliant</h2>
                    <p style="margin: 0; color: #0369a1; font-size: 15px; line-height: 1.5;">All input components meet accessibility standards for keyboard navigation, screen readers, and color contrast.</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
                <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 18px; font-weight: 600; color: #1f2937;">
                        <svg style="width: 24px; height: 24px; color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        Keyboard Navigation
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Tab</kbd>
                            <span style="color: #374151; font-size: 15px;">Move to next input field</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Shift + Tab</kbd>
                            <span style="color: #374151; font-size: 15px;">Move to previous input field</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Enter</kbd>
                            <span style="color: #374151; font-size: 15px;">Submit form or activate button</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <kbd style="display: inline-block; padding: 6px 12px; background: #1f2937; color: white; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; border-radius: 6px; min-width: 60px; text-align: center;">Escape</kbd>
                            <span style="color: #374151; font-size: 15px;">Clear input or cancel action</span>
                        </div>
                    </div>
                </div>
                
                <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h3 style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 18px; font-weight: 600; color: #1f2937;">
                        <svg style="width: 24px; height: 24px; color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M8 12l2 2 4-4"/></svg>
                        Screen Reader Support
                    </h3>
                    <div style="display: grid; gap: 16px;">
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Semantic Labels</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">All inputs have proper labels that are announced by screen readers</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Error Announcements</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Validation errors are announced immediately when they occur</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Required Field Indicators</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Required fields are clearly marked and announced</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: bold;">✓</div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Focus Management</strong>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Focus is clearly visible and properly managed throughout the form</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>'''
    
    # Add CSS for input-specific styling
    input_css = '''
        /* Input-specific styles */
        .luxury-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 16px;
            font-family: 'Inter', system-ui, sans-serif;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            min-height: 56px;
        }

        .luxury-input:focus {
            outline: none;
            border-color: #0066ff;
            box-shadow: 
                0 0 0 4px rgba(0, 102, 255, 0.1),
                0 4px 16px rgba(0, 102, 255, 0.15);
            transform: translateY(-1px);
        }

        .luxury-input:hover {
            border-color: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .luxury-input::placeholder {
            color: #9ca3af;
        }

        .luxury-input:disabled {
            background: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
            opacity: 0.7;
        }

        /* Textarea specific */
        .luxury-input[rows] {
            resize: vertical;
            min-height: auto;
            line-height: 1.5;
        }

        /* Label styling */
        .luxury-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
        }

        /* Form container */
        .form-container {
            display: grid;
            gap: 20px;
        }

        .form-row {
            display: grid;
            gap: 16px;
        }

        .form-row.two {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .form-row.three {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
'''
    
    # Apply all replacements
    content = content.replace(
        '<h2 class="section-title">Button System Overview</h2>',
        '<h2 class="section-title">Input System Overview</h2>'
    )
    
    # Find and replace entire sections
    import re
    
    # Replace overview section
    overview_pattern = r'<section class="section">\s*<h2 class="section-title">Button System Overview</h2>.*?</section>'
    content = re.sub(overview_pattern, overview_content, content, flags=re.DOTALL)
    
    # Replace variants section 
    variants_pattern = r'<section class="section">\s*<h2 class="section-title">Button Variants</h2>.*?</section>'
    content = re.sub(variants_pattern, variants_content, content, flags=re.DOTALL)
    
    # Replace examples section
    examples_pattern = r'<section class="section">\s*<h2 class="section-title">Real Estate Use Cases</h2>.*?</section>'
    content = re.sub(examples_pattern, examples_content, content, flags=re.DOTALL)
    
    # Replace API section
    api_pattern = r'<section class="section api-section">\s*<h2 class="section-title">API Reference</h2>.*?</section>'
    content = re.sub(api_pattern, api_content, content, flags=re.DOTALL)
    
    # Replace accessibility section
    accessibility_pattern = r'<section class="section">\s*<h2 class="section-title">Accessibility Guidelines</h2>.*?</section>'
    content = re.sub(accessibility_pattern, accessibility_content, content, flags=re.DOTALL)
    
    # Add input-specific CSS before the closing </style> tag
    content = content.replace('        \n    </style>', f'{input_css}        \n    </style>')
    
    # Write the rebuilt file
    with open(inputs_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Inputs page completely rebuilt with proper content!")

if __name__ == "__main__":
    rebuild_inputs_page()


