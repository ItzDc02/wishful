
import { useState, useMemo } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function NewWish() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const titleMax = 80;
  const descMax = 1000;

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    !uploading &&
    !submitting;

  const handleCloudinaryUpload = async (file: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET || ""
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/auto/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      if (!json.secure_url) throw new Error("Upload failed");
      setImageUrl(json.secure_url);
    } catch (e) {
      console.error(e);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await api.post("/wishes", { title, description, imageUrl });
      navigate(`/wish/${res.data.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  const preview = useMemo(
    () => ({
      title: title || "Untitled wish",
      description:
        description ||
        "Describe what you need and how it will help. This preview updates live.",
      imageUrl,
    }),
    [title, description, imageUrl]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-8 shadow-xl space-y-6"
        >
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">Make a Wish</h1>
            <p className="text-sm text-neutral-400">
              Keep it honest, specific, and actionable.
            </p>
          </header>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, titleMax))}
              required
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Eg. College tuition shortfall"
            />
            <p className="text-xs text-neutral-500 text-right">
              {title.length}/{titleMax}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, descMax))
              }
              required
              rows={6}
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              placeholder="Explain your situation and how this will help."
            />
            <p className="text-xs text-neutral-500 text-right">
              {description.length}/{descMax}
            </p>
          </div>

          {/* Image uploader */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image (optional)</label>

            <label className="block cursor-pointer rounded-lg border border-dashed border-neutral-700 p-4 text-center text-sm hover:border-indigo-500">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  e.target.files && handleCloudinaryUpload(e.target.files[0])
                }
              />
              {uploading ? "Uploading…" : "Click to upload or drop an image"}
            </label>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className="mt-2 max-h-60 w-full object-cover rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            {submitting ? "Posting…" : "Post Wish"}
          </button>
        </form>

        {/* Live preview */}
        <aside className="hidden md:block">
          <div className="sticky top-6">
            <h2 className="mb-3 text-sm font-semibold text-neutral-400">
              Preview
            </h2>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-lg">
              {preview.imageUrl && (
                <img
                  src={preview.imageUrl}
                  alt=""
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold">{preview.title}</h3>
                <p className="text-sm text-neutral-300 whitespace-pre-line">
                  {preview.description}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
