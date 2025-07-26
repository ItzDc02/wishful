
import { useState, useEffect } from 'react';
import { api } from '../api/http';

type Props = {
  wishId: string;
};

export default function LikeButton({ wishId }: Props) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/wishes/${wishId}/likes`).then(res => setLikes(res.data.likes));
  }, [wishId]);

  const toggle = () => {
    api.post(`/wishes/${wishId}/like`, { user: 'anon' }).then(res => {
      setLikes(res.data.likes);
      setLiked(prev => !prev);
    });
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 text-sm ${liked ? 'text-red-500' : 'text-neutral-500'}`}
    >
      ❤️ {likes}
    </button>
  );
}
