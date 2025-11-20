import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "URL shortener"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold">TinyLink</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-600">
          
        </footer>
      </body>
    </html>
  );
}
