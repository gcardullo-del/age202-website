import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function PrimaryButton({
  href,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-full bg-[#C8FF00] px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-105"
    >
      {children}
    </Link>
  );
}