"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from "react";

import { age202Theme } from "@/lib/theme";

export type MuseumButtonVariant =
  | "primary"
  | "secondary"
  | "ghost";

export type MuseumButtonSize =
  | "small"
  | "medium"
  | "large";

type SharedProps = {
  children: ReactNode;
  variant?: MuseumButtonVariant;
  size?: MuseumButtonSize;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

type LinkProps = SharedProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href"
  > & {
    href: string;
    disabled?: boolean;
  };

type NativeButtonProps = SharedProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className"
  > & {
    href?: never;
  };

export type MuseumButtonProps =
  | LinkProps
  | NativeButtonProps;

const buttonTheme = {
  "--museum-button-background":
    age202Theme.colors.background.primary,
  "--museum-button-accent":
    age202Theme.colors.brand.lime,
} as CSSProperties;

const baseClasses =
  "group inline-flex items-center justify-center rounded-full text-center font-black uppercase transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variantClasses: Record<
  MuseumButtonVariant,
  string
> = {
  primary:
    "bg-[var(--museum-button-accent)] text-[var(--museum-button-background)] hover:scale-[1.03] hover:bg-white focus-visible:ring-[var(--museum-button-accent)] focus-visible:ring-offset-[var(--museum-button-background)]",
  secondary:
    "border border-white/15 bg-white/[0.03] text-white backdrop-blur-md hover:border-white/35 hover:bg-white/[0.08] focus-visible:ring-white/60 focus-visible:ring-offset-[var(--museum-button-background)]",
  ghost:
    "border border-transparent bg-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.04] hover:text-white focus-visible:ring-white/50 focus-visible:ring-offset-[var(--museum-button-background)]",
};

const sizeClasses: Record<
  MuseumButtonSize,
  string
> = {
  small:
    "min-h-11 gap-3 px-5 text-[9px] tracking-[0.2em]",
  medium:
    "min-h-14 gap-4 px-7 text-[10px] tracking-[0.23em]",
  large:
    "min-h-16 gap-5 px-9 text-[11px] tracking-[0.24em]",
};

export default function MuseumButton({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  icon,
  iconPosition = "right",
  fullWidth = false,
  loading = false,
  loadingLabel = "Loading",
  ...props
}: MuseumButtonProps) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-current border-r-transparent"
        />
      ) : null}

      {!loading && icon && iconPosition === "left" ? (
        <ButtonIcon position="left">
          {icon}
        </ButtonIcon>
      ) : null}

      <span>
        {loading ? loadingLabel : children}
      </span>

      {!loading && icon && iconPosition === "right" ? (
        <ButtonIcon position="right">
          {icon}
        </ButtonIcon>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const {
      href,
      disabled = false,
      onClick,
      ...linkProps
    } = props;

    const isDisabled = disabled || loading;

    const handleClick = (
      event: MouseEvent<HTMLAnchorElement>,
    ) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    return (
      <Link
        href={href}
        style={buttonTheme}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : linkProps.tabIndex}
        onClick={handleClick}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const {
    disabled = false,
    type = "button",
    ...buttonProps
  } = props as NativeButtonProps;

  return (
    <button
      type={type}
      style={buttonTheme}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

type ButtonIconProps = {
  children: ReactNode;
  position: "left" | "right";
};

function ButtonIcon({
  children,
  position,
}: ButtonIconProps) {
  const movementClass =
    position === "left"
      ? "group-hover:-translate-x-0.5"
      : "group-hover:translate-x-0.5";

  return (
    <span
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${movementClass}`}
    >
      {children}
    </span>
  );
}