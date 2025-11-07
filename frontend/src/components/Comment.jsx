import React from 'react';

export default function Comment({ comment }) {
  const avatarSeed = encodeURIComponent(comment.user?.name || 'User');
  const createdAt = comment.createdAt ? new Date(comment.createdAt).toLocaleString() : '';

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-start gap-3">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}`}
          alt={comment.user?.name || 'User'}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate font-medium text-gray-800">{comment.user?.name || 'Unknown user'}</p>
            {createdAt && <p className="text-xs text-gray-500">{createdAt}</p>}
          </div>
          <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}