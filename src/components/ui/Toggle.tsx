import { InputHTMLAttributes, forwardRef } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-center justify-between cursor-pointer ${className}`}>
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
