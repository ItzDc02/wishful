import { useState } from "react";
import { api } from "../api/http";

type Props = { wishId: string; disabled?: boolean };

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function FulfillWishButton({ wishId, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handlePayAndFulfill = async () => {
    try {
      setLoading(true);
      // 1) Create order on server (amount placeholder 100 INR)
      const { data: order } = await api.post("/payments/create-order", {
        amount: 10000,
      });

      // 2) Open Razorpay Checkout
      const opts: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxxx",
        amount: order.amount,
        currency: order.currency,
        name: "Wishful Test",
        description: "Fulfil a wish",
        order_id: order.id,
        handler: async function () {
          // mark wish fulfilled
          await api.post(`/wishes/${wishId}/fulfill`, { name: "Demo Donor" });
          setDone(true);
        },
        theme: { color: "#6366f1" },
      };

      if (!window.Razorpay) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      }
      const rzp = new window.Razorpay(opts);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Payment failed or was cancelled.");
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <span className="text-emerald-400 text-sm font-medium">
        Marked fulfilled ✅
      </span>
    );

  return (
    <button
      onClick={handlePayAndFulfill}
      disabled={loading || disabled}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {loading ? "Processing…" : "Fulfil this wish"}
    </button>
  );
}

function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}
