/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'X-Farcaster-Frame', value: 'vNext' },
          { key: 'Content-Type', value: 'text/html' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
