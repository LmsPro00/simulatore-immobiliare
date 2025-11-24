import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Info } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  tooltip?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      icon,
      tooltip,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
            {label}
            {tooltip && (
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-10">
                  {tooltip}
                </div>
              </div>
            )}
          </label>
        )}
        
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              {prefix}
            </span>
          )}
          
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-lg border-2 transition-all
              ${prefix ? 'pl-8' : ''}
              ${suffix ? 'pr-12' : ''}
              ${icon ? 'pl-10' : ''}
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-200 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-slate-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              {suffix}
            </span>
          )}
        </div>
        
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
