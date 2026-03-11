import { SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      <div className="mb-4 text-foreground-muted opacity-40">
        {icon ?? <SearchX className="h-12 w-12" />}
      </div>
      <h3 className="text-foreground font-semibold text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-foreground-muted text-sm max-w-xs">{description}</p>
      )}
      {action && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
