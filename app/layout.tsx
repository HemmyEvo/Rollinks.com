import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./(roots)/_components/Header";
import Footer from "./(roots)/_components/Footer";
import CartProvider from "./(roots)/_components/Provider";
import ShoppingCartModal from "./(roots)/_components/ShoppingCartModal";
import {Toaster} from "react-hot-toast"
import { ConvexClientProvider } from "@/provider/ConvexProvider";
import { ClerkLoading } from "@clerk/nextjs";
import Loading from "@/components/ui/Loading";
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

export const metadata: Metadata = {
  title: "Rollinks Store",
  description: "This is a skincare store",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans} ${lover}   ${gerald} ${geistMono} antialiased`}
      >
        <ConvexClientProvider> 
          <ClerkLoading>
          <Loading />  
          </ClerkLoading>  
        <CartProvider>
        <Header />
        <ShoppingCartModal />
        <div className="py-32">
        {children}
</div>
        <Footer/>
        </CartProvider>
       
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
