/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: [
      'cdn.pixabay.com',
      'firebasestorage.googleapis.com'
    ]
  }
}

module.exports = nextConfig
