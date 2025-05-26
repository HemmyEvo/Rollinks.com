import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./(roots)/_components/Header";
import Footer from "./(roots)/_components/Footer";
import CartProvider from "./(roots)/_components/Provider";
import ScrollToTopWrapper from "./(roots)/_components/ScrollToTopWrapper";
import ScrollButton from "./(roots)/_components/ScrollButton";
import ShoppingCartModal from "./(roots)/_components/ShoppingCartModal";
import { Toaster } from "react-hot-toast";
import { ConvexClientProvider } from "@/provider/ConvexProvider";
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import Loading from "@/components/ui/Loading";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const gerald = localFont({
  src: "./fonts/GERALDINE PERSONAL USE.ttf",
  variable: "--font-genraldine",
  weight: "100 900",
});

const lover = localFont({
  src: "./fonts/LoversQuarrel-Regular.ttf",
  variable: "--font-lover",
  weight: "100 900",
});

// SEO Metadata
export const metadata: Metadata = {
  title: "Rollinks Skincare Store – Glow Starts Here",
  description:
    "Discover the science of radiant skin with Rollinks – your trusted store for premium, effective skincare solutions. Shop now for glowing, healthy skin backed by nature and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gerald.variable} ${lover.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ClerkLoading>
            <Loading />
          </ClerkLoading>

          <ClerkLoaded>
            <CartProvider>
              <Header />
              <ShoppingCartModal />
              <main className="pt-16">{children}</main>
              <Footer />
<ScrollButton />
<ScrollToTopWrappe />
            </CartProvider>
            <Toaster />
          </ClerkLoaded>
        </ConvexClientProvider>
      </body>
    </html>
  );
}