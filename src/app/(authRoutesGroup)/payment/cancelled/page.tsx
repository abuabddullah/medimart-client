import Link from "next/link";
import React from "react";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M12 5v14"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h2>

          <p className="text-gray-600 mb-8">
            Your payment was cancelled. You can try again or return to the home
            page.
          </p>

          <div className="space-y-4">
            <Link
              href="/cart"
              className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-md transition duration-300"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md transition duration-300"
            >
              Return to Home
            </Link>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
