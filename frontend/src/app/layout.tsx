import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AuthProvider } from '@/context/auth-context';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Club de Lectura',
  description: 'Gestor de libros del club de lectura',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* AuthProvider envuelve toda la app para conocer la sesión en cualquier página. */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
