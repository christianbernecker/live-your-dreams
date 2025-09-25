import clsx from "clsx";
import * as React from "react";
import "./button.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, leadingIcon, trailingIcon, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "lyd-btn", 
        `lyd-btn--${variant}`, 
        `lyd-btn--${size}`, 
        fullWidth && "lyd-btn--block", 
        className
      )}
      {...props}
    >
      {leadingIcon && <span className="lyd-btn__icon">{leadingIcon}</span>}
      <span className="lyd-btn__label">{children}</span>
      {trailingIcon && <span className="lyd-btn__icon">{trailingIcon}</span>}
    </button>
  )
);

Button.displayName = "Button";
