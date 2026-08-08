type AdminTextareaProps = {
  name: string;
  label: string;

  defaultValue?: string | null;

  placeholder?: string;

  description?: string;

  required?: boolean;

  disabled?: boolean;

  rows?: number;

  className?: string;
};

export default function AdminTextarea({
  name,
  label,
  defaultValue = "",
  placeholder,
  description,
  required = false,
  disabled = false,
  rows = 5,
  className = "",
}: AdminTextareaProps) {
  return (
    <label
      className={[
        "block space-y-2.5",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-sm font-semibold text-white/80">
            {label}
          </span>

          {description && (
            <p className="mt-1 text-xs leading-5 text-white/35">
              {description}
            </p>
          )}
        </div>

        {required && (
          <span className="shrink-0 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-lime-200/70">
            Required
          </span>
        )}
      </div>

      <textarea
        name={name}
        rows={rows}
        defaultValue={
          defaultValue ?? ""
        }
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={[
          "w-full rounded-2xl border border-white/10",
          "bg-[#08111F] px-4 py-3",
          "text-sm leading-7 text-white",
          "outline-none transition duration-200",
          "placeholder:text-white/20",
          "focus:border-lime-300/35",
          "focus:bg-[#091421]",
          "focus:ring-4 focus:ring-lime-300/[0.035]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-45",
          "resize-y",
        ].join(" ")}
      />
    </label>
  );
}