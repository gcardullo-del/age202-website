type Props = {
  children: React.ReactNode;
  color?: string;
};

export default function Badge({
  children,
  color = "#C8FF00",
}: Props) {
  return (
    <span
      className="inline-flex rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-[0.25em]"
      style={{
        color,
        borderColor: color,
      }}
    >
      {children}
    </span>
  );
}