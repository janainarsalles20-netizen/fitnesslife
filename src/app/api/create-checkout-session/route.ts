import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, mode = "subscription", successUrl, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId é obrigatório" },
        { status: 400 }
      );
    }

    // Validar mode
    if (!["subscription", "payment"].includes(mode)) {
      return NextResponse.json(
        { error: "mode deve ser 'subscription' ou 'payment'" },
        { status: 400 }
      );
    }

    // URLs padrão caso não sejam fornecidas
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const defaultSuccessUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${baseUrl}/canceled`;

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: mode as "subscription" | "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      // Configurações adicionais recomendadas
      billing_address_collection: "auto",
      customer_creation: "always",
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar sessão de checkout" },
      { status: 500 }
    );
  }
}
