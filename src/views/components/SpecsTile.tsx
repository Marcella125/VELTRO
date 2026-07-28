type SpecsTileProps = {
  label: string;
  value: string;
};

export function SpecsTile({ label, value }: SpecsTileProps) {
  return (
    <div className="col-span-4 rounded-2xl border border-red-900/30 bg-zinc-950/70 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-xl text-zinc-100">{value}</p>
    </div>
  );
}
