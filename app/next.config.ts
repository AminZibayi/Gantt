import path from 'path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      dhtmlxgantt: path.resolve(__dirname, '../codebase/dhtmlxgantt.es.js'),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
