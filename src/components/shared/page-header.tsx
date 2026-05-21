import { cn } from '@/lib/utils';

// Server-component-friendly header — accepts JSX icon (not component reference)
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl md:rounded-2xl border border-border/40 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-rose-500/5 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 animate-fade-in-up', className)}
    >
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="relative flex items-end justify-between flex-wrap gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-2 mb-2">
              {icon && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center soft-shadow text-white [&_svg]:w-3.5 [&_svg]:h-3.5 flex-shrink-0">
                  {icon}
                </div>
              )}
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</span>
            </div>
          )}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05]">{title}</h1>
          {subtitle && <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
