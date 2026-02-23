type StatCardProps = {
  title: string;
  value: string;
  helper?: string;
};

export function StatCard({ title, value, helper }: StatCardProps) {
  return (
    <div className="panel">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-400">{helper}</p> : null}
    </div>
  );
}
