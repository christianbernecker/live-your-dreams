/**
 * Design System Tabs Component
 * 
 * Based on: /design-system/v2/components/tabs/index.html
 */

'use client';

import React, { createContext, useContext, useState } from 'react';

// ============================================================================
// TABS CONTEXT
// ============================================================================

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// ============================================================================
// MAIN TABS COMPONENT
// ============================================================================

interface TabsProps {
  /** Default active tab */
  defaultValue: string;
  /** Children components */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Tab change handler */
  onValueChange?: (value: string) => void;
}

export function Tabs({ 
  defaultValue, 
  children, 
  className = '',
  onValueChange 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`lyd-tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ============================================================================
// TABS LIST COMPONENT
// ============================================================================

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`lyd-tabs-list ${className}`}>
      {children}
    </div>
  );
}

// ============================================================================
// TAB TRIGGER COMPONENT
// ============================================================================

interface TabsTriggerProps {
  /** Tab value */
  value: string;
  /** Tab content */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
}

export function TabsTrigger({ 
  value, 
  children, 
  className = '',
  disabled = false,
  icon
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;
  
  const activeClass = isActive ? 'lyd-tab-active' : '';
  const disabledClass = disabled ? 'lyd-tab-disabled' : '';
  const classes = ['lyd-tab', activeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: icon ? 'var(--spacing-xs)' : undefined
      }}
    >
      {icon && <span className="lyd-tab-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// ============================================================================
// TAB CONTENT COMPONENT  
// ============================================================================

interface TabsContentProps {
  /** Tab value */
  value: string;
  /** Tab content */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={`lyd-tabs-content ${className}`}>
      {children}
    </div>
  );
}

