"use client";

import { useRouter } from "next/navigation";

interface PaymentPageProps {
  params: { id: string };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();

  const handlePayment = () => {
    // You can later integrate Stripe, Razorpay, etc. here.
    // For now, just redirect to confirmation page
    router.push(`/dashboard/cart/${params.id}/payment/confirmation`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="text-gray-600 mb-6">
          Please confirm your payment to proceed with NFT creation.
        </p>
        <button
          onClick={handlePayment}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
