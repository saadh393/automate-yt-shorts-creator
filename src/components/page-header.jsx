export default function PageHeader({
  title,
  subtitle = "Here's a list of your tasks for this month!",
}) {
  return (
    <div className="flex items-center justify-between space-y-2 py-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
