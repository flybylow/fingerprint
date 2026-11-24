import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PREFIX = "/portfolio";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname !== PREFIX && !pathname.startsWith(`${PREFIX}/`)) return NextResponse.next();

  if (process.env.NODE_ENV === "development") {
    const dest = /\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith("/") ? pathname : `${pathname}/`;
    return NextResponse.rewrite(new URL(`${dest}${search}`, "http://127.0.0.1:4321"));
  }

  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname.endsWith("/") ? `${pathname}index.html` : `${pathname}/index.html`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/portfolio", "/portfolio/:path*"],
};
