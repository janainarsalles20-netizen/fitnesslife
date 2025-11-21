
import Stripe from "stripe";

// Instância do Stripe com a versão da API corrigida
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",  // Versão correta da API Stripe
});
