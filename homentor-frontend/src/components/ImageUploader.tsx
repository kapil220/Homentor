import React, { useRef, useState } from "react";

export default function ImageUploader({ value, onUpload, label }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);

  const handleClick = () => fileInputRef.current.click();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "homentor"); // change this
    formData.append("cloud_name", "dpveehhtq"); // change this

    setUploading(true);
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dpveehhtq/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setPreview(data.secure_url);
      onUpload(data.secure_url);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1">
         {label && <label className="text-sm font-medium">{label}</label>}
      <div
        className="w-full border-2 border-dashed border-gray-600 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition"
        onClick={handleClick}
      >
        {uploading ? (
          <p className="text-center text-blue-600">Uploading...</p>
        ) : preview ? (
          <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />
        ) : (
          <div className="text-center text-gray-700">
            <p className="text-sm">Click to upload an image</p>
            <p className="text-xs">or drag and drop (not yet enabled)</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
