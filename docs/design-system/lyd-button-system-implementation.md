# LYD Design System - Complete Button System Implementation

## Cursor.ai Implementation Instructions

### Project Context
You are implementing a comprehensive button system for the LYD (Life Your Dreams) real estate platform design system. This implementation is based on learnings from the Porsche Design System v3 but adapted for real estate use cases. All button components will be consolidated under a single URL: `http://designsystem.liveyourdreams.online/components/buttons/`

### URL Structure Decision
**Single Page Architecture**: All button variants will be displayed on ONE comprehensive page at `/components/buttons/` with the following tab structure:
- **Overview Tab**: Quick visual grid of all button types
- **Variants Tab**: Detailed exploration of each button component
- **Icon Library Tab**: Complete icon catalog with search/filter
- **Examples Tab**: Real-world usage scenarios from the platform
- **API Tab**: Props, events, and methods documentation
- **Accessibility Tab**: WCAG guidelines and keyboard navigation

## Phase 1: Icon System Foundation

### Task 1.1: Create Comprehensive Icon Library
**Location**: `src/icons/icon-library.js`

```javascript
// INSTRUCTION: Create this file with ALL icons. Each icon must be optimized SVG.
// Use 24x24 viewBox for consistency. All paths must use currentColor for theming.

export const LYD_ICONS = {
  // Navigation Icons (10 icons)
  'arrow-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m0 0l-7-7m7 7l-7 7"/></svg>',
  'arrow-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>',
  'chevron-down': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>',
  'chevron-up': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>',
  'chevron-right': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>',
  'chevron-left': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>',
  'external-link': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6m0 0v6m0-6L10 14"/></svg>',
  
  // Real Estate Specific Icons (15 icons)
  'home': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  'building': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>',
  'apartment': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>',
  'location': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  'key': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>',
  'euro': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"/></svg>',
  'area': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/></svg>',
  'bedroom': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
  'bathroom': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm13 0h-8v14h2v-6h4v6h2V7z"/></svg>',
  'garage': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/></svg>',
  'garden': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6L14 10.64 11.36 8 14 5.36 16.64 8zm-3.81 7.17L10 12.34V9.66l2.83-2.83 2.83 2.83v2.68l-2.83 2.83z"/></svg>',
  'terrace': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 10v2H8v-2h2m6 2v-2h-2v2h2m5 2v8h-2v-6H5v6H3v-8l9-5 9 5M3 9V7h18v2H3z"/></svg>',
  'floor-plan': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 10h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6-6h4v4h-4zm6 0h4v4h-4zM4 4h4v4H4zm6 12h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4z"/></svg>',
  'energy': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>',
  
  // Action Icons (20 icons)
  'eye': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
  'eye-off': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>',
  'edit': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
  'delete': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
  'download': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
  'upload': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>',
  'share': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>',
  'copy': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
  'print': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>',
  'save': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
  'heart': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  'heart-outline': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>',
  'star': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  'star-outline': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>',
  
  // Communication Icons (8 icons)
  'phone': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
  'mail': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  'calendar': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>',
  'chat': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>',
  'video': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
  'notification': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
  
  // UI Control Icons (15 icons)
  'close': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  'check': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
  'plus': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  'minus': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>',
  'menu': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
  'more-vertical': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  'more-horizontal': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  'filter': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>',
  'search': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  'settings': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
  'info': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
  'warning': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
  'error': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
  'help': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>'
};

// INSTRUCTION: Verify all icons render correctly at different sizes
// Test command: Object.keys(LYD_ICONS).forEach(name => console.log(`Icon ${name}: OK`));
```

## Phase 2: Core Button Components

### Task 2.1: Base Button Component
**Location**: `src/components/lyd-button.js`
**Critical Requirements**:
- Must support ALL icon names from the library
- Icon position must be configurable (left/right)
- Ripple effect on ALL clicks
- Loading spinner must be smooth 60fps animation
- Disabled state must be visually clear

```javascript
// INSTRUCTION: This is the main button component. It must be pixel-perfect.
// Test all variants with all icons before proceeding.

class LydButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._rippleTimeout = null;
  }

  static get observedAttributes() {
    return [
      'variant',       // primary|secondary|outline|ghost|danger|success
      'size',          // small|medium|large
      'icon',          // icon name from LYD_ICONS
      'icon-position', // left|right
      'loading',       // boolean attribute
      'disabled',      // boolean attribute
      'full-width',    // boolean attribute
      'rounded'        // boolean attribute for pill shape
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    if (this._rippleTimeout) {
      clearTimeout(this._rippleTimeout);
    }
  }

  // COMPLETE IMPLEMENTATION AS PROVIDED IN PREVIOUS SECTION
  // ... [Include full implementation]
}

// INSTRUCTION: Register the component
customElements.define('lyd-button', LydButton);
```

