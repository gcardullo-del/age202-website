import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-lime-400 text-black hover:bg-lime-300"
      : "border border-white text-white hover:bg-white hover:text-black";

  return (
    <button
      className={`${styles} px-8 py-4 rounded-full font-semibold transition duration-300`}
    >
      {children}
    </button>
  );
}