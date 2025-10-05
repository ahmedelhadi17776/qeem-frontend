import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'relative inline-flex items-center justify-center gap-2 font-bold text-center whitespace-nowrap cursor-pointer select-none border-0 transition-all duration-fast ease-out touch-manipulation';

    const variantClasses = {
      primary:
        'bg-gradient-to-b from-accent to-accent-dark text-white px-7 py-3.5 rounded-md shadow-lg shadow-accent/24 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/32 active:translate-y-0 active:shadow-lg active:shadow-accent/24',
      secondary:
        'bg-transparent border-2 border-primary text-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white dark:border-text-main dark:text-text-main dark:hover:bg-text-main dark:hover:text-primary',
      ghost:
        'bg-transparent text-text-body px-6 py-3 rounded-md hover:bg-primary/6 dark:hover:bg-text-main/6',
      danger:
        'bg-danger text-white px-7 py-3.5 rounded-md shadow-lg hover:bg-red-600 hover:shadow-xl active:shadow-lg',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-7 py-3.5 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
    const loadingClasses = 'text-transparent pointer-events-none';

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          (disabled ?? loading) && disabledClasses,
          loading && loadingClasses,
          className
        )}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin' />
          </div>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
