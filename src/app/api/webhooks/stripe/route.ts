import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        console.log("Pagamento confirmado:", event.data.object);
        break;

      default:
        console.log("Evento Stripe recebido:", event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Erro no webhook:", err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
