import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function SecondaryButton({
  href,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-full border border-white/20 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-[#C8FF00] hover:text-[#C8FF00]"
    >
      {children}
    </Link>
  );
}