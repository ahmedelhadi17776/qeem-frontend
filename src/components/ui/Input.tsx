'use client';

import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, className, id, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(error);
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon);

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-semibold text-text-main mb-2'
          >
            {label}
          </label>
        )}
        <div className='relative'>
          {leftIcon && (
            <div className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none'>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-surface border-2 border-border rounded-md px-4 py-3.5 text-base text-text-main font-inherit transition-all duration-DEFAULT ease-out',
              'placeholder:text-text-muted placeholder:opacity-70',
              'focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg',
              hasError &&
                'border-danger focus:border-danger focus:ring-danger/10',
              hasLeftIcon && 'pl-12',
              hasRightIcon && 'pr-12',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none'>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className='block mt-1 text-sm text-danger'>{error}</span>
        )}
        {helperText && !error && (
          <span className='block mt-1 text-sm text-text-muted'>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
