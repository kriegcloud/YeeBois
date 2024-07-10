import { BillingProvider } from '@/providers/billing-provider';
import ModalProvider from '@/providers/modal-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@dank/ui/toast';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const font = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yee Bois.',
  description: 'For the bois.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BillingProvider>
            <ModalProvider>
              {children}
              <Toaster />
            </ModalProvider>
          </BillingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
