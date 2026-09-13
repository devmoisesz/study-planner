import type { Metadata, Viewport } from 'next';
import { Public_Sans } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

/** Fonte unica para uma interface coesa, legivel e orientada a trabalho. */
const publicSans = Public_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Study Planner', template: '%s · Study Planner' },
  description: 'Veja o que merece mais atencao agora.',
};

export const viewport: Viewport = {
  themeColor: '#f7f7f5',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={publicSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
