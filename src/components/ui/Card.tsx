import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  children,
  variant = 'default',
  hover = false,
  className = '',
  onClick,
}: CardProps) => {
  const baseStyles = 'rounded-xl transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-slate-200',
  };
  
  const hoverStyles = hover
    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1'
    : '';
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`p-6 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`p-6 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  );
};
