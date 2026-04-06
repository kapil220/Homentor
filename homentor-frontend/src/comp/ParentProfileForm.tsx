import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  initialData?: any;
}

export default function ParentProfileFormModal({
  open,
  onClose,
  userId,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    parentName: initialData?.parentName || "",
    children: initialData?.children || [
      { name: "", class: "", school: "" },
    ],
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      pincode: initialData?.address?.pincode || "",
    },
  });

  /* ---------------- CHILD HANDLERS ---------------- */

  const addChild = () => {
    setForm((prev) => ({
      ...prev,
      children: [...prev.children, { name: "", class: "", school: "" }],
    }));
  };

  const removeChild = (index: number) => {
    setForm((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const handleChildChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedChildren = [...form.children];
    updatedChildren[index][field] = value;

    setForm((prev) => ({
      ...prev,
      children: updatedChildren,
    }));
  };

  /* ---------------- OTHER HANDLERS ---------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        form
      );
      onClose();
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Parent Profile Details</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update your personal details and children information
          </p>
        </DialogHeader>

        {/* Parent Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Parent Name</Label>
            <Input
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Children Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Children Details</h3>
            <Button size="sm" variant="outline" onClick={addChild}>
              <Plus className="w-4 h-4 mr-1" /> Add Child
            </Button>
          </div>

          {form.children.map((child, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-3 relative"
            >
              {form.children.length > 1 && (
                <button
                  onClick={() => removeChild(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Child Name</Label>
                  <Input
                    value={child.name}
                    onChange={(e) =>
                      handleChildChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Class</Label>
                  <Input
                    value={child.class}
                    onChange={(e) =>
                      handleChildChange(index, "class", e.target.value)
                    }
                    placeholder="e.g. 6th"
                  />
                </div>

                <div>
                  <Label>School Name</Label>
                  <Input
                    value={child.school}
                    onChange={(e) =>
                      handleChildChange(index, "school", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <h3 className="font-semibold mt-6">Address</h3>

        <div className="space-y-3">
          <Input
            name="address.street"
            value={form.address.street}
            onChange={handleChange}
            placeholder="Street / House No"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              placeholder="City"
            />
            <Input
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          <Input
            name="address.pincode"
            value={form.address.pincode}
            onChange={handleChange}
            placeholder="Pincode"
          />
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
