// export { default } from "next-auth/middleware"; 
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if ((req.nextUrl.pathname.startsWith("/Attorney/") || req.nextUrl.pathname.startsWith("/Subscription")) && req.nextauth.token?.role_id !== "3")
   
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/Subscription") && req.nextauth.token?.role_id === "3" && req.nextauth.token?.subscription !== "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/Attorney/") && req.nextauth.token?.role_id === "3" && req.nextauth.token?.subscription === "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if ((req.nextUrl.pathname.startsWith("/Physician/") || req.nextUrl.pathname.startsWith("/PhysicianSubscription")) && req.nextauth.token?.role_id !== "4")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/PhysicianSubscription") && req.nextauth.token?.role_id === "4" && req.nextauth.token?.subscription !== "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/Physician/") && req.nextauth.token?.role_id === "4" && req.nextauth.token?.subscription === "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if ((req.nextUrl.pathname.startsWith("/CourtReporter/") || req.nextUrl.pathname.startsWith("/CourtReporterSubscription")) && req.nextauth.token?.role_id !== "5")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/CourtReporterSubscription") && req.nextauth.token?.role_id === "5" && req.nextauth.token?.subscription !== "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/CourtReporter/") && req.nextauth.token?.role_id === "5" && req.nextauth.token?.subscription === "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
      if ((req.nextUrl.pathname.startsWith("/Expert/") || req.nextUrl.pathname.startsWith("/ExpertSubscription")) && req.nextauth.token?.role_id !== "8")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/ExpertSubscription") && req.nextauth.token?.role_id === "8" && req.nextauth.token?.subscription !== "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/Expert/") && req.nextauth.token?.role_id === "8" && req.nextauth.token?.subscription === "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
      if ((req.nextUrl.pathname.startsWith("/AttorneyAssistant/") || req.nextUrl.pathname.startsWith("/AttorneyAssistantSubscription")) && req.nextauth.token?.role_id !== "6")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/AttorneyAssistantSubscription") && req.nextauth.token?.role_id === "6" && req.nextauth.token?.subscription !== "false")
    return NextResponse.redirect(
      new URL("/Success", req.url)
    );
    if (req.nextUrl.pathname.startsWith("/AttorneyAssistant/") && req.nextauth.token?.role_id === "6" && req.nextauth.token?.subscription === "false")
      return NextResponse.redirect(
        new URL("/Success", req.url)
      );
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
export const config = {
  matcher: ["/Attorney/:path*", "/AttorneyAssistant/:path*","/Physician/:path*", "/Success", "/Subscription", "/CourtReporter/:path*","/Expert/:path*",
    "/CourtReporterSubscription", "/PhysicianSubscription","/ExpertSubscription","/AttorneyAssistantSubscription"],
};