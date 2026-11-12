/** @type {import('next').NextConfig} */
// URL del backend en el servidor. Next.js la usa como destino del proxy de /api,
// de modo que el navegador solo habla con el frontend y la cookie de sesión
// viaja como cookie de primera parte (evita bloqueos entre dominios distintos).
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
