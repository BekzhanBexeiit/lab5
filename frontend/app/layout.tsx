import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Advanced Web Technologies — Course Catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-50 shadow-sm bg-white/80 backdrop-blur-sm border-b border-sky-100">
          <div className="max-w-6xl mx-auto">
            <NavBar />
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-sky-100 bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center gap-3 text-sm text-slate-400">
            <div className="flex items-center gap-4">
              <Link href="/courses" className="hover:text-sky-600 transition-colors">Courses</Link>
              <span>·</span>
              <Link href="/about" className="hover:text-sky-600 transition-colors">About</Link>
              <span>·</span>
              <a
                href="https://github.com/beka070/course-catalog-2-lab2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 transition-colors"
              >
                GitHub
              </a>
            </div>
            <span className="text-slate-400 text-xs">
              © 2026 Course Catalog · Advanced Web Technologies Lab 2
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
