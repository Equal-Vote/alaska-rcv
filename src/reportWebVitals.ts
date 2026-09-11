import type { ReportHandler } from 'web-vitals';

// Converted from .js so the web-vitals API surface is type-checked. That is
// deliberate: this file still calls the v2 getCLS/getFID/... names, which v3
// renamed to onCLS/onINP/.... As a .js file that break was invisible until
// runtime (and dormant, since index.tsx calls this with no handler). As a .ts
// file, a web-vitals major bump fails `npm run typecheck` in CI instead.
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
