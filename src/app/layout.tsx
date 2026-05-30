import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Manrope} from 'next/font/google'
import { ThemeProvider } from "@/components/ui/themes";
import ReactQueryProvider from "@/react-query";


const manrope=Manrope({subsets: ['latin']})
export const metadata: Metadata = {
  title: "Streamline",
  description: "Share AI powered videos with everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="dark"
        style={{ colorScheme: "dark" }}
        suppressHydrationWarning
      >
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <ReactQueryProvider>
            {children}
            </ReactQueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
