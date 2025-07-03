'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-b from-primary-400 to-primary-600 text-white shadow-game hover:shadow-game-hover focus:ring-primary-500 active:from-primary-500 active:to-primary-700',
    secondary: 'bg-white text-primary-700 border-2 border-primary-200 shadow-game hover:shadow-game-hover hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-gradient-to-b from-red-400 to-red-600 text-white shadow-game hover:shadow-game-hover focus:ring-red-500 active:from-red-500 active:to-red-700',
    ghost: 'text-primary-700 hover:bg-primary-50 focus:ring-primary-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-body-sm',
    md: 'px-6 py-3 text-body-md',
    lg: 'px-8 py-4 text-body-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Carregando...
        </div>
      ) : (
        children
      )}
    </button>
  );
}; 