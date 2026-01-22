import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'important' | 'promotional' | 'personal' | 'spam' | 'social' | 'updates';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  important: 'bg-red-100 text-red-800',
  promotional: 'bg-yellow-100 text-yellow-800',
  personal: 'bg-blue-100 text-blue-800',
  spam: 'bg-gray-100 text-gray-800',
  social: 'bg-purple-100 text-purple-800',
  updates: 'bg-green-100 text-green-800',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
