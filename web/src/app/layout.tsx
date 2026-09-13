import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Public_Sans } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

/** Display: titulos de pagina e os numerais do score. Nada mais. */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['500', '600', '700'],
});

/** UI: todo o resto. */
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
  themeColor: '#f8faf9',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${publicSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
