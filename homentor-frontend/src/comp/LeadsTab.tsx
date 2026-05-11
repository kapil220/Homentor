import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LeadCard from "./LeadCard";

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
  mentorPhone: string | null;
};

export default function LeadsTab({ mentorPhone }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminDetails, setAdminDetails] = useState<AdminPaymentDetails>({
    upiId: "", bankAccountName: "", bankAccountNumber: "",
    bankIfsc: "", bankName: "", paymentInstructions: "",
  });
  const loadedRef = useRef(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/mine`,
        { headers: { "x-mentor-phone": mentorPhone } }
      );
      setLeads(res.data.data || []);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      console.error("Failed to fetch leads", { status, msg, err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mentorPhone) return;
    fetchLeads();

    const onVisible = () => {
      if (document.visibilityState === "visible") fetchLeads();
    };
    window.addEventListener("focus", fetchLeads);
    document.addEventListener("visibilitychange", onVisible);

    if (!loadedRef.current) {
      loadedRef.current = true;
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin`).then((res) => {
        const cfg = res.data?.data?.[0] || {};
        setAdminDetails({
          upiId: cfg.upiId || "",
          bankAccountName: cfg.bankAccountName || "",
          bankAccountNumber: cfg.bankAccountNumber || "",
          bankIfsc: cfg.bankIfsc || "",
          bankName: cfg.bankName || "",
          paymentInstructions: cfg.paymentInstructions || "",
        });
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener("focus", fetchLeads);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [mentorPhone]);

  if (loading) return <p className="text-gray-400 p-4">Loading leads...</p>;
  if (leads.length === 0) return <p className="text-gray-400 p-4">No leads yet. They'll appear here after a parent books a demo or calls you.</p>;

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-3">
        Pay the commission to reveal a parent's phone number and address.
      </p>
      {leads.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          adminPaymentDetails={adminDetails}
          mentorPhone={mentorPhone}
          onPaymentSubmitted={fetchLeads}
        />
      ))}
    </div>
  );
}
