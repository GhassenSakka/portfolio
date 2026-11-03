export function SectionHeading({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mb-10">
      {kicker ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-azure-600 dark:text-azure-300">
          {kicker}
        </p>
      ) : null}
      <div className="flex items-center gap-4">
        <span className="h-8 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-azure-500 to-azure-700" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent" />
      </div>
    </div>
  );
}
