declare module 'get-browser-fingerprint' {
  function getBrowserFingerprint(options?: {
    enableGpu?: boolean;
    enableWebgl?: boolean;
    screen?: boolean;
    debug?: boolean;
  }): string;

  export = getBrowserFingerprint;
}
