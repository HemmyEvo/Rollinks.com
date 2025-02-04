import { withAuth } from "@clerk/nextjs";

export default withAuth({
    publicRoutes: ["/", "/about-us", "/contact", "/product", "/forgot-password", "/verify-code"]
});

export const config = {
    matcher: [
        "/((?!.+\\.[\\w]+$|_next).*)",
        "/",
        "/(api|trpc)(.*)"
    ]
};