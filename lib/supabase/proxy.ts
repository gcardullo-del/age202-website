import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";


const ADMIN_EMAIL =
  "g.cardullo@gmail.com";


export async function updateSession(
  request: NextRequest,
) {
  let supabaseResponse =
    NextResponse.next({
      request,
    });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Variabile NEXT_PUBLIC_SUPABASE_URL mancante nel file .env.local",
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Variabile NEXT_PUBLIC_SUPABASE_ANON_KEY mancante nel file .env.local",
    );
  }

  const supabase =
    createServerClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            supabaseResponse =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                supabaseResponse.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );
          },
        },
      },
    );

  /*
   * Verifica il JWT e consente a Supabase di aggiornare
   * i cookie della sessione quando necessario.
   *
   * Non inserire codice tra createServerClient() e getClaims().
   */
  const {
    data,
  } =
    await supabase.auth.getClaims();

  const pathname =
    request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/",
    );

  const isLoginRoute =
    pathname ===
    "/admin/login";

  const rawEmail =
    data?.claims?.email;

  const authenticatedEmail =
    typeof rawEmail ===
    "string"
      ? rawEmail
          .trim()
          .toLowerCase()
      : null;

  const isAuthorizedAdmin =
    authenticatedEmail ===
    ADMIN_EMAIL.toLowerCase();


  /*
   * Tutta l'area /admin è privata,
   * ad eccezione della pagina di login.
   */
  if (
    isAdminRoute &&
    !isLoginRoute &&
    !isAuthorizedAdmin
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      "/admin/login";

    loginUrl.searchParams.set(
      "next",
      pathname,
    );

    const response =
      NextResponse.redirect(
        loginUrl,
      );

    supabaseResponse.cookies
      .getAll()
      .forEach(
        ({
          name,
          value,
        }) => {
          response.cookies.set(
            name,
            value,
          );
        },
      );

    return response;
  }


  /*
   * Se l'Admin è già autenticato e prova ad aprire
   * /admin/login, lo riportiamo direttamente alla dashboard.
   */
  if (
    isLoginRoute &&
    isAuthorizedAdmin
  ) {
    const adminUrl =
      request.nextUrl.clone();

    adminUrl.pathname =
      "/admin";

    adminUrl.search =
      "";

    const response =
      NextResponse.redirect(
        adminUrl,
      );

    supabaseResponse.cookies
      .getAll()
      .forEach(
        ({
          name,
          value,
        }) => {
          response.cookies.set(
            name,
            value,
          );
        },
      );

    return response;
  }


  return supabaseResponse;
}