### Task 2.2: Button Group Component
**Location**: `src/components/lyd-button-group.js`
**Purpose**: Groups related buttons together (e.g., Edit | Delete | Archive)

```javascript
// INSTRUCTION: This component manages button spacing and borders
// Connected mode: buttons share borders
// Spaced mode: buttons have gaps

class LydButtonGroup extends HTMLElement {
  // COMPLETE IMPLEMENTATION AS PROVIDED
}

customElements.define('lyd-button-group', LydButtonGroup);
```

### Task 2.3: Button Pure Component
**Location**: `src/components/lyd-button-pure.js`
**Purpose**: Icon-only minimal buttons (e.g., favorite heart, close X)

```javascript
// INSTRUCTION: Minimal button for icon actions
// Always circular, no text, subtle hover state

class LydButtonPure extends HTMLElement {
  // COMPLETE IMPLEMENTATION AS PROVIDED
}

customElements.define('lyd-button-pure', LydButtonPure);
```

### Task 2.4: Button Tile Component
**Location**: `src/components/lyd-button-tile.js`
**Purpose**: Large clickable tiles for dashboards and navigation

```javascript
// INSTRUCTION: Dashboard tiles with icon + label + description
// Used for main navigation and feature selection

class LydButtonTile extends HTMLElement {
  // COMPLETE IMPLEMENTATION AS PROVIDED
}

customElements.define('lyd-button-tile', LydButtonTile);
```

## Phase 3: Design System Page Implementation

### Task 3.1: Create Single Comprehensive Button Page
**Location**: `design-system/components/buttons/index.html`
**URL**: `http://designsystem.liveyourdreams.online/components/buttons/`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buttons - LYD Design System</title>
    
    <!-- INSTRUCTION: Copy exact styles from existing button pages -->
    <!-- Import the Inter font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* INSTRUCTION: Use existing styles from current pages */
        /* Add tab navigation styles */
        .tabs {
            display: flex;
            gap: 2px;
            background: #f3f4f6;
            padding: 4px;
            border-radius: 12px;
            margin-bottom: 32px;
        }
        
        .tab {
            flex: 1;
            padding: 12px 24px;
            background: transparent;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .tab:hover {
            color: #374151;
        }
        
        .tab.active {
            background: white;
            color: #0066ff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Icon grid for icon library tab */
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 16px;
            padding: 24px;
            background: white;
            border-radius: 12px;
        }
        
        .icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 16px 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .icon-item:hover {
            background: #f9fafb;
            transform: translateY(-2px);
        }
        
        .icon-preview {
            width: 32px;
            height: 32px;
            color: #3366CC;
        }
        
        .icon-name {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            word-break: break-all;
        }
        
        /* Search bar for icon library */
        .search-bar {
            position: relative;
            margin-bottom: 24px;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.2s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #3366CC;
            box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
        }
        
        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #6b7280;
            pointer-events: none;
        }
    </style>
    
    <!-- Load all components -->
    <script type="module">
        import './src/icons/icon-library.js';
        import './src/components/lyd-icon.js';
        import './src/components/lyd-button.js';
        import './src/components/lyd-button-group.js';
        import './src/components/lyd-button-pure.js';
        import './src/components/lyd-button-tile.js';
    </script>
