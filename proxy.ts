import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // =========================
  // 🔓 ROUTES PUBLIQUES
  // =========================
  const publicRoutes = [
    "/api/login",
    "/api/register",
    "/api/upload",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicGet =
    (
      pathname.startsWith("/api/produits") ||
      pathname.startsWith("/api/category") ||
      pathname.startsWith("/api/boutiqueConfig") ||
      pathname.startsWith("/api/homebar") ||
      pathname.startsWith("/api/users") ||
      pathname.startsWith("/api/test-db") ||
      pathname.startsWith("/api/commandes")
    ) && method === "GET";

  const isPublicLike =
    /^\/api\/produits\/\d+\/like$/.test(pathname) &&
    method === "POST";

  if (isPublicRoute || isPublicGet || isPublicLike) {
    return NextResponse.next();
  }

  // =========================
  // 🔐 TOKEN CHECK
  // =========================
  console.log("COOKIE TOKEN =", req.cookies.get("token"));
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Pour les pages dashboard → redirection login
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    // Pour les API → erreur JSON
    return NextResponse.json(
      { message: "Token manquant" },
      { status: 401 }
    );
  }

  try {
    const decoded: any = await verifyToken(token);

    // =========================
    // 🔒 ADMIN ROUTES
    // =========================
    const adminRoutes = [
      "/api/produits",
      "/api/category",
      "/api/dashboard",
      "/api/commandes",
    ];

    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Accès refusé" },
        { status: 403 }
      );
    }

    return NextResponse.next();

  } catch (error) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    return NextResponse.json(
      { message: "Token invalide" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
  ],
};

