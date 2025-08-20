import React, { useEffect, useId, useMemo, useState } from 'react'
import { clsx } from 'clsx'

/**
 * Your required interface (verbatim).
 */
export interface InputFieldProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  invalid?: boolean
  variant?: 'filled' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Small, optional, non-breaking additions (for convenience).
 * You can ignore these at usage time; the component works fine without them.
 */
type Extra = {
  id?: string
  name?: string
  required?: boolean
  className?: string
  /** show a clear button when there is text */
  clearable?: boolean
  /** visual loading state and aria-busy */
  loading?: boolean
  /** input type, e.g., "text", "email", "password" */
  type?: React.HTMLInputTypeAttribute
  /** autofocus the input */
  autoFocus?: boolean
  /** left/right adornments if desired */
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Final public props type.
 */
export type InputProps = InputFieldProps & Extra

const sizeClasses: Record<NonNullable<InputFieldProps['size']>, string> = {
  sm: 'text-sm px-3 py-2 rounded-lg',
  md: 'text-base px-4 py-2.5 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-2xl'
}

const variantClasses: Record<
  NonNullable<InputFieldProps['variant']>,
  string
> = {
  filled:
    'bg-gray-100 dark:bg-gray-800 border border-transparent focus:ring-2 focus:ring-indigo-500',
  outlined:
    'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500',
  ghost:
    'bg-transparent border border-transparent focus:ring-2 focus:ring-indigo-500'
}

export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled = false,
      invalid = false,
      variant = 'outlined',
      size = 'md',

      /* extras */
      id,
      name,
      required,
      className,
      clearable = true,
      loading = false,
      type = 'text',
      autoFocus,
      leftIcon,
      rightIcon
    },
    ref
  ) => {
    const reactId = useId()
    const inputId = id ?? `input-${reactId}`
    const describedById = useMemo(() => {
      if (invalid && errorMessage) return `${inputId}-error`
      if (helperText) return `${inputId}-help`
      return undefined
    }, [invalid, errorMessage, helperText, inputId])

    const isControlled = value !== undefined
    const [innerValue, setInnerValue] = useState(value ?? '')

    useEffect(() => {
      if (isControlled) setInnerValue(value ?? '')
    }, [isControlled, value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerValue(e.target.value)
      onChange?.(e)
    }

    const handleClear = () => {
      if (disabled || loading) return
      if (isControlled) {
        // fire onChange with empty value so parent can update
        const event = {
          target: { value: '' }
        } as unknown as React.ChangeEvent<HTMLInputElement>
        onChange?.(event)
      } else {
        setInnerValue('')
      }
    }

    const currentValue = isControlled ? value ?? '' : innerValue
    const showError = invalid && !!errorMessage

    return (
      <div className={clsx('w-full', className)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-100"
          >
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        ) : null}

        <div className="relative flex items-center">
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 inline-flex items-center">
              {leftIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            autoFocus={autoFocus}
            className={clsx(
              'block w-full outline-none transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-500',
              sizeClasses[size],
              variantClasses[variant],
              disabled || loading ? 'opacity-60 cursor-not-allowed' : '',
              showError
                ? 'border-red-500 focus:ring-red-500'
                : variant === 'outlined'
                ? 'focus:border-indigo-500'
                : '',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : ''
            )}
            value={currentValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-invalid={invalid ? true : undefined}
            aria-disabled={disabled || loading ? true : undefined}
            aria-busy={loading ? true : undefined}
            aria-describedby={describedById}
            aria-label={!label && placeholder ? placeholder : undefined}
            required={required}
          />

          {/* Right side controls (clear / custom rightIcon / loading spinner) */}
          <div className="pointer-events-none absolute right-2 flex items-center gap-1">
            {loading ? (
              <span
                aria-hidden
                className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-600"
              />
            ) : null}
          </div>

          {/* Clear button (pointer events enabled) */}
          {clearable && !!currentValue && !(disabled || loading) ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear input"
              className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 active:scale-95 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              ×
            </button>
          ) : null}

          {/* Optional right icon (shifted left a bit if clear is visible) */}
          {rightIcon && !loading ? (
            <span
              className={clsx(
                'absolute inline-flex items-center',
                clearable && !!currentValue ? 'right-10' : 'right-3'
              )}
            >
              {rightIcon}
            </span>
          ) : null}
        </div>

        {/* Helper / error text */}
        {showError ? (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-help`}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

InputField.displayName = 'InputField'
export default InputField
