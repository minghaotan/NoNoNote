import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading,
  className = '',
  disabled,
  ...props
}) => {
  // Styles based on STYLES constant
  // shadow: shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]
  // shadowActive: active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]

  const baseStyles =
    'transition-all duration-100 font-mono active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-ink text-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-ink-light px-6 py-2 uppercase tracking-widest text-sm font-bold',
    secondary:
      'bg-white text-ink border-2 border-ink shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-gray-50 px-6 py-2 uppercase tracking-widest text-sm font-bold',
    // Changed from bg-accent to bg-ink for neutral primary action
    icon: 'p-3 rounded-full bg-ink text-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex items-center justify-center hover:bg-ink-light',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          ...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
