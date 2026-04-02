import { useState } from "react";

export default function AddressModal({ isOpen, onClose, onSave, bookingId }) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    // Send address to backend
    onSave({ bookingId, address });

    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">
        <h2 className="text-lg font-semibold mb-4">Add Your Address</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete address"
            className="border rounded-lg px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
