/**
 * LYD Dropdown Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React, { useEffect, useRef, useState } from 'react';

export interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface LYDDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  disabled?: boolean;
  className?: string;
  overlayClassName?: string;
}

export const LYDDropdown: React.FC<LYDDropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-left',
  disabled = false,
  className = '',
  overlayClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  // Design System Klassen
  const dropdownClasses = ['lyd-dropdown'];
  
  if (disabled) {
    dropdownClasses.push('lyd-dropdown-disabled');
  }
  
  if (isOpen) {
    dropdownClasses.push('lyd-dropdown-open');
  }
  
  if (className) {
    dropdownClasses.push(className);
  }

  const overlayClasses = ['lyd-dropdown-overlay', `lyd-dropdown-${placement}`];
  
  if (overlayClassName) {
    overlayClasses.push(overlayClassName);
  }

  return (
    <div className={dropdownClasses.join(' ')} ref={dropdownRef}>
      <div className="lyd-dropdown-trigger" onClick={handleTriggerClick}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={overlayClasses.join(' ')}>
          <ul className="lyd-dropdown-menu" role="menu">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <li key={`divider-${index}`} className="lyd-dropdown-divider" />
                );
              }
              
              return (
                <li
                  key={item.key}
                  className={`lyd-dropdown-item ${item.disabled ? 'lyd-dropdown-item-disabled' : ''}`}
                  onClick={() => handleItemClick(item)}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className="lyd-dropdown-item-icon">
                      {item.icon}
                    </span>
                  )}
                  <span className="lyd-dropdown-item-label">
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LYDDropdown;

