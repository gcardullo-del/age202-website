import "server-only";

import {
  createClient,
} from "@/lib/supabase/server";


export const AGE202_ADMIN_EMAIL =
  "g.cardullo@gmail.com";


export class AdminAuthError extends Error {
  status: 401 | 403;

  constructor(
    message: string,
    status: 401 | 403,
  ) {
    super(message);

    this.name =
      "AdminAuthError";

    this.status =
      status;
  }
}


export type AGE202Admin = {
  email: string;
};


function normalizeEmail(
  value: string,
) {
  return value
    .trim()
    .toLowerCase();
}


export async function getAdmin(): Promise<AGE202Admin | null> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.getClaims();

  if (
    error ||
    !data?.claims
  ) {
    return null;
  }

  const rawEmail =
    data.claims.email;

  if (
    typeof rawEmail !==
    "string"
  ) {
    return null;
  }

  const email =
    normalizeEmail(
      rawEmail,
    );

  if (
    email !==
    normalizeEmail(
      AGE202_ADMIN_EMAIL,
    )
  ) {
    return null;
  }

  return {
    email,
  };
}


export async function requireAdmin(): Promise<AGE202Admin> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.getClaims();

  if (
    error ||
    !data?.claims
  ) {
    throw new AdminAuthError(
      "Authentication required.",
      401,
    );
  }

  const rawEmail =
    data.claims.email;

  if (
    typeof rawEmail !==
    "string"
  ) {
    throw new AdminAuthError(
      "Authenticated user has no valid email claim.",
      403,
    );
  }

  const email =
    normalizeEmail(
      rawEmail,
    );

  if (
    email !==
    normalizeEmail(
      AGE202_ADMIN_EMAIL,
    )
  ) {
    throw new AdminAuthError(
      "This account is not authorized to access the AGE202 Museum Admin.",
      403,
    );
  }

  return {
    email,
  };
}


export function getAdminAuthErrorStatus(
  error: unknown,
): 401 | 403 | 500 {
  if (
    error instanceof
    AdminAuthError
  ) {
    return error.status;
  }

  return 500;
}