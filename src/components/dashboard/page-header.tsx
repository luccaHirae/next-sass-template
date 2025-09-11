export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
        {description && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}
