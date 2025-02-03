import {authMiddleware}  from "@clerk/nextjs/server";

export default authMiddleware({
    publicRoutes: ["/","/about-us","/contact","/product","/forgot-password", "/verify-code"]
});
export const config = {
    matcher: [
         "/((?!.+\\.[\\w]+$|_next).*)",
        "/",
        "/(api|trpc)(.*)"
    ]
};
