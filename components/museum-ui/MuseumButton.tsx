import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small";
  icon?: ReactNode;
  className?: string;
};

type LinkButtonProps = SharedProps & {
  href: string;
  type?: never;
  onClick?: never;
};

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type MuseumButtonProps =
  | LinkButtonProps
  | NativeButtonProps;

const variantClasses = {
  primary:
    "bg-[#C8FF00] text-[#050B18] hover:bg-white hover:shadow-[0_0_45px_rgba(200,255,0,0.18)]",
  secondary:
    "border border-white/10 bg-white/[0.025] text-white hover:border-[#C8FF00]/40 hover:text-[#C8FF00]",
  ghost:
    "text-white/60 hover:bg-white/[0.04] hover:text-white",
};

const sizeClasses = {
  default: "min-h-14 px-7",
  small: "min-h-11 px-5",
};

export default function MuseumButton(
  props: MuseumButtonProps
) {
  const {
    children,
    variant = "primary",
    size = "default",
    icon,
    className = "",
  } = props;

  const classes = [
    "group inline-flex items-center justify-center gap-5 rounded-full",
    "text-[9px] font-black uppercase tracking-[0.23em]",
    "transition duration-300 hover:scale-[1.025]",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4",
    "focus-visible:ring-offset-[#050B18]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  const content = (
    <>
      <span>{children}</span>

      {icon && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          {icon}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  const {
    href: _href,
    variant: _variant,
    size: _size,
    icon: _icon,
    className: _className,
    ...buttonProps
  } = props as NativeButtonProps;

  void _variant;
  void _size;
  void _icon;
  void _className;
  void _href;

  return (
    <button
      {...buttonProps}
      className={classes}
    >
      {content}
    </button>
  );
}