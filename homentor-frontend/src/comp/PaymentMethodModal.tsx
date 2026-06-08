import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Wallet, X, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  amount: number;
  onlinePaymentMode: "gateway" | "manual";
  onlineEnabled?: boolean;
  cashEnabled?: boolean;
  /** Disable actions while the parent is loading config or processing a payment. */
  loading?: boolean;
  /** Inline error to show instead of a blocking alert; keeps the modal usable for retry. */
  errorMessage?: string;
  onClose: () => void;
  onPayOnline: () => void;
  onPayManual: () => void;
  onPayCash: () => void;
};

type Choice = "online" | "manual" | "cash";

const PaymentMethodModal = ({
  open,
  amount,
  onlinePaymentMode,
  onlineEnabled = true,
  cashEnabled = true,
  loading = false,
  errorMessage = "",
  onClose,
  onPayOnline,
  onPayManual,
  onPayCash,
}: Props) => {
  // The set of choices actually shown to the user, in display order.
  const availableChoices: Choice[] = [];
  if (onlineEnabled && onlinePaymentMode === "gateway") availableChoices.push("online");
  if (onlineEnabled && onlinePaymentMode === "manual") availableChoices.push("manual");
  if (cashEnabled) availableChoices.push("cash");

  const [selected, setSelected] = useState<Choice>(availableChoices[0] ?? "cash");

  // Keep `selected` pointing at a currently-visible option. Without this, the
  // choice initialized on first mount (while admin config was still loading and
  // the mode defaulted to "gateway") stays stale as "online" — and clicking
  // Continue would fire the unconfigured online gateway path. Re-sync whenever
  // the modal opens or the available options change.
  useEffect(() => {
    if (!open) return;
    if (!availableChoices.includes(selected)) {
      setSelected(availableChoices[0] ?? "cash");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onlinePaymentMode, onlineEnabled, cashEnabled]);

  if (!open) return null;

  const proceed = () => {
    if (loading) return;
    // Only ever act on a choice that is actually visible to the user.
    const choice = availableChoices.includes(selected)
      ? selected
      : availableChoices[0];
    if (choice === "online") onPayOnline();
    else if (choice === "manual") onPayManual();
    else if (choice === "cash") onPayCash();
  };

  const Option = ({
    value,
    title,
    subtitle,
    icon,
  }: {
    value: Choice;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }) => {
    const active = selected === value;
    return (
      <button
        type="button"
        onClick={() => setSelected(value)}
        disabled={loading}
        className={`w-full text-left flex items-center gap-3 border rounded-xl px-4 py-3 transition disabled:opacity-60 ${
          active
            ? "border-yellow-500 bg-yellow-50"
            : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <div
          className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            active ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
        {active && <CheckCircle2 className="h-5 w-5 text-yellow-600" />}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Choose payment method
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Total payable: <span className="font-semibold">₹{amount}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage ? (
          <div className="mx-5 mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMessage}
          </div>
        ) : null}

        <div className="px-5 py-4 space-y-3">
          {onlineEnabled && onlinePaymentMode === "gateway" && (
            <Option
              value="online"
              title="Pay Online"
              subtitle="UPI, Card, Net Banking via secure gateway"
              icon={<CreditCard className="h-5 w-5" />}
            />
          )}
          {onlineEnabled && onlinePaymentMode === "manual" && (
            <Option
              value="manual"
              title="UPI / Bank Transfer"
              subtitle="Pay to admin UPI / bank, then submit reference"
              icon={<Banknote className="h-5 w-5" />}
            />
          )}
          {cashEnabled && (
            <Option
              value="cash"
              title="Pay with Cash"
              subtitle="Pay the mentor directly. Booking awaits admin approval."
              icon={<Wallet className="h-5 w-5" />}
            />
          )}
        </div>

        <div className="px-5 py-4 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={proceed}
            disabled={loading || availableChoices.length === 0}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {loading ? "Please wait…" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
