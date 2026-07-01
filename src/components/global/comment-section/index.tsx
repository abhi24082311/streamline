'use client'
import React, { useState } from 'react'
import { addComment, deleteComment } from '@/actions/video'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  timestamp: number | null
  createdAt: string
  User: {
    firstName: string | null
    lastName: string | null
    image: string | null
  } | null
}

interface Props {
  videoId: string
  initialComments: Comment[]
}

const CommentSection = ({ videoId, initialComments }: Props) => {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [text, setText] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setIsPending(true)
    const res = await addComment(videoId, text)
    setIsPending(false)
    if (res.status === 200) {
      toast.success('Comment added')
      setText('')
      // Optimistically append placeholder comment
      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: text,
          timestamp: null,
          createdAt: new Date().toISOString(),
          User: null,
        },
      ])
    } else {
      toast.error('Could not post comment')
    }
  }

  const handleDelete = async (commentId: string) => {
    const res = await deleteComment(commentId)
    if (res.status === 200) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } else {
      toast.error('Could not delete comment')
    }
  }

  return (
    <div className="flex flex-col gap-y-4 h-full">
      <h2 className="text-base font-semibold text-white">
        Comments ({comments.length})
      </h2>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
        >
          <Send size={16} className="text-white" />
        </button>
      </form>

      {/* Comments list */}
      <div className="flex flex-col gap-y-3 overflow-auto flex-1">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-600 text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group flex gap-x-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"
            >
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarImage src={comment.User?.image ?? ''} />
                <AvatarFallback className="bg-indigo-700 text-[10px]">
                  {comment.User?.firstName?.[0] ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-neutral-300">
                    {comment.User
                      ? `${comment.User.firstName} ${comment.User.lastName}`
                      : 'You'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-neutral-600">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-400 text-neutral-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 mt-1 break-words">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
