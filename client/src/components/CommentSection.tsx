
import { useEffect, useState } from 'react';
import { api } from '../api/http';
import { Comment } from '../types';

type Props = {
  wishId: string;
};

export default function CommentSection({ wishId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  const fetch = () =>
    api.get<Comment[]>(`/wishes/${wishId}/comments`).then(res => setComments(res.data));

  useEffect(() => {
    fetch();
  }, [wishId]);

  const addComment = () => {
    if (!text.trim()) return;
    api.post(`/wishes/${wishId}/comments`, { user: 'anon', text }).then(() => {
      setText('');
      fetch();
    });
  };

  return (
    <div className="mt-4">
      {comments.map(c => (
        <div key={c.id} className="mb-2 flex gap-2">
          <span className="font-medium">{c.user}</span>
          <span className="text-neutral-600">{c.text}</span>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Add a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={addComment} className="text-blue-600 text-sm">
          Post
        </button>
      </div>
    </div>
  );
}
