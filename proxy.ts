import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // Routes publiques
  const publicRoutes = [
    "/api/login",
    "/api/register",
  ];

  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicGetProducts =
    pathname.startsWith("/api/produits") && method === "GET";

  const isPublicGetProduct=
    pathname.startsWith("/api/test-db") && method === "GET";

  const isPublicGetCategory =
    pathname.startsWith("/api/category") && method === "GET";

  const isPublicGetBoutiqueConfig =
    pathname.startsWith("/api/boutiqueConfig") && method === "GET";

  const isPublicGetHomebar =
    pathname.startsWith("/api/homebar") && method === "GET";

  const isPublicGetUser =
    pathname.startsWith("/api/users") && method === "GET";

  const isPublicPutUser =
    pathname.startsWith("/api/users") && method === "PUT";

  // POST /api/produits/8/like
  const isPublicLike =
    /^\/api\/produits\/\d+\/like$/.test(pathname) &&
    method === "POST";

  // Autoriser les routes publiques
  if (
    isPublicRoute ||
    isPublicGetProducts ||
    isPublicGetCategory ||
    isPublicGetBoutiqueConfig ||
    isPublicGetHomebar ||
    isPublicGetUser ||
    isPublicPutUser ||
    isPublicLike ||
    isPublicGetProduct
  ) {
    return NextResponse.next();
  }

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

    const adminRoutes = [
      "/api/produits",
      "/api/category",
      "/api/dashboard",
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

export const config = {
  matcher: ["/api/:path*"],
};