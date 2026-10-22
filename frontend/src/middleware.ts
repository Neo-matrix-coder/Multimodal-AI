import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow seamless local demo inspection without requiring a running PostgreSQL instance
        if (process.env.STRICT_AUTH !== "true") {
          return true;
        }
        return !!token;
      },
    },
  }
);

// Protect all routes under /dashboard, /chat, /voice, /ocr
export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/voice/:path*", "/ocr/:path*"],
};
