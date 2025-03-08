import Link from "next/link";
import React from "react";

const PaymentFailed = async () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>

          <p className="text-gray-600 mb-8">
            We're sorry, but your payment could not be processed. Please try
            again or contact support if the problem persists.
          </p>

          <div className="space-y-4">
            <Link
              href="/cart"
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition duration-300"
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
                className="text-red-600 hover:text-red-700 font-medium"
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

export default PaymentFailed;
