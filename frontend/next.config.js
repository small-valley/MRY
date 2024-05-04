/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.imgur.com',
      },
      {
        hostname: 'www.notion.so',
      },
    ],
    unoptimized: true, // avoid 404 error when deploying on s3
  },
  output: 'export',
  trailingSlash: true, // avoid error when refreshing pages on s3 deployment
};

module.exports = nextConfig;