</head>
<body>
    <!-- INSTRUCTION: Use exact sidebar from existing pages -->
    <nav class="sidebar">
        <!-- Copy exact sidebar content -->
    </nav>
    
    <main class="main-content">
        <h1 class="page-title">Button Components</h1>
        <p class="page-subtitle">
            Complete button system with variants, icons, and specialized components for real estate applications.
        </p>
        
        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="overview">Overview</button>
            <button class="tab" data-tab="variants">Variants</button>
            <button class="tab" data-tab="icons">Icon Library</button>
            <button class="tab" data-tab="examples">Examples</button>
            <button class="tab" data-tab="api">API</button>
            <button class="tab" data-tab="accessibility">Accessibility</button>
        </div>
        
        <!-- Tab Content: Overview -->
        <div class="tab-content active" id="overview">
            <section class="section">
                <h2 class="section-title">Button System Overview</h2>
                
                <!-- Visual grid showing all button types -->
                <div class="demo-grid">
                    <div class="demo-card">
                        <h3 class="demo-title">lyd-button</h3>
                        <p class="demo-description">Primary button component with variants and icons</p>
                        <lyd-button variant="primary" icon="home">View Property</lyd-button>
                    </div>
                    
                    <div class="demo-card">
                        <h3 class="demo-title">lyd-button-group</h3>
                        <p class="demo-description">Group related actions together</p>
                        <lyd-button-group>
                            <lyd-button variant="outline">Edit</lyd-button>
                            <lyd-button variant="outline">Delete</lyd-button>
                        </lyd-button-group>
                    </div>
                    
                    <div class="demo-card">
                        <h3 class="demo-title">lyd-button-pure</h3>
                        <p class="demo-description">Minimal icon-only buttons</p>
                        <div style="display: flex; gap: 8px;">
                            <lyd-button-pure icon="heart"></lyd-button-pure>
                            <lyd-button-pure icon="share"></lyd-button-pure>
                            <lyd-button-pure icon="more-vertical"></lyd-button-pure>
                        </div>
                    </div>
                    
                    <div class="demo-card">
                        <h3 class="demo-title">lyd-button-tile</h3>
                        <p class="demo-description">Large tiles for navigation</p>
                        <lyd-button-tile 
                            icon="building" 
                            label="Properties" 
                            description="23 active">
                        </lyd-button-tile>
                    </div>
                </div>
            </section>
        </div>
        
        <!-- Tab Content: Variants -->
        <div class="tab-content" id="variants">
            <!-- INSTRUCTION: Show ALL button variants with code examples -->
            <section class="section">
                <h2 class="section-title">Button Variants</h2>
                
                <!-- Show each variant in different sizes -->
                <div class="demo-grid">
                    <!-- Primary -->
                    <div class="demo-card">
                        <h3 class="demo-title">Primary</h3>
                        <div class="component-showcase">
                            <lyd-button variant="primary" size="large" icon="home">Large</lyd-button>
                            <lyd-button variant="primary" size="medium" icon="home">Medium</lyd-button>
                            <lyd-button variant="primary" size="small" icon="home">Small</lyd-button>
                        </div>
                    </div>
                    
                    <!-- Add all other variants -->
                </div>
            </section>
        </div>
        
        <!-- Tab Content: Icon Library -->
        <div class="tab-content" id="icons">
            <section class="section">
                <h2 class="section-title">Icon Library</h2>
                
                <!-- Search bar -->
                <div class="search-bar">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search icons..."
                        id="icon-search"
                    >
                    <lyd-icon name="search" class="search-icon"></lyd-icon>
                </div>
                
                <!-- Icon grid -->
                <div class="icon-grid" id="icon-grid">
                    <!-- INSTRUCTION: Dynamically populate with all icons -->
                </div>
                
                <script>
                    // INSTRUCTION: Populate icon grid and implement search
                    const iconGrid = document.getElementById('icon-grid');
                    const iconSearch = document.getElementById('icon-search');
                    
                    // Import and display all icons
                    import('./src/icons/icon-library.js').then(module => {
                        const icons = module.LYD_ICONS;
                        
                        function displayIcons(filter = '') {
                            iconGrid.innerHTML = '';
                            Object.keys(icons)
                                .filter(name => name.includes(filter.toLowerCase()))
                                .forEach(name => {
                                    const item = document.createElement('div');
                                    item.className = 'icon-item';
                                    item.innerHTML = `
                                        <lyd-icon name="${name}" class="icon-preview"></lyd-icon>
                                        <span class="icon-name">${name}</span>
                                    `;
                                    item.addEventListener('click', () => {
                                        navigator.clipboard.writeText(`<lyd-button icon="${name}">`);
                                        // Show toast: "Copied to clipboard"
                                    });
                                    iconGrid.appendChild(item);
                                });
                        }
                        
                        displayIcons();
                        iconSearch.addEventListener('input', (e) => displayIcons(e.target.value));
                    });
                </script>
            </section>
        </div>
        
        <!-- Tab Content: Examples -->
        <div class="tab-content" id="examples">
            <section class="section">
                <h2 class="section-title">Real Estate Use Cases</h2>
                
                <!-- Property Card Example -->
                <div class="demo-card" style="max-width: 400px;">
                    <h3 class="demo-title">Property Card Actions</h3>
                    <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
                        <img src="/placeholder-property.jpg" style="width: 100%; height: 200px; background: #f3f4f6; border-radius: 8px; margin-bottom: 16px;">
                        <h4>Luxury Villa Munich</h4>
                        <p style="color: #6b7280; font-size: 14px;">€2,500,000 • 350m² • 5 rooms</p>
                        
                        <div style="display: flex; gap: 8px; margin-top: 16px;">
                            <lyd-button variant="primary" icon="calendar" full-width>
                                Schedule Viewing
                            </lyd-button>
                            <lyd-button-pure icon="heart-outline"></lyd-button-pure>
                        </div>
                    </div>
                </div>
                
                <!-- Add more real-world examples -->
            </section>
        </div>
        
        <!-- Tab Content: API -->
        <div class="tab-content" id="api">
            <section class="section">
                <h2 class="section-title">API Reference</h2>
                
                <!-- Properties table for each component -->
                <h3>lyd-button</h3>
                <table class="properties-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>variant</code></td>
                            <td><code>string</code></td>
                            <td><code>primary</code></td>
                            <td>Visual style: primary, secondary, outline, ghost, danger, success</td>
                        </tr>
                        <!-- Add all properties -->
                    </tbody>
                </table>
                
                <!-- Events -->
                <h3>Events</h3>
                <table class="properties-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Detail</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>lyd-click</code></td>
                            <td><code>{variant, icon}</code></td>
                            <td>Fired when button is clicked</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
        
        <!-- Tab Content: Accessibility -->
        <div class="tab-content" id="accessibility">
            <section class="section">
                <h2 class="section-title">Accessibility Guidelines</h2>
                
                <div class="callout">
                    <strong>WCAG 2.1 AA Compliant</strong>
                    <p>All button components meet accessibility standards</p>
                </div>
                
                <h3>Keyboard Navigation</h3>
                <ul>
                    <li><kbd>Tab</kbd> - Navigate between buttons</li>
                    <li><kbd>Space</kbd> / <kbd>Enter</kbd> - Activate button</li>
                    <li><kbd>Esc</kbd> - Cancel action (if applicable)</li>
                </ul>
                
                <h3>Screen Reader Support</h3>
                <ul>
                    <li>All buttons have proper ARIA labels</li>
                    <li>Icon-only buttons include descriptive text</li>
                    <li>Loading states announce to screen readers</li>
                    <li>Disabled states are properly communicated</li>
                </ul>
                
                <h3>Color Contrast</h3>
                <p>All button variants meet WCAG AA contrast requirements:</p>
                <ul>
                    <li>Primary: 7.5:1 contrast ratio</li>
                    <li>Secondary: 5.2:1 contrast ratio</li>
                    <li>All text is legible for users with visual impairments</li>
                </ul>
            </section>
        </div>
    </main>
    
    <!-- Tab switching script -->
    <script>
        // INSTRUCTION: Implement tab switching
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                
                // Update URL hash
                window.location.hash = targetId;
            });
        });
        
        // Handle initial hash
        if (window.location.hash) {
            const tab = document.querySelector(`[data-tab="${window.location.hash.slice(1)}"]`);
            if (tab) tab.click();
        }
    </script>
