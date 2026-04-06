import axios from "axios";
import { useEffect, useState } from "react";

const ParentDisclaimerModal = ({
  audience,
  open,
  onClose,
  userId,
  disclaimerAccepted
}) => {
  const [loading, setLoading] = useState(false);
  const [disclaimers, setDisclaimers] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/disclaimer/${audience}`)
      .then((res) => setDisclaimers(res.data.data || []))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const handleAccept = async () => {
    if (!agreed) return;

    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/accept-disclaimer/` +
          userId,
        { disclaimers: disclaimers }
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg relative">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Important Disclaimer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : disclaimers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No disclaimer available at the moment.
            </p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700 list-disc pl-4">
              {disclaimers.map((d) => (
                <li key={d._id}>{d.content}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-2 p-2 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <span>
            I have read and understood the above disclaimer and agree to the
            terms.
          </span>
        </label>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end">
          {disclaimerAccepted ?
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            I Understand
          </button> :
        
          <button
            disabled={!agreed || saving}
            onClick={handleAccept}
            className={`px-4 py-2 rounded-lg text-white ${
              agreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
            }`}
          >
            {saving ? "Saving..." : "Accept & Continue"}
          </button>
          }
        </div>
      </div>
    </div>
  );
};

export default ParentDisclaimerModal;
