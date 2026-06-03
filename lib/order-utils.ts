// ✅ Order utilities (Stripe removed)

export function generateOrderNumber(): string {
  const prefix = "SW";
  const random = Math.floor(100000 + Math.random() * 900000);

  return `${prefix}-${random}-${Date.now().toString().slice(-4)}`;
}
