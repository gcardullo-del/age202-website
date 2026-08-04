import {
  notFound,
} from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import { prisma } from "@/lib/prisma";

import DeleteOriginalProductButton from "../components/DeleteOriginalProductButton";
import OriginalProductForm from "../components/OriginalProductForm";

export const dynamic =
  "force-dynamic";

export default async function EditOriginalPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const product =
    await prisma.originalProduct.findUnique(
      {
        where: {
          id,
        },
        include: {
          images: {
            orderBy: [
              {
                isCover: "desc",
              },
              {
                sortOrder: "asc",
              },
            ],
          },
        },
      },
    );

  if (!product) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit Original"
      description="Update the official AGE202 branded product."
    >
      <div className="mb-5 flex justify-end">
        <DeleteOriginalProductButton
          productId={product.id}
          productTitle={product.title}
        />
      </div>

      <OriginalProductForm
        mode="edit"
        productId={product.id}
        initialValues={{
          title: product.title,
          subtitle:
            product.subtitle,
          slug: product.slug,
          description:
            product.description,
          collection:
            product.collection,
          edition:
            product.edition,
          category:
            product.category,
          material:
            product.material,
          colour:
            product.colour,
          sizes: product.sizes,
          tags: product.tags,
          price:
            product.price?.toString() ??
            null,
          currency:
            product.currency,
          vintedUrl:
            product.vintedUrl,
          availability:
            product.availability,
          status:
            product.status,
          featured:
            product.featured,
          displayOrder:
            product.displayOrder,
          metaTitle:
            product.metaTitle,
          metaDescription:
            product.metaDescription,
          images:
            product.images,
        }}
      />
    </AdminShell>
  );
}
