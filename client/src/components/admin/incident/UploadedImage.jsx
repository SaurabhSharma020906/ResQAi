import { useState } from "react";
import {
  Image as ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";

function UploadedImage({ incident }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!incident) return null;

  const image =
    incident.image ||
    incident.imageUrl ||
    incident.photo ||
    incident.photoUrl ||
    incident.uploadedImage ||
    incident.media?.[0] ||
    null;

  const imageUrl = image && image.startsWith("http")
    ? image
    : image
      ? `${(import.meta.env.VITE_SERVER_URL || "http://localhost:5000")}${image.startsWith("/") ? "" : "/"}${image}`
      : null;

  if (!imageUrl || imageError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

        <div className="bg-slate-700 text-white px-6 py-4">

          <h2 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon size={22} />
            Uploaded Image
          </h2>

        </div>

        <div className="p-10 flex flex-col items-center justify-center text-gray-500">

          <ImageIcon
            size={60}
            className="mb-4 opacity-40"
          />

          <h3 className="text-lg font-semibold">
            No Image Uploaded
          </h3>

          <p className="text-sm mt-2">
            This incident does not contain any uploaded photo.
          </p>

        </div>

      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

        {/* Header */}

        <div className="bg-slate-700 text-white px-6 py-4">

          <h2 className="text-xl font-bold flex items-center gap-2">

            <ImageIcon size={22} />

            Uploaded Image

          </h2>

        </div>

        {/* Image */}

        <div className="relative group">

          <img
            src={imageUrl}
            alt="Incident"
            className="w-full h-80 object-cover"
            onError={() => setImageError(true)}
          />

          <button
            onClick={() => setPreviewOpen(true)}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white rounded-xl p-3 opacity-0 group-hover:opacity-100 transition"
          >
            <ZoomIn size={20} />
          </button>

        </div>

      </div>

      {/* Fullscreen Preview */}

      {previewOpen && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-8">

          <button
            onClick={() => setPreviewOpen(false)}
            className="absolute top-6 right-6 bg-white rounded-full p-3 hover:bg-gray-200 transition"
          >
            <X size={22} />
          </button>

          <img
            src={imageUrl}
            alt="Incident Preview"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
          />

        </div>
      )}
    </>
  );
}

export default UploadedImage;