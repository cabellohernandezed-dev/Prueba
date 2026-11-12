/** @type {import('next').NextConfig} */
// Dirección del backend. Next.js la utiliza para enviar las peticiones de la API.
// Así, el navegador se comunica con el frontend y la cookie de sesión se mantiene
// en el mismo sitio, evitando problemas al trabajar con diferentes dominios.
const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

const nextConfig = {
  // Genera una versión ligera de la aplicación con los archivos necesarios
  // para ejecutarla en Docker, evitando incluir archivos innecesarios.
  output: 'standalone',
  // Reenvía /api/* del frontend hacia el backend.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backendUrl}/:path*` }];
  },
};

export default nextConfig;
