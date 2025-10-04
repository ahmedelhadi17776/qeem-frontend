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
      <div className='input-wrapper'>
        {label && (
          <label htmlFor={inputId} className='input-label'>
            {label}
          </label>
        )}
        <div className='input-container'>
          {leftIcon && (
            <div className='input-icon input-icon-left'>{leftIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'input-field',
              hasError && 'is-invalid',
              hasLeftIcon && 'input-with-icon-left',
              hasRightIcon && 'input-with-icon-right',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className='input-icon input-icon-right'>{rightIcon}</div>
          )}
        </div>
        {error && <span className='input-error'>{error}</span>}
        {helperText && !error && (
          <span className='input-helper'>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
