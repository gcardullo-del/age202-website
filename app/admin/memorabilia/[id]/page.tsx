import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

import MemorabiliaForm from "../new/components/MemorabiliaForm";

export const dynamic =
  "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMemorabiliaPage({
  params,
}: PageProps) {
  const { id } =
    await params;

  const [
    memorabilia,
    players,
  ] = await Promise.all([
    prisma.memorabilia.findUnique({
      where: {
        id,
      },

      include: {
        images: {
          orderBy: {
            sortOrder:
              "asc",
          },
        },
      },
    }),

    prisma.player.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!memorabilia) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit Memorabilia"
      description="Update an existing AGE202 collectible record."
    >
      <MemorabiliaForm
        mode="edit"
        memorabiliaId={memorabilia.id}
        players={players}
        initialValues={{
          title:
            memorabilia.title,

          subtitle:
            memorabilia.subtitle,

          inventoryNumber:
            memorabilia.inventoryNumber,

          slug:
            memorabilia.slug,

          description:
            memorabilia.description,

          type:
            memorabilia.type,

          status:
            memorabilia.status,

          availability:
            memorabilia.availability,

          condition:
            memorabilia.condition,

          rarity:
            memorabilia.rarity,

          featured:
            memorabilia.featured,

          displayOrder:
            memorabilia.displayOrder,

          playerId:
            memorabilia.playerId,

          year:
            memorabilia.year,

          brand:
            memorabilia.brand,

          collection:
            memorabilia.collection,

          edition:
            memorabilia.edition,

          serialNumber:
            memorabilia.serialNumber,

          cardSet:
            memorabilia.cardSet,

          cardNumber:
            memorabilia.cardNumber,

          gradingCompany:
            memorabilia.gradingCompany,

          grade:
            memorabilia.grade,

          gradingCertNumber:
            memorabilia.gradingCertNumber,

          signed:
            memorabilia.signed,

          signedBy:
            memorabilia.signedBy,

          signatureLocation:
            memorabilia.signatureLocation,

          authentic:
            memorabilia.authentic,

          authenticationCompany:
            memorabilia.authenticationCompany,

          authenticityCode:
            memorabilia.authenticityCode,

          certificateUrl:
            memorabilia.certificateUrl,

          material:
            memorabilia.material,

          size:
            memorabilia.size,

          colour:
            memorabilia.colour,

          price:
            memorabilia.price?.toString() ??
            null,

          currency:
            memorabilia.currency,

          tags:
            memorabilia.tags,

          metaTitle:
            memorabilia.metaTitle,

          metaDescription:
            memorabilia.metaDescription,

          images:
            memorabilia.images.map(
              (image) => ({
                id:
                  image.id,

                url:
                  image.url,

                alt:
                  image.alt,

                isCover:
                  image.isCover,

                sortOrder:
                  image.sortOrder,
              }),
            ),
        }}
      />
    </AdminShell>
  );
}