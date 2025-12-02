import React, { forwardRef } from "react";

import { cn } from "../../lib/utils"; // We need to create this utility
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ButtonForward: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonProps
> = ({
  onClick,
  disabled,
  children,
  loading,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  ...props
}, ref) => {

    const variants = {
      primary: "btn-primary shadow-glow-sm hover:shadow-glow",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      outline: "border border-primary-500/50 text-primary-200 hover:bg-primary-500/10 hover:border-primary-500"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      icon: "p-2 w-10 h-10 flex items-center justify-center"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed gap-2",
          variants[variant],
          sizes[size],
          className
        )}
        onClick={onClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}

        {/* Shimmer Effect for Primary Buttons */}
        {variant === 'primary' && !loading && !disabled && (
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
        )}
      </button>
    );
  };

export const Button = forwardRef(ButtonForward);
