import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const PaymentSuccess = async () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center"></div>
        <CheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>

        <div className="space-y-4">
          <Link
            href="/profile"
            className="block w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            View Profile
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
