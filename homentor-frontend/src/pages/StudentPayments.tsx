import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import StatTile from "@/comp/StatTile";
import { Receipt, Wallet, Clock } from "lucide-react";

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const methodPill = (method: string) => {
  const map: Record<string, string> = {
    online: "bg-blue-100 text-blue-700",
    cash: "bg-green-100 text-green-700",
    manual: "bg-yellow-100 text-yellow-700",
  };
  return map[method] || "bg-gray-100 text-gray-700";
};

const statusPill = (status: string) => {
  const map: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const StudentPayments = () => {
  const studentNumber = localStorage.getItem("usernumber");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/login-check`,
          { phone: studentNumber }
        );
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/order/by-parent/${me.data.data._id}`,
          { headers: { "x-user-phone": String(studentNumber || "") } }
        );
        setOrders(res.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentNumber]);

  const totalPaid = orders
    .filter((o) => o.status === "PAID")
    .reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const pendingAmount = orders
    .filter((o) => o.status === "PENDING")
    .reduce((s, o) => s + (Number(o.amount) || 0), 0);

  return (
    <DashboardLayout role="student" title="Payments" subtitle="Order and transaction history">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatTile
            label="Total Paid"
            value={`₹${totalPaid.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            accent="green"
          />
          <StatTile
            label="Pending Verification"
            value={`₹${pendingAmount.toLocaleString()}`}
            icon={<Clock className="w-5 h-5" />}
            accent="yellow"
          />
          <StatTile
            label="Orders"
            value={orders.length}
            icon={<Receipt className="w-5 h-5" />}
            accent="blue"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No payments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Mentor</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Reference</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(o.createdAt || o.verifiedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.mentor?.fullName || "—"}</div>
                        <div className="text-xs text-gray-500">{o.mentor?.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{Number(o.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${methodPill(
                            o.paymentMethod
                          )}`}
                        >
                          {o.paymentMethod || "online"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 break-all">
                        {o.paymentReference || o.orderId}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusPill(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPayments;
