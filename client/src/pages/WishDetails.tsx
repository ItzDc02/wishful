import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/http';
import { Wish } from '../types';
import FulfillWishButton from '../components/FulfillWishButton';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';

export default function WishDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<Wish | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await api.get(`/wishes/${id}`);
        if (!ignore) setWish(res.data);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          if (!ignore) setNotFound(true);
        } else {
          console.error(e);
        }
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">Wish not found</h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-300">
          It may have been deleted or never existed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-md px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 transition"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  if (!wish) return <p className="p-6">Loading…</p>;

  const isFulfilled = wish.status === 'fulfilled' || wish.fulfilled;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{wish.title}</h1>
        {!isFulfilled && <FulfillWishButton wishId={wish.id} />}
      </div>

      {/* Image */}
      {wish.imageUrl && (
        <img
          src={wish.imageUrl}
          alt={wish.title}
          className="w-full h-auto rounded-lg mb-6 object-cover"
        />
      )}

      {/* Description */}
      <p className="mb-8 whitespace-pre-wrap leading-relaxed">{wish.description}</p>

      {/* Social actions */}
      <div className="flex items-center gap-4 mb-10">
        <LikeButton wishId={wish.id} />
      </div>

      {/* Comments */}
      <CommentSection wishId={wish.id} />
    </div>
  );
}
