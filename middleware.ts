// middleware.ts
import { auth } from "@/app/auth"; // o "@/app/auth" según dónde tengas tu archivo
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const allowedPaths = ["/","asd"]

  if (!req.auth && !allowedPaths.includes(pathname) ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
