import { FC } from 'react';
import Script from 'next/script';

import tracker from './tracker';

const GtagScript: FC = () => {
  if (!tracker.ID) return null;

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${tracker.ID}`} />
      <Script strategy="afterInteractive" id="ga">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${tracker.ID}', {
            page_path: window.location.pathname
          });
        `}
      </Script>
    </>
  );
};

export default GtagScript;
