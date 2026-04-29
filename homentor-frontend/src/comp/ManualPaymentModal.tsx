import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Upload, X as XIcon, ImageIcon } from "lucide-react";

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
  onSubmit: (data: { paymentReference: string; paymentScreenshot: string }) => Promise<void> | void;
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

const CLOUDINARY_CLOUD_NAME = "dpveehhtq";
const CLOUDINARY_UPLOAD_PRESET = "homentor";

const uploadScreenshot = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!res.ok) throw new Error("Failed to upload screenshot");
  const data = await res.json();
  return data.secure_url as string;
};

const ManualPaymentModal = ({ open, amount, details, onClose, onSubmit }: Props) => {
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refError, setRefError] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (!open) return null;

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPG / PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image is too large. Please upload under 5 MB.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadScreenshot(file);
      setScreenshotUrl(url);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload screenshot. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const refTrim = reference.trim();
    if (!refTrim && !screenshotUrl) {
      setRefError("Enter the transaction reference (UTR) or upload a payment screenshot.");
      return;
    }
    setRefError("");
    setSubmitting(true);
    try {
      await onSubmit({ paymentReference: refTrim, paymentScreenshot: screenshotUrl });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Pay ₹{amount}</h2>
            <p className="text-xs text-gray-500 mt-1">
              Pay to the details below, then upload a screenshot of your payment (or enter the UTR).
              Your booking will be confirmed once admin verifies the payment.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <XIcon className="h-5 w-5" />
          </button>
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

        <div className="px-5 py-3 border-t space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Payment Screenshot
            </label>

            {screenshotUrl ? (
              <div className="relative border rounded-lg overflow-hidden">
                <img src={screenshotUrl} alt="Payment screenshot" className="w-full max-h-56 object-contain bg-gray-50" />
                <button
                  type="button"
                  onClick={() => setScreenshotUrl("")}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white border rounded-full p-1 shadow"
                  aria-label="Remove screenshot"
                >
                  <XIcon className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-yellow-500 hover:bg-yellow-50 transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                {uploading ? (
                  <span className="text-sm text-gray-600">Uploading…</span>
                ) : (
                  <>
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Upload payment screenshot</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> JPG / PNG up to 5 MB
                    </div>
                  </>
                )}
              </label>
            )}
            {uploadError && <p className="text-xs text-red-600 mt-1.5">{uploadError}</p>}
          </div>

          <div className="text-center text-xs text-gray-400">— or —</div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Transaction Reference (UTR / UPI Ref ID)
            </label>
            <input
              value={reference}
              onChange={(e) => { setReference(e.target.value); setRefError(""); }}
              placeholder="e.g. 412345678901"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              inputMode="text"
              autoComplete="off"
            />
          </div>

          {refError && <p className="text-xs text-red-600">{refError}</p>}
        </div>

        <div className="px-5 py-4 flex gap-2 justify-end border-t">
          <Button variant="outline" onClick={onClose} disabled={submitting || uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || uploading || (!screenshotUrl && !reference.trim())}
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
