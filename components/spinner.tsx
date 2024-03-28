import { Loader } from 'lucide-react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const spinnerVariants = cva('text-muted-foreground animate-spin', {
  variants: {
    size: {
      default: 'h-4 w-4',
      sm: 'w-2 h-2',
      lg: 'w-6 h-6',
      icon: 'w-10 h-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner: React.FC<SpinnerProps> = ({ size }) => {
  return <Loader className={cn(spinnerVariants({ size }))} />;
};
