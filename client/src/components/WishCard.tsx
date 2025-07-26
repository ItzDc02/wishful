import { useNavigate } from "react-router-dom";
import { Wish } from "../types";
import LikeButton from "./LikeButton";

export default function WishCard({ wish }: { wish: Wish }) {
  const navigate = useNavigate();
  const isFulfilled = wish.status === "fulfilled" || wish.fulfilled;

  const goToDetails = () => navigate("/wish/" + wish.id);

  return (
    <div
      onClick={goToDetails}
      className="rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 p-4 backdrop-blur-md flex flex-col cursor-pointer hover:shadow-lg transition"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={
            wish.avatarUrl ||
            `https://api.dicebear.com/8.x/personas/svg?seed=${wish.id}`
          }
          alt="avatar"
          className="h-8 w-8 rounded-full"
          onClick={(e) => e.stopPropagation()}
        />
        <div>
          <p className="text-sm font-medium">{wish.ownerName || "Anonymous"}</p>
          <p className="text-xs text-neutral-400">Just now</p>
        </div>
      </div>

      {/* Image */}
      {wish.imageUrl && (
        <img
          src={wish.imageUrl}
          alt={wish.title}
          className="mb-4 h-40 w-full object-cover rounded-md"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* Title + description */}
      <h3 className="text-lg font-semibold mb-1">{wish.title}</h3>
      <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
        {wish.description?.slice(0, 120)}
        {wish.description && wish.description.length > 120 ? "…" : ""}
      </p>

      {/* Reaction bar */}
      <div
        className={`flex items-center gap-4 mt-4 ${
          isFulfilled ? "text-neutral-500" : "text-white"
        } text-sm`}
        onClick={(e) => e.stopPropagation()}
      >
        <LikeButton wishId={wish.id} />
        <button
          className="hover:underline"
          onClick={() => navigate("/wish/" + wish.id + "#comments")}
        >
          💬 Comment
        </button>
        <button
          className={`rounded-md px-3 py-1 font-medium ${
            isFulfilled
              ? "bg-amber-400 dark:bg-neutral-700 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500"
          } transition`}
          disabled={isFulfilled}
          onClick={goToDetails}
        >
          {isFulfilled ? "Fulfilled" : "Fulfill"}
        </button>
      </div>
    </div>
  );
}
