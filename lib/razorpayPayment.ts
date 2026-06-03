import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutParams {
  orderId: string;
  orderNumber: string;
}

export const startRazorpayPayment = async ({
  orderId,
  orderNumber,
}: RazorpayCheckoutParams) => {
  try {
    // ✅ 1. Create Razorpay Order from backend
    const res = await fetch("/api/razorpay/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, orderNumber }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create Razorpay order");
    }

    // ✅ 2. Open Razorpay Popup
    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      name: "Zam Zam Fashion Store",
      description: "Order Payment",
      order_id: data.order.id,

      handler: async function (response: any) {
        toast.loading("Verifying payment...");

        // ✅ 3. Verify Payment Signature
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            orderId,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          toast.success("Payment Successful ✅");
          window.location.href = `/success?orderNumber=${orderNumber}`;
        } else {
          toast.error("Payment verification failed ❌");
        }
      },

      theme: { color: "#000" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err: any) {
    console.error("Razorpay Error:", err);
    toast.error(err.message || "Payment failed");
  }
};
