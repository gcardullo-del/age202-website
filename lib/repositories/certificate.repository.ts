import type {
  Prisma,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const CERTIFICATE_CODE_PREFIX = "AGE202-";
const CERTIFICATE_CODE_LENGTH = 6;
const MAX_CREATE_ATTEMPTS = 5;

const certificateRelations = {
  artifact: {
    include: {
      player: true,
      brand: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  },
} satisfies Prisma.CertificateInclude;

export type CreateCertificateData = {
  artifactId: string;
  curator?: string;
  notes?: string;
  qrCodeUrl?: string;
  verified?: boolean;
  issuedAt?: Date;
};

export type UpdateCertificateData = {
  curator?: string | null;
  notes?: string | null;
  qrCodeUrl?: string | null;
  verified?: boolean;
  issuedAt?: Date;
};

function formatCertificateCode(
  sequence: number,
): string {
  return `${CERTIFICATE_CODE_PREFIX}${String(
    sequence,
  ).padStart(CERTIFICATE_CODE_LENGTH, "0")}`;
}

function getSequenceFromCode(
  code: string,
): number {
  if (!code.startsWith(CERTIFICATE_CODE_PREFIX)) {
    return 0;
  }

  const sequence = Number.parseInt(
    code.slice(CERTIFICATE_CODE_PREFIX.length),
    10,
  );

  return Number.isFinite(sequence)
    ? sequence
    : 0;
}

function isUniqueConstraintError(
  error: unknown,
): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return false;
  }

  return error.code === "P2002";
}

export async function generateCertificateCode(
  transaction: Prisma.TransactionClient = prisma,
): Promise<string> {
  const latestCertificate =
    await transaction.certificate.findFirst({
      where: {
        code: {
          startsWith: CERTIFICATE_CODE_PREFIX,
        },
      },
      select: {
        code: true,
      },
      orderBy: {
        code: "desc",
      },
    });

  const latestSequence = latestCertificate
    ? getSequenceFromCode(latestCertificate.code)
    : 0;

  return formatCertificateCode(
    latestSequence + 1,
  );
}

export async function getCertificates() {
  return prisma.certificate.findMany({
    include: certificateRelations,
    orderBy: {
      issuedAt: "desc",
    },
  });
}

export async function getCertificateById(
  id: string,
) {
  return prisma.certificate.findUnique({
    where: {
      id,
    },
    include: certificateRelations,
  });
}

export async function getCertificateByCode(
  code: string,
) {
  return prisma.certificate.findUnique({
    where: {
      code,
    },
    include: certificateRelations,
  });
}

export async function getCertificateByArtifactId(
  artifactId: string,
) {
  return prisma.certificate.findUnique({
    where: {
      artifactId,
    },
    include: certificateRelations,
  });
}

export async function createCertificate(
  data: CreateCertificateData,
) {
  const existingCertificate =
    await prisma.certificate.findUnique({
      where: {
        artifactId: data.artifactId,
      },
      include: certificateRelations,
    });

  if (existingCertificate) {
    return existingCertificate;
  }

  for (
    let attempt = 1;
    attempt <= MAX_CREATE_ATTEMPTS;
    attempt += 1
  ) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const code =
            await generateCertificateCode(
              transaction,
            );

          return transaction.certificate.create({
            data: {
              code,

              issuedAt:
                data.issuedAt ?? new Date(),

              verified:
                data.verified ?? true,

              curator:
                data.curator ??
                "AGE202 Museum",

              notes: data.notes,

              qrCodeUrl: data.qrCodeUrl,

              artifact: {
                connect: {
                  id: data.artifactId,
                },
              },
            },

            include: certificateRelations,
          });
        },
      );
    } catch (error) {
      if (
        !isUniqueConstraintError(error) ||
        attempt === MAX_CREATE_ATTEMPTS
      ) {
        throw error;
      }
    }
  }

  throw new Error(
    "Unable to generate a unique certificate code.",
  );
}

export async function updateCertificate(
  id: string,
  data: UpdateCertificateData,
) {
  return prisma.certificate.update({
    where: {
      id,
    },
    data,
    include: certificateRelations,
  });
}

export async function verifyCertificate(
  id: string,
) {
  return prisma.certificate.update({
    where: {
      id,
    },
    data: {
      verified: true,
    },
    include: certificateRelations,
  });
}

export async function revokeCertificate(
  id: string,
) {
  return prisma.certificate.update({
    where: {
      id,
    },
    data: {
      verified: false,
    },
    include: certificateRelations,
  });
}

export async function deleteCertificate(
  id: string,
) {
  return prisma.certificate.delete({
    where: {
      id,
    },
  });
}