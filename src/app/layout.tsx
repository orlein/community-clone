import { Toaster } from '@/components/ui/toaster';
import { PropsWithChildren } from 'react';
import { Providers } from './providers';
import './styles/globals.css';

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{props.children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
