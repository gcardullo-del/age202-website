import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Container({ children }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {children}
    </div>
  );
}