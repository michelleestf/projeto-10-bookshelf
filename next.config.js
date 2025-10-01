// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Wikipedia/Google imagens
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // Amazon
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org', // Open Library
      },
      {
        protocol: 'https',
        hostname: 'books.google.com', // Google Books thumbnails
      },
    ],
  },
};

module.exports = nextConfig;
