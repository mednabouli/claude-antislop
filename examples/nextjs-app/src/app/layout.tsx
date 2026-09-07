import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'User Management - Next.js Example',
  description: 'Example Next.js app with Claude AntiSlop integration',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <main className="main">
          {children}
        </main>
      </body>
    </html>
  );
}
