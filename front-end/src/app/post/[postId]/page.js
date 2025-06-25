'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

export default function PostPage() {
    const { postId } = useParams();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postingComment, setPostingComment] = useState(false);

    useEffect(() => {
        async function fetchUserAndPost() {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Non connecté.');

                const decoded = jwtDecode(token);
                const userId = decoded.userId || decoded.id || decoded._id || decoded.sub || (decoded.user && decoded.user._id);
                if (!userId) throw new Error('Token invalide.');

                // Fetch user info
                const uRes = await fetch(`http://localhost:4001/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!uRes.ok) throw new Error('Erreur récupération utilisateur');
                const uData = await uRes.json();
                setUser(uData.user);

                // Fetch post info
                const pRes = await fetch(`http://localhost:4002/api/posts/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!pRes.ok) throw new Error('Post introuvable');
                const pData = await pRes.json();
                setPost(pData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserAndPost();
    }, [postId]);

    const handleAddComment = async () => {
        if (!commentContent.trim()) return;

        setPostingComment(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Non connecté.');

            const res = await fetch(`http://localhost:4002/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: commentContent,
                    author: user._id,  // ton userId injecté
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Erreur lors de l\'ajout du commentaire');
            }

            setCommentContent('');
            alert('Commentaire ajouté !');
            // Optionnel: tu peux recharger les commentaires ici

        } catch (err) {
            setError(err.message);
        } finally {
            setPostingComment(false);
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-600">Chargement…</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!post) return <div className="text-center mt-10">Post non trouvé.</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => router.back()}
                className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← Retour
            </button>

            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={post.authorAvatarUrl || '/default-avatar.png'}
                        alt={post.authorUsername}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="font-semibold text-lg">{post.authorUsername}</h2>
                        <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <p className="text-gray-800 text-base">{post.content}</p>
            </div>

            <div className="mb-6">
        <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Ajouter un commentaire..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={postingComment}
        />
                <button
                    onClick={handleAddComment}
                    disabled={postingComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {postingComment ? 'Envoi...' : 'Envoyer'}
                </button>
            </div>

            {/* Ici tu peux afficher la liste des commentaires si tu veux */}
        </div>
    );
}