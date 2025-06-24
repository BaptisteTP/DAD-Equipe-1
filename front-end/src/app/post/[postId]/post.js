'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const { id } = useParams(); // "id" est le nom du fichier [id]
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error('Post introuvable');
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Chargement…</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
                src={post.authorAvatarUrl}
                alt={post.authorUsername}
                className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-lg">{post.authorUsername}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-gray-800 text-base">{post.content}</p>
        </div>
      </div>
  );
}
