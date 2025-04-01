import { authRoutes, DEFAULT_LOGIN_REDIRECT, DEFAULT_REDIRECT } from "@/route";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;

  const isLoggedIn = cookies.has("token");
  const isAdmin = cookies.get("role")?.value === "ADMIN";
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // if (isLoggedIn && isAuthRoute) {
   // return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  // }

   // if (!isLoggedIn && !isAuthRoute) {
   // return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
 // }

  // return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