</body>
</html>
```

## Phase 4: Testing Implementation

### Task 4.1: Create Test Suite
**Location**: `tests/button-components.test.js`

```javascript
// INSTRUCTION: Run these tests to verify all components work correctly

describe('LYD Button Components Test Suite', () => {
    
    // Test 1: Verify all icons load
    test('All icons should be available', () => {
        const requiredIcons = [
            'home', 'building', 'location', 'key', 'euro',
            'heart', 'phone', 'mail', 'calendar', 'edit'
        ];
        
        requiredIcons.forEach(icon => {
            expect(LYD_ICONS[icon]).toBeDefined();
            expect(LYD_ICONS[icon]).toContain('<svg');
        });
    });
    
    // Test 2: Button renders with icon
    test('Button should render with icon', () => {
        const button = document.createElement('lyd-button');
        button.setAttribute('icon', 'home');
        button.textContent = 'Test';
        document.body.appendChild(button);
        
        const iconElement = button.shadowRoot.querySelector('.icon-wrapper');
        expect(iconElement).toBeTruthy();
        expect(iconElement.innerHTML).toContain('<svg');
    });
    
    // Test 3: Button group connects buttons
    test('Button group should connect buttons visually', () => {
        const group = document.createElement('lyd-button-group');
        group.innerHTML = `
            <lyd-button>First</lyd-button>
            <lyd-button>Second</lyd-button>
        `;
        document.body.appendChild(group);
        
        const buttons = group.querySelectorAll('lyd-button');
        expect(buttons.length).toBe(2);
    });
    
    // Add more tests...
});
```

## Phase 5: Migration from Old System

### Task 5.1: Replace Existing Buttons
**Instructions for cursor.ai**:

1. **Find all occurrences** of old button implementations:
   ```bash
   grep -r "button" --include="*.tsx" --include="*.jsx" ./app
   grep -r "Button" --include="*.tsx" --include="*.jsx" ./components
   ```

2. **Replace systematically**:
   ```typescript
   // OLD:
   <Button variant="default" onClick={handleClick}>
     <Home className="mr-2" /> Add Property
   </Button>
   
   // NEW:
   <lyd-button variant="primary" icon="home" onClick={handleClick}>
     Add Property
   </lyd-button>
   ```

3. **Update imports**:
   ```typescript
   // Remove:
   import { Button } from "@/components/ui/button"
   
   // Add to layout.tsx:
   import '@/lib/lyd-design-system'
   ```

## Phase 6: Build and Deploy

### Task 6.1: Build Configuration
**Location**: `package.json`

```json
{
  "scripts": {
    "build:icons": "node scripts/optimize-icons.js",
    "build:components": "rollup -c rollup.config.js",
    "build:design-system": "npm run build:icons && npm run build:components",
    "test:components": "jest tests/button-components.test.js",
    "serve:design-system": "http-server ./design-system -p 8080"
  }
}
```

### Task 6.2: Rollup Configuration
**Location**: `rollup.config.js`

```javascript
// INSTRUCTION: Bundle all components into single file
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/lyd-design-system.min.js',
    format: 'iife',
    name: 'LYDDesignSystem'
  },
  plugins: [
    resolve(),
    terser({
      compress: {
        drop_console: true,
        pure_funcs: ['console.log']
      }
    })
  ]
};
```

## Critical Success Criteria

### Before marking complete, verify:

1. **Icon Library**
   - [ ] All 60+ icons render correctly
   - [ ] Icons scale properly at all sizes
   - [ ] Icons use currentColor for theming

2. **Button Components**
   - [ ] All 4 button types work (button, group, pure, tile)
   - [ ] All variants render correctly
   - [ ] Loading states animate smoothly
   - [ ] Ripple effects work on click
   - [ ] Icons position correctly (left/right)

3. **Design System Page**
   - [ ] Single page at `/components/buttons/`
   - [ ] All 6 tabs function correctly
   - [ ] Icon search works
   - [ ] Code examples are accurate
   - [ ] Mobile responsive

4. **Integration**
   - [ ] TypeScript definitions work
   - [ ] Next.js integration tested
   - [ ] All old buttons replaced
   - [ ] No console errors

5. **Performance**
   - [ ] Page loads in < 2 seconds
   - [ ] Animations run at 60fps
   - [ ] Bundle size < 50KB gzipped

## Troubleshooting Guide

### Common Issues and Solutions:

1. **Icons not showing**
   - Check: Icon name exists in LYD_ICONS
   - Check: SVG viewBox is 24x24
   - Check: fill="currentColor" is set

2. **Buttons not rendering**
   - Check: Components are imported
   - Check: customElements.define() called
   - Check: No naming conflicts

3. **Ripple effect not working**
   - Check: position: relative on button
   - Check: overflow: hidden on button
   - Check: Animation keyframes defined

4. **TypeScript errors**
   - Check: Declaration file exists
   - Check: JSX namespace extended
   - Check: tsconfig includes types

## Final Verification Checklist

Run these commands to verify implementation:

```bash
# 1. Test all components render
npm run test:components

# 2. Check bundle size
du -h dist/lyd-design-system.min.js

# 3. Verify no console errors
# Open browser console and check

# 4. Test keyboard navigation
# Tab through all buttons and verify focus states

# 5. Check accessibility
# Run axe DevTools or Lighthouse
```

## Deployment

```bash
# Build production version
npm run build:design-system

# Deploy to server
scp dist/lyd-design-system.min.js server:/var/www/designsystem/

# Update design system page
scp -r design-system/components/buttons/ server:/var/www/designsystem/components/
```

---

**IMPORTANT**: Follow these instructions exactly. Do not skip steps or make assumptions. Test each component thoroughly before moving to the next phase.