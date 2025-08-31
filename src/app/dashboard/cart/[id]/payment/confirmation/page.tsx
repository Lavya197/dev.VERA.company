export default function PaymentConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-700">
          Your payment has been received. NFT creation is in progress...
        </p>
        <p className="text-gray-500 mt-4">You will be notified once it's ready.</p>
      </div>
    </div>
  );
}
