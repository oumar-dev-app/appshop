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

  const isPublicRoute = publicRoutes.some(route =>
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
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Token manquant" },
      { status: 401 }
    );
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return NextResponse.json(
      { message: "Format invalide" },
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

    const isAdminRoute = adminRoutes.some(route =>
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
    return NextResponse.json(
      { message: "Token invalide" },
      { status: 401 }
    );
  }
}

// =========================
// ⚠️ IMPORTANT EXPORT CONFIG
// =========================
export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
  ],
};