/** @type {import('next').NextConfig} */
const nextConfig = {
  // Excluir la carpeta scripts del build
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
