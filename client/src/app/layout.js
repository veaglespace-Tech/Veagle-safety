import '../index.css';
import { Providers } from './providers.js';

export const metadata = {
  title: 'Veagle Safety | Personal & Women Safety Platform',
  description: 'AI-Powered 24/7 Personal & Women Safety SaaS Platform with Live GPS Tracking and Instant Emergency SOS Alerts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="bg-blush antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
