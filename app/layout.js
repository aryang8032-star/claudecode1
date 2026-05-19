import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Open Generative AI — Free AI Image & Video Studio',
  description:
    'Free, open-source AI studio with 200+ models — Flux, Midjourney, Kling, Veo, Seedance and more. No subscriptions, no content filters.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
