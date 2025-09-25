import clsx from "clsx";
import * as React from "react";
import "./input.css";

type Variant = "default" | "search" | "currency";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
  hint?: string; 
  error?: string;
  leftSlot?: React.ReactNode; 
  rightSlot?: React.ReactNode;
  variant?: Variant;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftSlot, rightSlot, className, variant = "default", ...props }, ref) => (
    <label className={clsx("lyd-field", error && "is-error", className)}>
      {label && <span className="lyd-field__label">{label}</span>}
      <span className={clsx("lyd-input", `lyd-input--${variant}`)}>
        {leftSlot && <span className="lyd-input__slot">{leftSlot}</span>}
        <input ref={ref} {...props} className="lyd-input__control" />
        {rightSlot && <span className="lyd-input__slot">{rightSlot}</span>}
      </span>
      {hint && !error && <span className="lyd-field__hint">{hint}</span>}
      {error && <span className="lyd-field__error">{error}</span>}
    </label>
  )
);

Input.displayName = "Input";
