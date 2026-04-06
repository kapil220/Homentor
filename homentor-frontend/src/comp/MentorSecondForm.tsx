import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import axios from "axios";

export default function MentorSecondForm({mentorId, phone}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        twelfthStream: "",
        twelfthBoard: "",
        graduation: {
            degree: "",
            specialization: "",
            college: "",
            graduationYear: "",
        },
        otherGraduationDegree: "",
        postGraduation: {
            degree: "",
            college: "",
        },
        email: "",
        alternatePhone: "",
        referenceContact: "",
        permanentAddress: "",
        temporaryAddress: "",
        bankAccount: "",
        ifsc: "",
        age: "",
        accountHolderName: ""
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDocument = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        const isVideo = file.type.startsWith("video/");
        const uploadUrl = `https://api.cloudinary.com/v1_1/dpveehhtq/${isVideo ? "video" : "image"}/upload`;
        // Example: Upload to Cloudinary (replace with your API)
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "homentor"); // Replace with your preset
        formDataUpload.append("cloud_name", "dpveehhtq")

        try {
            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formDataUpload,
            });
            const data = await res.json();
            console.log(data.secure_url)
            handleChange([key], data.secure_url);
        } catch (err) {
            console.error("Photo upload failed", err);
            alert("Failed to upload photo");
        }
    }

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }));
    };
    
    const handleSubmit = async () => {
        
        try {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/mentor/${mentorId}`,
            formData
          );
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/mentor-leads/second-form`,
            {phone : phone}
          );
          alert("Mentor updated successfully!");
          setOpen(false);
        } catch (err) {
          console.error(err);
          alert("Failed to update mentor.");
        }
      };
    return (
        <>
            <Button onClick={() => setOpen(true)}>Complete Profile</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Complete Your Mentor Profile
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            This information helps us assign you better students and classes.
                        </p>
                    </DialogHeader>

                    {/* ================= 12th Details ================= */}
                    <section className="space-y-4 mt-6">
                        <h3 className="font-semibold text-lg">Senior Secondary (11th–12th)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Stream</Label>
                                <Input value={formData.twelfthStream} onChange={(e) => handleChange("twelfthStream", e.target.value)} placeholder="Science / Commerce / Arts" />
                            </div>

                            <div>
                                <Label>Board</Label>
                                <Input value={formData.twelfthBoard}
                                    onChange={(e) => handleChange("twelfthBoard", e.target.value)} placeholder="CBSE / ICSE / State Board" />
                            </div>
                        </div>
                    </section>

                    <Separator className="my-6" />

                    {/* ================= Graduation ================= */}
                    <section className="space-y-4">
                        <h3 className="font-semibold text-lg">Graduation</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Degree</Label>
                                <Input value={formData.graduation.degree}
                                    onChange={(e) =>
                                        handleNestedChange("graduation", "degree", e.target.value)
                                    } placeholder="B.Sc / B.Tech / B.A" />
                            </div>

                            <div>
                                <Label>Specialization</Label>
                                <Input value={formData.graduation.specialization} onChange={(e) =>
                                    handleNestedChange("graduation", "specialization", e.target.value)
                                } placeholder="Mathematics / Physics / CS" />
                            </div>

                            <div>
                                <Label>College / University</Label>
                                <Input value={formData.graduation.college}
                                    onChange={(e) =>
                                        handleNestedChange("graduation", "college", e.target.value)
                                    } placeholder="University Name" />
                            </div>

                            <div>
                                <Label>Graduation Year</Label>
                                <Input value={formData.graduation.graduationYear} onChange={(e) =>
                                    handleNestedChange("graduation", "graduationYear", e.target.value)
                                } type="number" placeholder="2022" />
                            </div>
                            <div>
                                <Label>Degree (Optional)</Label>
                                <Input value={formData.otherGraduationDegree}
                                    onChange={(e) => handleChange("otherGraduationDegree", e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <Separator className="my-6" />

                    {/* ================= Post Graduation ================= */}
                    <section className="space-y-4">
                        <h3 className="font-semibold text-lg">Post Graduation (Optional)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>PG Degree</Label>
                                <Input value={formData.postGraduation.degree}
                                    onChange={(e) =>
                                        handleNestedChange("postGraduation", "degree", e.target.value)
                                    } placeholder="M.Sc / M.Tech / M.A" />
                            </div>

                            <div>
                                <Label>PG College / University</Label>
                                <Input value={formData.postGraduation.college}
                                    onChange={(e) =>
                                        handleNestedChange("postGraduation", "college", e.target.value)
                                    } placeholder="University Name" />
                            </div>
                        </div>
                    </section>

                    <Separator className="my-6" />

                    {/* ================= Uploads ================= */}
                    <section className="space-y-4">
                        <h3 className="font-semibold text-lg">Documents</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Teaching Introduction Video</Label>
                                <Input onChange={(e)=> handleDocument(e, "teachingVideo")} type="file" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Short self-introduction (optional but recommended)
                                </p>
                            </div>

                            <div>
                                <Label>Aadhaar Card Photo</Label>
                                <Input onChange={(e)=> handleDocument(e, "aadharPhoto")} type="file" />
                            </div>
                            <div>
                                <Label>PAN Card Photo</Label>
                                <Input onChange={(e)=> handleDocument(e, "panPhoto")} type="file" />
                            </div>
                            <div>
                                <Label>Marksheet (12th / Graduation / Latest)</Label>
                                <Input onChange={(e)=> handleDocument(e, "marksheet")} type="file" />
                            </div>

                            <div>
                                <Label>Resume / CV</Label>
                                <Input onChange={(e)=> handleDocument(e, "cv")} type="file" />
                            </div>
                        </div>
                    </section>

                    <Separator className="my-6" />

                    {/* ================= Contact ================= */}
                    <section className="space-y-4">
                        <h3 className="font-semibold text-lg">Contact Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Email Address</Label>
                                <Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} type="email" />
                            </div>
                            <div>
                                <Label>Age</Label>
                                <Input value={formData.age} onChange={(e) => handleChange("age", e.target.value)} type="email" />
                            </div>

                            <div>
                                <Label>Alternate Phone Number</Label>
                                <Input value={formData.alternatePhone} onChange={(e) => handleChange("alternatePhone", e.target.value)} />
                            </div>

                            <div>
                                <Label>Last Teaching Reference Contact</Label>
                                <Input value={formData.referenceContact} onChange={(e) => handleChange("referenceContact", e.target.value)} placeholder="School / Coaching / Tutor Reference" />
                            </div>
                        </div>
                    </section>

                    {/* ================= Address ================= */}
                    <section className="space-y-4">
                        <h3 className="font-semibold text-lg">Address Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Permanent Address</Label>
                                <Input value={formData.permanentAddress} onChange={(e) => handleChange("permanentAddress", e.target.value)} />
                            </div>

                            <div>
                                <Label>Temporary Address</Label>
                                <Input value={formData.temporaryAddress} onChange={(e) => handleChange("temporaryAddress", e.target.value)} />
                            </div>

                        </div>
                    </section>

                    {/* ================= Payment ================= */}
                    <section className="space-y-4">
                        <h3 className="font-semibold text-lg">Payment & Bank Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <Label>Account Holder Name</Label>
                                <Input value={formData.accountHolderName} onChange={(e) => handleChange("accountHolderName", e.target.value)}/>
                            </div>

                            <div>
                                <Label>Bank Account Number</Label>
                                <Input  value={formData.bankAccount} onChange={(e) => handleChange("bankAccount", e.target.value)} />
                            </div>

                            <div>
                                <Label>IFSC Code</Label>
                                <Input  value={formData.ifsc} onChange={(e) => handleChange("ifsc", e.target.value)}/>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Payment details are kept confidential and used only for payouts.
                        </p>
                    </section>

                    {/* ================= Actions ================= */}
                    <div className="flex justify-end gap-3 mt-8">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={()=> handleSubmit()} className="bg-primary">
                            Save & Continue
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
