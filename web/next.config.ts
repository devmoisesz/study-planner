import type { NextConfig } from 'next';

/**
 * A API Nest roda em :3000 e nao habilita CORS.
 * O rewrite abaixo serve /api/* pela mesma origem do front,
 * entao o browser nunca faz requisicao cross-origin.
 */
const API_ORIGIN =
  process.env.ORDO_API_ORIGIN ?? 'https://study-planner-nesv.onrender.com';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_ORIGIN}/:path*` }];
  },
};

export default nextConfig;
