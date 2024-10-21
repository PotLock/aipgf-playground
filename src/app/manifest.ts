import { MetadataRoute } from 'next';
import { WEBSITE_DESCRIPTION, WEBSITE_NAME } from '@/common/constants/site.constant';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: WEBSITE_NAME,
    short_name: WEBSITE_NAME,
    description: WEBSITE_DESCRIPTION,
    theme_color: '#4b9ae8',
    background_color: '#334155',
    orientation: 'portrait-primary',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
