import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Custom integration to generate static redirect HTML files for legacy paths
function legacyRedirectsIntegration() {
  return {
    name: 'legacy-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = dir.pathname || dir;
        const redirects = [
          {
            from: '2020/02/01/speedtest-openwrt-with-flow-offloading',
            to: '/speedtest-openwrt-with-flow-offloading/',
          },
          {
            from: '2018/08/11/reduce-internet-lag-on-openwrt',
            to: '/reduce-internet-lag-on-openwrt/',
          },
          {
            from: '2016/06/19/conditional-multiple-openvpn-routing-hostname-ip',
            to: '/conditional-multiple-openvpn-routing-hostname-ip/',
          },
          {
            from: '2016/02/14/using-iptables-port-forward-to-web-server-only-if-source-is-cloudflare',
            to: '/zero-trust-ingress-origin-cloaking-mtls/',
          },
          {
            from: '2016/03/10/apache-cloudflare-authenticated-origin-pulls-configuration',
            to: '/zero-trust-ingress-origin-cloaking-mtls/',
          },
          {
            from: '2017/10/02/byod-ci-cd-build-machine-to-run-pipelines-using-docker',
            to: '/byod-ci-cd-build-machine-to-run-pipelines-using-docker/',
          },
          {
            from: '2018/04/23/writing-readable-linq-code-in-csharp',
            to: '/writing-readable-linq-code-in-csharp/',
          },
          {
            from: 'contact',
            to: '/about/',
          },
        ];

        for (const { from, to } of redirects) {
          const targetDir = path.join(outDir, from);
          fs.mkdirSync(targetDir, { recursive: true });
          const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <link rel="canonical" href="https://www.leowkahman.com${to}">
    <meta http-equiv="refresh" content="0; url=${to}">
  </head>
  <body>
    <script>window.location.replace("${to}");</script>
    <p>Redirecting to <a href="${to}">${to}</a>...</p>
  </body>
</html>`;
          fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
        }
        console.log(`[legacy-redirects] Successfully generated ${redirects.length} legacy redirect stubs.`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://www.leowkahman.com',
  compressHTML: true,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) =>
        !page.includes('/page/') &&
        !page.includes('/tags/') &&
        !page.includes('/categories/'),
    }),
    legacyRedirectsIntegration(),
  ],
  build: {
    format: 'directory',
  },
});
