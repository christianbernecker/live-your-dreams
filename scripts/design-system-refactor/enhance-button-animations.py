#!/usr/bin/env python3
"""
Erweitert die Button-Komponente mit allen hochwertigen Micro-Animationen und States
"""

from pathlib import Path

def enhance_buttons():
    """Fügt alle fehlenden Animationen und States hinzu"""
    
    button_file = Path("/Users/christianbernecker/live-your-dreams/design-system/components/buttons/index.html")
    
    # Erweiterte Styles mit allen Animationen
    enhanced_styles = """
        /* Premium Button Styles mit Micro-Animationen */
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
        
        /* Ripple Effect on Click */
        .lyd-button::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .lyd-button:active::after {
            width: 300px;
            height: 300px;
        }
        
        /* Icon Animations */
        .lyd-button .btn-icon {
            width: 18px;
            height: 18px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lyd-button:hover .btn-icon {
            transform: scale(1.1) rotate(5deg);
        }
        
        .lyd-button:active .btn-icon {
            transform: scale(0.95);
        }
        
        /* Primary Button - Premium Gradient mit Shimmer */
        .lyd-button.primary {
            background: linear-gradient(135deg, #0066ff 0%, #004299 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(0, 102, 255, 0.3);
            position: relative;
        }
        
        .lyd-button.primary::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .lyd-button.primary:hover::before {
            left: 100%;
        }
        
        .lyd-button.primary:hover {
            background: linear-gradient(135deg, #0052cc 0%, #003366 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 102, 255, 0.4);
        }
        
        /* Secondary Button - Glassmorphism mit Pulse */
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
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        
        /* Loading State mit Spinner */
        .lyd-button.loading {
            pointer-events: none;
            opacity: 0.7;
            position: relative;
        }
        
        .lyd-button.loading .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Download Button mit Progress Animation */
        .lyd-button.download-progress {
            position: relative;
            overflow: hidden;
        }
        
        .lyd-button.download-progress::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: var(--progress, 0%);
            height: 100%;
            background: rgba(16, 185, 129, 0.2);
            transition: width 0.3s ease;
        }
        
        .download-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: var(--progress, 0%);
            height: 3px;
            background: linear-gradient(90deg, #10b981, #34d399);
            transition: width 0.3s ease;
            animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
        
        /* Success State Animation */
        .lyd-button.success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            animation: success-bounce 0.5s ease;
        }
        
        @keyframes success-bounce {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .success-checkmark {
            animation: checkmark-draw 0.4s ease forwards;
        }
        
        @keyframes checkmark-draw {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
        }
        
        /* Processing State mit Shimmer */
        .lyd-button.processing {
            position: relative;
            overflow: hidden;
        }
        
        .lyd-button.processing::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: processing-shimmer 2s infinite;
        }
        
        @keyframes processing-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        /* Hover Effects für Icon-only Buttons */
        .lyd-button-pure {
            padding: 10px;
            min-width: 40px;
            height: 40px;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lyd-button-pure:hover {
            transform: rotate(360deg) scale(1.1);
        }
        
        /* Button Group Hover Effect */
        .lyd-button-group {
            display: inline-flex;
            position: relative;
        }
        
        .lyd-button-group .lyd-button {
            border-radius: 0;
        }
        
        .lyd-button-group .lyd-button:first-child {
            border-radius: 6px 0 0 6px;
        }
        
        .lyd-button-group .lyd-button:last-child {
            border-radius: 0 6px 6px 0;
        }
        
        /* Tile Hover Animation */
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
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .lyd-button-tile::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(0, 102, 255, 0.1) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: width 0.5s, height 0.5s;
        }
        
        .lyd-button-tile:hover::before {
            width: 200%;
            height: 200%;
        }
        
        .lyd-button-tile:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            border-color: #0066ff;
        }
        
        .lyd-button-tile:hover .tile-icon {
            animation: bounce 0.5s ease;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        /* Disabled State */
        .lyd-button:disabled,
        .lyd-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
            transform: none !important;
            box-shadow: none !important;
        }
        
        /* Focus States für Accessibility */
        .lyd-button:focus-visible {
            outline: 2px solid #0066ff;
            outline-offset: 2px;
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            .lyd-button.outline {
                border-color: rgba(255, 255, 255, 0.2);
                color: #e5e7eb;
            }
            
            .lyd-button.outline:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        }
    """
    
    # JavaScript für erweiterte Interaktionen
    enhanced_javascript = """
        // Download Button mit Progress Animation
        async function simulateDownload(button) {
            if (button.disabled) return;
            
            button.disabled = true;
            button.classList.add('download-progress');
            const originalContent = button.innerHTML;
            let progress = 0;
            
            // Progress Bar hinzufügen
            const progressBar = document.createElement('div');
            progressBar.className = 'download-progress-bar';
            button.appendChild(progressBar);
            
            // Show loading state
            button.innerHTML = `
                <div class="spinner"></div>
                <div>
                    <div>Generating...</div>
                    <div style="font-size: 11px; opacity: 0.8;">${progress}% complete</div>
                </div>
            ` + progressBar.outerHTML;
            
            // Simulate progress mit smooth animation
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                button.style.setProperty('--progress', progress + '%');
                button.querySelector('div:last-child div:last-child').textContent = `${Math.round(progress)}% complete`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    
                    // Success animation
                    button.classList.remove('download-progress');
                    button.classList.add('success');
                    
                    button.innerHTML = `
                        <svg class="btn-icon success-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="100" stroke-dashoffset="100">
                            <polyline points="20,6 9,17 4,12"/>
                        </svg>
                        <div>
                            <div>Download Complete</div>
                            <div style="font-size: 11px; opacity: 0.8;">2.5 MB PDF</div>
                        </div>
                    `;
                    
                    setTimeout(() => {
                        button.classList.remove('success');
                        button.innerHTML = originalContent;
                        button.disabled = false;
                        showToast('Property Exposé downloaded successfully!', 'success');
                    }, 2000);
                }
            }, 200);
        }
        
        // Processing Animation für async operations
        function setProcessing(button, isProcessing) {
            if (isProcessing) {
                button.classList.add('processing');
                button.disabled = true;
            } else {
                button.classList.remove('processing');
                button.disabled = false;
            }
        }
        
        // Ripple Effect on Click
        document.querySelectorAll('.lyd-button').forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                // Calculate position
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Hover Sound Effects (optional)
        const hoverSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
        document.querySelectorAll('.lyd-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                // hoverSound.play().catch(() => {}); // Optional sound
            });
        });
    """
    
    # Erweiterte Beispiele mit allen States
    enhanced_examples = """
            <div class="examples-grid">
                <!-- Download Example mit Progress -->
                <div class="example-item">
                    <h3 class="example-title">Download with Progress</h3>
                    <p class="example-description">Premium download experience with progress animation</p>
                    <div class="example-demo">
                        <button class="lyd-button primary" onclick="simulateDownload(this)">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <div>
                                <div>Download Exposé</div>
                                <div style="font-size: 11px; opacity: 0.8;">2.5 MB PDF</div>
                            </div>
                        </button>
                    </div>
                </div>
                
                <!-- Processing State Example -->
                <div class="example-item">
                    <h3 class="example-title">Processing States</h3>
                    <p class="example-description">Various loading and processing animations</p>
                    <div class="example-demo">
                        <button class="lyd-button primary loading">
                            <div class="spinner"></div>
                            Processing...
                        </button>
                        <button class="lyd-button secondary processing">
                            Analyzing Property...
                        </button>
                        <button class="lyd-button outline" onclick="setProcessing(this, true); setTimeout(() => setProcessing(this, false), 3000)">
                            Click to Process
                        </button>
                    </div>
                </div>
                
                <!-- Interactive States -->
                <div class="example-item">
                    <h3 class="example-title">Interactive Feedback</h3>
                    <p class="example-description">Micro-animations and hover effects</p>
                    <div class="example-demo">
                        <button class="lyd-button primary">
                            Hover for Shimmer
                        </button>
                        <button class="lyd-button secondary">
                            Pulse on Hover
                        </button>
                        <button class="lyd-button-pure primary">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
    """
    
    # Lese aktuelle Datei
    with open(button_file, 'r') as f:
        content = f.read()
    
    # Ersetze Styles
    import re
    
    # Finde den Style-Block und ersetze
    style_pattern = r'(/\* Component Specific Styles \*/)(.*?)(\</style\>)'
    replacement = f'/* Component Specific Styles */\n{enhanced_styles}\n</style>'
    content = re.sub(style_pattern, replacement, content, flags=re.DOTALL)
    
    # Ersetze JavaScript
    js_pattern = r'(\{\{COMPONENT_JAVASCRIPT\}\})'
    content = re.sub(js_pattern, enhanced_javascript, content)
    
    # Füge erweiterte Beispiele hinzu
    examples_pattern = r'(<h2 class="section-title">Real Estate Use Cases</h2>)(.*?)(<\/section>)'
    replacement = f'<h2 class="section-title">Real Estate Use Cases</h2>\n{enhanced_examples}\n</section>'
    content = re.sub(examples_pattern, replacement, content, flags=re.DOTALL)
    
    # Speichere erweiterte Version
    with open(button_file, 'w') as f:
        f.write(content)
    
    print("✅ Button component enhanced with:")
    print("  - Download progress animations")
    print("  - Processing shimmer effects")
    print("  - Ripple click effects")
    print("  - Success state animations")
    print("  - Hover micro-animations")
    print("  - Pulse effects")
    print("  - Icon rotation animations")
    print("  - Smooth progress bars")
    print("  - Interactive feedback")

if __name__ == "__main__":
    enhance_buttons()

