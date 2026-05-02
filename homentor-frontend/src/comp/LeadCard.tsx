import { useState } from "react";
import axios from "axios";
import ManualPaymentModal from "./ManualPaymentModal";

type Lead = {
  _id: string;
  parentName: string;
  parentClass: string;
  parentSubjects: string;
  parentPhone: string | null;
  parentLocation: { city: string; area: string } | null;
  callCount: number;
  lastCalledAt: string;
  commissionPaid: boolean;
  commissionAmount: number;
  paymentStatus: "pending" | "submitted" | "approved";
};

type AdminPaymentDetails = {
  upiId?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  paymentInstructions?: string;
};

type Props = {
  lead: Lead;
  adminPaymentDetails: AdminPaymentDetails;
  mentorPhone: string;
  onPaymentSubmitted: () => void;
};

export default function LeadCard({ lead, adminPaymentDetails, mentorPhone, onPaymentSubmitted }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({
    paymentReference,
    paymentScreenshot,
  }: {
    paymentReference: string;
    paymentScreenshot: string;
  }) => {
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/${lead._id}/pay`,
        { paymentRef: paymentScreenshot || paymentReference },
        { headers: { "x-mentor-phone": mentorPhone } }
      );
      setModalOpen(false);
      onPaymentSubmitted();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = () => {
    if (lead.commissionPaid) return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Unlocked</span>;
    if (lead.paymentStatus === "submitted") return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Payment under review</span>;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{lead.parentName || "Anonymous"}</p>
          <p className="text-sm text-gray-500">
            Class: {lead.parentClass || "—"} · Subjects: {lead.parentSubjects || "—"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Called {lead.callCount}× · Last: {new Date(lead.lastCalledAt).toLocaleDateString()}
          </p>

          {lead.commissionPaid ? (
            <div className="mt-2">
              <a href={`tel:${lead.parentPhone}`} className="text-blue-600 font-medium text-sm">
                📞 {lead.parentPhone}
              </a>
              {lead.parentLocation && (
                <p className="text-sm text-gray-600 mt-1">
                  📍 {lead.parentLocation.area}, {lead.parentLocation.city}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-gray-400">📞 ••••••••••</p>
              <p className="text-sm text-gray-400">📍 Hidden</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 ml-3">
          {statusBadge()}
          {!lead.commissionPaid && lead.paymentStatus === "pending" && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
            >
              Unlock — ₹{lead.commissionAmount}
            </button>
          )}
        </div>
      </div>

      <ManualPaymentModal
        open={modalOpen}
        amount={lead.commissionAmount}
        details={adminPaymentDetails}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
