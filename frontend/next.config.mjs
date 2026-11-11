/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera una build mínima y autocontenida: ideal para Docker, ya que la
  // imagen final solo copia lo estrictamente necesario.
  output: 'standalone',
};

export default nextConfig;
