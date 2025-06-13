import React from "react";

const Post = ({ username, date, content }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-4 mb-4 border">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
        <div>
          <p className="font-semibold">{username}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>

      <p className="mb-3">{content}</p>

      <div className="flex justify-between text-sm text-gray-600">
        <button className="hover:text-blue-600">👍 Like</button>
        <button className="hover:text-blue-600">💬 Commentaire</button>
        <button className="hover:text-blue-600">🔗 Partager</button>
      </div>
    </div>
  );
};

export default Post;