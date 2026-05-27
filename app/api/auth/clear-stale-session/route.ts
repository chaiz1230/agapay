import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  // Clear standard session cookies
  cookieStore.delete("authjs.session-token");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-authjs.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  
  // Clear callbacks & CSRF cookies to be thorough
  cookieStore.delete("authjs.callback-url");
  cookieStore.delete("authjs.csrf-token");
  cookieStore.delete("next-auth.callback-url");
  cookieStore.delete("next-auth.csrf-token");

  const requestUrl = new URL(request.url);
  const redirectUrl = new URL("/login", requestUrl.origin);
  
  return NextResponse.redirect(redirectUrl);
}
