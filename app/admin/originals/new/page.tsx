import AdminShell from "@/components/admin/AdminShell";

import OriginalProductForm from "../components/OriginalProductForm";

export default function NewOriginalPage() {
  return (
    <AdminShell
      title="New Original"
      description="Create an official AGE202 branded product."
    >
      <OriginalProductForm />
    </AdminShell>
  );
}
