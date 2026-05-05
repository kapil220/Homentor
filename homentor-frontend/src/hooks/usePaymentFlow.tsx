import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { createOrder } from "@/api/payment.jsx";
import { initiateCheckout } from "@/api/paymentProvider.jsx";
import { createCashBooking, createManualBooking } from "@/api/cashBooking.jsx";
import PaymentMethodModal from "@/comp/PaymentMethodModal";
import ManualPaymentModal from "@/comp/ManualPaymentModal";

type AdminPaymentDetails = {
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  paymentInstructions: string;
};

export type PaymentParams = {
  amount: number;
  duration?: number;
  mentorId: string;
  customerPhone?: string;
  classBookingId?: string;
  session?: number | null;
  isDemo?: boolean;
  /**
   * Online provider for the gateway path.
   *  - "cashfree": use Cashfree modal (default for new bookings on MentorProfile)
   *  - "payu":     use PayU redirect via initiateCheckout (used by class extensions)
   */
  onlineProvider?: "cashfree" | "payu";
  teachingMode?: "online" | "offline";
  onSuccess?: () => void;
};

type Options = {
  defaultOnlineProvider?: "cashfree" | "payu";
};

/**
 * Centralized payment selector + handler.
 * Shows a popup with the admin-configured online method (gateway or manual UPI/bank)
 * plus Cash. Manual flow includes screenshot upload to Cloudinary.
 *
 * Usage:
 *   const { start, ui } = usePaymentFlow();
 *   <Button onClick={() => start({ amount: 1500, mentorId, duration: 22 })} />
 *   {ui}
 */
export function usePaymentFlow(options: Options = {}) {
  const { defaultOnlineProvider = "cashfree" } = options;

  const [methodOpen, setMethodOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [pending, setPending] = useState<PaymentParams | null>(null);

  const [onlinePaymentMode, setOnlinePaymentMode] = useState<"gateway" | "manual">("gateway");
  const [adminPaymentDetails, setAdminPaymentDetails] = useState<AdminPaymentDetails>({
    upiId: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfsc: "",
    bankName: "",
    paymentInstructions: "",
  });

  const loadedRef = useRef(false);
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/admin`)
      .then((res) => {
        const cfg = res.data?.data?.[0] || {};
        if (cfg.onlinePaymentMode === "manual" || cfg.onlinePaymentMode === "gateway") {
          setOnlinePaymentMode(cfg.onlinePaymentMode);
        }
        setAdminPaymentDetails({
          upiId: cfg.upiId || "",
          bankAccountName: cfg.bankAccountName || "",
          bankAccountNumber: cfg.bankAccountNumber || "",
          bankIfsc: cfg.bankIfsc || "",
          bankName: cfg.bankName || "",
          paymentInstructions: cfg.paymentInstructions || "",
        });
      })
      .catch(() => {
        /* leave defaults; user can still pay cash / online */
      });
  }, []);

  const phoneFor = (p: PaymentParams) =>
    p.customerPhone || localStorage.getItem("usernumber") || "";

  const start = (params: PaymentParams) => {
    const phone = phoneFor(params);
    if (!phone) {
      alert("Please log in first to continue with payment.");
      return;
    }
    if (!params.amount || params.amount <= 0) {
      alert("Invalid amount.");
      return;
    }
    setPending({ ...params, customerPhone: phone });
    setMethodOpen(true);
  };

  const payOnline = async () => {
    if (!pending) return;
    const provider = pending.onlineProvider || defaultOnlineProvider;
    try {
      if (provider === "payu") {
        await initiateCheckout({
          amount: Math.round(pending.amount),
          customerId: `homentor${Date.now()}`,
          customerPhone: pending.customerPhone,
          mentorId: pending.mentorId,
          duration: pending.duration,
          session: pending.session ?? undefined,
          isDemo: pending.isDemo,
          classBookingId: pending.classBookingId,
          teachingMode: pending.teachingMode,
        });
        return;
      }

      // Cashfree
      const data = await createOrder({
        amount: Math.round(pending.amount),
        customerId: `homentor${Date.now()}`,
        customerPhone: pending.customerPhone,
        mentorId: pending.mentorId,
        duration: pending.duration,
        session: pending.session ?? undefined,
        isDemo: pending.isDemo,
        classBookingId: pending.classBookingId,
        teachingMode: pending.teachingMode,
      });
      if (!data?.payment_session_id) {
        throw new Error("Online payment is currently unavailable. Please try UPI / Bank Transfer or Cash.");
      }
      localStorage.setItem("orderId", data.order_id);
      const cashfree = await load({ mode: "production" });
      const result: any = await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });
      if (result?.error) {
        throw new Error(result.error.message || "Payment was not completed.");
      }
      if (result?.paymentDetails) {
        window.location.href = `/payment-status?orderId=${data.order_id}`;
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        "Failed to initiate online payment. Please try UPI / Bank Transfer or Cash instead.";
      alert(msg);
    }
  };

  const payCash = async () => {
    if (!pending) return;
    const proceed = window.confirm(
      `Place a CASH booking for ₹${Math.round(pending.amount)}?\n\nThe booking will remain pending until an admin approves it.`
    );
    if (!proceed) return;
    try {
      await createCashBooking({
        amount: Math.round(pending.amount),
        customerPhone: pending.customerPhone,
        mentorId: pending.mentorId,
        duration: pending.duration,
        session: pending.session ?? undefined,
        isDemo: pending.isDemo,
        classBookingId: pending.classBookingId,
        teachingMode: pending.teachingMode,
      });
      alert("Cash booking placed! You'll see it as 'Pending Approval' in your bookings.");
      pending.onSuccess?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create cash booking");
    }
  };

  const submitManualPayment = async ({
    paymentReference,
    paymentScreenshot,
  }: {
    paymentReference: string;
    paymentScreenshot: string;
  }) => {
    if (!pending) return;
    try {
      await createManualBooking({
        amount: Math.round(pending.amount),
        customerPhone: pending.customerPhone,
        mentorId: pending.mentorId,
        duration: pending.duration,
        session: pending.session ?? undefined,
        isDemo: pending.isDemo,
        classBookingId: pending.classBookingId,
        paymentReference,
        paymentScreenshot,
        teachingMode: pending.teachingMode,
      });
      setManualOpen(false);
      alert("Booking placed! It will be confirmed once admin verifies your payment.");
      pending.onSuccess?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to submit manual payment");
    }
  };

  const ui = (
    <>
      <PaymentMethodModal
        open={methodOpen}
        amount={pending?.amount ? Math.round(pending.amount) : 0}
        onlinePaymentMode={onlinePaymentMode}
        onlineEnabled={true}
        cashEnabled={true}
        onClose={() => setMethodOpen(false)}
        onPayOnline={() => {
          setMethodOpen(false);
          void payOnline();
        }}
        onPayManual={() => {
          setMethodOpen(false);
          setManualOpen(true);
        }}
        onPayCash={() => {
          setMethodOpen(false);
          void payCash();
        }}
      />
      <ManualPaymentModal
        open={manualOpen}
        amount={pending?.amount ? Math.round(pending.amount) : 0}
        details={adminPaymentDetails}
        onClose={() => setManualOpen(false)}
        onSubmit={submitManualPayment}
      />
    </>
  );

  return { start, ui };
}

export default usePaymentFlow;
