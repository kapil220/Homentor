import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import axios from "axios";

const TerminateClassModal = ({ open, onClose, booking, onTerminate }) => {
  const [reason, setReason] = useState("");

  // Example values (replace with real backend calculation)
  const completed = booking?.progress/60 || 0;
  const total = booking?.duration || 0;
  const price = booking?.price || 0;

  // Refund logic (example)
  const perClass = price / total;
  const usedAmount = perClass * completed;
  const refundableAmount = Math.max(price - usedAmount, 0);

  const handleTerminate = async() => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/class-bookings/${booking._id}/terminate`, {
      bookingId: booking._id,
      reason,
      refundableAmount: refundableAmount.toFixed(0)
    }).then((res)=> {console.log(res.data); window.location.reload()})

    onTerminate({ reason, refundableAmount });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            Terminate Class
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to terminate this class?  
            Refund amount will be calculated automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Refund Summary */}
        <div className="mt-3 border rounded-xl p-4 bg-red-50">
          <p className="font-medium text-red-700 mb-2">Refund Summary</p>

          <div className="space-y-1 text-sm text-gray-700">
            <p>Total Classes: <span className="font-semibold">{total}</span></p>
            <p>Completed Classes: <span className="font-semibold">{completed}</span></p>
            <p>Class Price: ₹{price}</p>
            <p className="font-semibold text-red-600">
              Refundable Amount: ₹{refundableAmount.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-4">
          <label className="font-medium text-sm">Reason for termination</label>
          <Textarea
            className="mt-1"
            placeholder="Write the reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleTerminate}>
            Terminate Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TerminateClassModal;
