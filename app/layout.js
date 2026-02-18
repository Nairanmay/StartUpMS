import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta"
});

export const metadata = {
  title: "StartupMS | Manage Your Empire",
  description: "All-in-one startup management solution",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less common:
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.variable} font-sans antialiased bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}