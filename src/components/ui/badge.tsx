import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary border-primary/20',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive/10 text-destructive border-destructive/20',
        success: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        warning: 'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        outline: 'text-foreground border-border',
        gradient: 'border-transparent bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
