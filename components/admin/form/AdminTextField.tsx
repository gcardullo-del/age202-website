import type {
  HTMLInputTypeAttribute,
} from "react";

type AdminTextFieldProps = {
  name: string;
  label: string;

  defaultValue?: string | number | null;

  type?: HTMLInputTypeAttribute;

  placeholder?: string;

  description?: string;

  required?: boolean;

  disabled?: boolean;

  autoComplete?: string;

  min?: number;

  max?: number;

  step?: number;

  className?: string;
};

export default function AdminTextField({
  name,
  label,
  defaultValue = "",
  type = "text",
  placeholder,
  description,
  required = false,
  disabled = false,
  autoComplete,
  min,
  max,
  step,
  className = "",
}: AdminTextFieldProps) {
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

          {description ? (
            <p className="mt-1 text-xs leading-5 text-white/35">
              {description}
            </p>
          ) : null}
        </div>

        {required ? (
          <span className="shrink-0 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-lime-200/70">
            Required
          </span>
        ) : null}
      </div>

      <input
        type={type}
        name={name}
        defaultValue={
          defaultValue ?? ""
        }
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        className={[
          "h-12 w-full rounded-2xl border border-white/10",
          "bg-[#08111F] px-4",
          "text-sm text-white",
          "outline-none transition duration-200",
          "placeholder:text-white/20",
          "focus:border-lime-300/35",
          "focus:bg-[#091421]",
          "focus:ring-4 focus:ring-lime-300/[0.035]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-45",
        ].join(" ")}
      />
    </label>
  );
}