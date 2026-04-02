import { useState, useEffect } from "react";
import {
  CheckCircle,
  Download,
  Mail,
  ArrowRight,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Confetti from "@/components/Confetti";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentSuccessful = () => {
  const orderId = localStorage.getItem("orderId");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPaymentDetails = async () => {
    const response = await axios.get(
      `https://homentor-backend.onrender.com/api/payment/verify-order/${orderId}`
    );
    const getOrderResponse = response.data;
    setOrderDetail(response.data[0]);
    console.log(response.data);
    setLoading(false);
    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      setOrderStatus("Success");
      setTimeout(() => {
        navigate("/dashboard/student");
      }, 3000);
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      setOrderStatus("Pending");
    } else {
      setOrderStatus("Failure");
    }
  };
  useEffect(() => {
    getPaymentDetails();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const orderDetails = {
    orderNumber: "ORD-2024-001234",
    amount: "$99.99",
    date: new Date().toLocaleDateString(),
    items: [{ name: "Premium Plan", quantity: 1, price: "$99.99" }],
  };

  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4 mt-20">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Fetching your payment status...
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your transaction
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Main Success Card */}
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-2xl animate-scale-in">
          <CardContent className="p-8 text-center">
            {/* Animated Checkmark */}
            <div className="mb-6">
              {orderStatus == "Success" ? (
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              ) : orderStatus == "Pending" ? (
                <Clock className="h-20 w-20 text-orange-500 mx-auto mb-6" />
              ) : (
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
              )}
            </div>

            {/* Success Message */}
            <h1
              className={`text-3xl md:text-4xl font-bold mb-4 ${orderStatus == "Success"
                  ? "text-green-600"
                  : orderStatus == "Pending"
                    ? "text-orange-600"
                    : "text-red-600"
                } `}
            >
              Payment{" "}
              {orderStatus == "Success"
                ? "Successful"
                : orderStatus == "Pending"
                  ? "Pending"
                  : "Failed"}
              !
            </h1>

            {/* Order Details */}
            {orderStatus == "Success" && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left animate-fade-in">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-mono text-sm break-all sm:text-right">
                      {orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{orderDetails?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {orderDetail?.order_amount}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {orderStatus == "Success" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Receipt
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={() => navigate("/dashboard/student")}
          size="lg"
          className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 rounded-full font-medium transition-all duration-200 hover:scale-105 animate-fade-in"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Next Steps Card */}
        {orderStatus == "Success" && (
          <Card className="w-full max-w-2xl mt-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg animate-fade-in">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">
                What's Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-white/50">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Check your email
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Confirmation sent
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/50">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Access your account
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Features unlocked
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/50">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Get support
                  </p>
                  <p className="text-xs text-gray-500 mt-1">24/7 assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessful;
