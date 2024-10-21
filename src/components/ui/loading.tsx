import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const loadingVariants = cva('origin-center rounded-full animate-spin', {
  variants: {
    variant: {
      default: 'border-b-white/20 border-l-white/20 border-r-white/20 border-t-primary',
      light: 'border-b-white/20 border-l-white/20 border-r-white/20 border-t-white'
    },
    size: {
      xs: 'h-5 w-5',
      sm: 'h-7 w-7',
      md: 'h-9 w-9',
      lg: 'h-12 w-12',
      icon: 'h-5 w-5'
    },
    thickness: {
      2: 'border-2',
      3: 'border-3',
      4: 'border-4',
      5: 'border-5',
      6: 'border-6',
      7: 'border-7',
      8: 'border-8'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    thickness: 4
  }
});

export interface LoadingProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
  thickness?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant, size, thickness, ...props }, ref) => {
    return <div ref={ref} className={cn(loadingVariants({ variant, size, thickness }))} {...props}></div>;
  }
);

Loading.displayName = 'Loading';

export { Loading, loadingVariants };
