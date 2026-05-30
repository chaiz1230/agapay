import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const email = auth?.user?.email;
      const isWhitelisted = email && [
        "anne.liangco@whitecloak.com",
        "donn.gamboa@whitecloak.com",
        "miguel.fermin@whitecloak.com",
        "thea.juego@whitecloak.com",
        "cherubim.citco@whitecloak.com"
      ].includes(email.toLowerCase());
      
      const isPatientDashboard = nextUrl.pathname.startsWith("/patient");
      const isDoctorDashboard = nextUrl.pathname.startsWith("/doctor");
      const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
      const isRoot = nextUrl.pathname === "/";

      if (isPatientDashboard) {
        if (!isLoggedIn) return false;
        if (!isWhitelisted && role !== "PATIENT") {
          return Response.redirect(new URL(role === "DOCTOR" ? "/doctor" : "/", nextUrl));
        }
        return true;
      }

      if (isDoctorDashboard) {
        if (!isLoggedIn) return false;
        if (!isWhitelisted && role !== "DOCTOR") {
          return Response.redirect(new URL(role === "PATIENT" ? "/patient" : "/", nextUrl));
        }
        return true;
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL(role === "DOCTOR" ? "/doctor" : "/patient", nextUrl));
      }

      if (isRoot && isLoggedIn) {
        return Response.redirect(new URL(role === "DOCTOR" ? "/doctor" : "/patient", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;

        // Dynamic Role Override for Whitelisted Emails
        const WHITELIST_EMAILS = [
          "anne.liangco@whitecloak.com",
          "donn.gamboa@whitecloak.com",
          "miguel.fermin@whitecloak.com",
          "thea.juego@whitecloak.com",
          "cherubim.citco@whitecloak.com"
        ];

        if (session.user.email && WHITELIST_EMAILS.includes(session.user.email.toLowerCase())) {
          try {
            const { headers } = require("next/headers");
            const reqHeaders = headers();
            const pathname = reqHeaders.get("x-pathname") || "";
            const referer = reqHeaders.get("referer") || "";
            
            if (pathname.startsWith("/doctor") || referer.includes("/doctor")) {
              session.user.role = "DOCTOR";
            } else if (pathname.startsWith("/patient") || referer.includes("/patient")) {
              session.user.role = "PATIENT";
            }
          } catch (e) {
            // standard fallback
          }
        }
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
