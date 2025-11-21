/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para Vercel
  reactStrictMode: true,
  
  // Suporte a variáveis de ambiente
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  // Configurações de API para webhooks
  api: {
    bodyParser: false, // Desabilitar para webhooks do Stripe
  },
};

module.exports = nextConfig;
