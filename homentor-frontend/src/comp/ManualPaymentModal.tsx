import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type AdminPaymentDetails = {
  upiId?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  paymentInstructions?: string;
};

type Props = {
  open: boolean;
  amount: number;
  details: AdminPaymentDetails;
  onClose: () => void;
  onSubmit: (paymentReference: string) => Promise<void> | void;
};

const Row = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="flex justify-between items-center gap-3 py-2 border-b last:border-b-0">
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium break-all">{value}</div>
      </div>
      <button
        onClick={copy}
        className="shrink-0 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

const ManualPaymentModal = ({ open, amount, details, onClose, onSubmit }: Props) => {
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const [refError, setRefError] = useState("");
  const refTrim = reference.trim();
  const refValid = /^[A-Za-z0-9-]{6,30}$/.test(refTrim);

  const handleSubmit = async () => {
    if (!refTrim) {
      setRefError("Please enter the transaction reference (UTR / UPI Ref ID).");
      return;
    }
    if (!refValid) {
      setRefError("Reference looks short or invalid. UTRs are usually 12 digits.");
      return;
    }
    setRefError("");
    setSubmitting(true);
    try {
      await onSubmit(refTrim);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Pay ₹{amount}</h2>
          <p className="text-xs text-gray-500 mt-1">
            Transfer to the details below, then enter your transaction reference. Your booking
            will be confirmed once admin verifies the payment.
          </p>
        </div>

        <div className="px-5 py-3">
          <Row label="UPI ID" value={details.upiId || ""} />
          <Row label="Account Holder" value={details.bankAccountName || ""} />
          <Row label="Account Number" value={details.bankAccountNumber || ""} />
          <Row label="IFSC" value={details.bankIfsc || ""} />
          <Row label="Bank" value={details.bankName || ""} />
          {details.paymentInstructions ? (
            <div className="mt-3 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
              {details.paymentInstructions}
            </div>
          ) : null}
        </div>

        <div className="px-5 py-3 border-t">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Transaction Reference (UTR / UPI Ref ID) *
          </label>
          <input
            value={reference}
            onChange={(e) => { setReference(e.target.value); setRefError(""); }}
            placeholder="e.g. 412345678901"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            inputMode="text"
            autoComplete="off"
          />
          {refError && (
            <p className="text-xs text-red-600 mt-1.5">{refError}</p>
          )}
        </div>

        <div className="px-5 py-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {submitting ? "Submitting…" : "I have paid"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentModal;
