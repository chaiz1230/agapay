import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      
      const isPatientDashboard = nextUrl.pathname.startsWith("/patient");
      const isDoctorDashboard = nextUrl.pathname.startsWith("/doctor");
      const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isPatientDashboard) {
        if (!isLoggedIn) return false;
        if (role !== "PATIENT") {
          return Response.redirect(new URL(role === "DOCTOR" ? "/doctor" : "/", nextUrl));
        }
        return true;
      }

      if (isDoctorDashboard) {
        if (!isLoggedIn) return false;
        if (role !== "DOCTOR") {
          return Response.redirect(new URL(role === "PATIENT" ? "/patient" : "/", nextUrl));
        }
        return true;
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL(role === "DOCTOR" ? "/doctor" : "/patient", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
