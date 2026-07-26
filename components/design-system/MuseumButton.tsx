import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "default" | "large";
  icon?: ReactNode;
  className?: string;
};

type LinkProps = SharedProps & {
  href: string;
  type?: never;
};

type NativeProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type MuseumButtonProps = LinkProps | NativeProps;

const variantClasses = {
  primary:
    "bg-[var(--age-lime)] text-[var(--age-bg-primary)] hover:bg-white hover:shadow-[var(--age-shadow-lime)]",
  secondary:
    "border border-white/12 bg-white/[0.03] text-white hover:border-[var(--age-lime)]/40 hover:text-[var(--age-lime)]",
  ghost: "text-white/60 hover:bg-white/[0.05] hover:text-white",
};

const sizeClasses = {
  small: "min-h-11 px-5 text-[8px]",
  default: "min-h-14 px-7 text-[9px]",
  large: "min-h-16 px-9 text-[10px]",
};

export default function MuseumButton(props: MuseumButtonProps) {
  const {
    children,
    variant = "primary",
    size = "default",
    icon,
    className,
  } = props;

  const classes = cn(
    "group inline-flex items-center justify-center gap-4 rounded-full font-black uppercase tracking-[0.23em]",
    "transition duration-300 hover:scale-[1.025] disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--age-lime)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--age-bg-primary)]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          {icon}
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    icon: _icon,
    className: _className,
    ...buttonProps
  } = props as NativeProps;

  void _variant;
  void _size;
  void _icon;
  void _className;

  return (
    <button {...buttonProps} className={classes}>
      {content}
    </button>
  );
}
