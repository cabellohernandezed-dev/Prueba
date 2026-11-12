/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera una versión ligera de la aplicación con los archivos necesarios
// para ejecutarla en Docker, evitando incluir archivos innecesarios.
  output: 'standalone',
};

export default nextConfig;
