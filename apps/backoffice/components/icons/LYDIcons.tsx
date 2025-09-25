/**
 * Live Your Dreams - SVG Icon System
 * Ersetzt alle Emojis mit Design System-konformen SVG Icons
 * Basiert auf: https://designsystem.liveyourdreams.online/shared/master.css
 */

import React from 'react';

// Base Icon Wrapper mit Design System Styling
interface IconProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({ 
  className = '', 
  size = 'default', 
  children 
}) => {
  const sizeClasses = {
    sm: 'lyd-icon-sm',
    default: 'lyd-icon',
    lg: 'lyd-icon-lg', 
    xl: 'lyd-icon-xl'
  };

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
};

// NAVIGATION ICONS - Ersetzt Emojis: 📊 🏠 👥 💰 ⚙️

export const DashboardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </BaseIcon>
);

export const PropertyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </BaseIcon>
);

export const LeadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </BaseIcon>
);

export const PricingIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </BaseIcon>
);

// ZUSÄTZLICHE ICONS FÜR BACKOFFICE FEATURES

export const MediaIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </BaseIcon>
);

export const MicrositeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </BaseIcon>
);

export const IntegrationsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </BaseIcon>
);

// ACTION ICONS

export const AddIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </BaseIcon>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </BaseIcon>
);

export const DeleteIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </BaseIcon>
);

export const ViewIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </BaseIcon>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </BaseIcon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </BaseIcon>
);

export const SortIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 6h18"/>
    <path d="M7 12h10"/>
    <path d="M10 18h4"/>
  </BaseIcon>
);

// STATUS ICONS  

export const CheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="20,6 9,17 4,12"/>
  </BaseIcon>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </BaseIcon>
);

export const AlertIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
  </BaseIcon>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4m0-4h.01"/>
  </BaseIcon>
);

// EXPORT ALL ICONS
export const LYDIcons = {
  // Navigation
  DashboardIcon,
  PropertyIcon, 
  LeadIcon,
  PricingIcon,
  SettingsIcon,
  MediaIcon,
  MicrositeIcon,
  IntegrationsIcon,
  
  // Actions
  AddIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  FilterIcon,
  SearchIcon,
  SortIcon,
  
  // Status
  CheckIcon,
  XIcon,
  AlertIcon,
  InfoIcon
} as const;

export default LYDIcons;

