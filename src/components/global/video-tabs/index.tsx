'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CommentSection from '@/components/global/comment-section'
import { Sparkles, FileText, MessageSquare, Zap } from 'lucide-react'

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
  summary?: string | null
}

const VideoTabs = ({ videoId, initialComments, summary }: Props) => {
  return (
    <Tabs defaultValue="activity" className="w-full h-full flex flex-col">
      {/* Tab bar */}
      <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1 w-full grid grid-cols-3 flex-shrink-0">
        <TabsTrigger
          value="ai"
          className="rounded-lg text-xs font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-neutral-400 flex items-center gap-1.5"
        >
          <Sparkles size={12} />
          Ai Tools
        </TabsTrigger>
        <TabsTrigger
          value="transcript"
          className="rounded-lg text-xs font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-neutral-400 flex items-center gap-1.5"
        >
          <FileText size={12} />
          Transcript
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="rounded-lg text-xs font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-neutral-400 flex items-center gap-1.5"
        >
          <MessageSquare size={12} />
          Activity
        </TabsTrigger>
      </TabsList>

      {/* AI Tools */}
      <TabsContent value="ai" className="flex-1 overflow-auto mt-4">
        <div className="flex flex-col gap-y-4">
          <div>
            <h3 className="text-base font-semibold text-white">Ai Tools</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Taking your video to the next step with the power of AI
            </p>
          </div>

          {/* Coming soon card */}
          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Opal Ai ✦
              </span>
            </div>
            <div className="flex flex-col gap-y-3">
              {[
                { label: 'Summary', desc: 'Generate a description for your video using AI.' },
                { label: 'Transcript', desc: 'Auto-generate a full transcript for your video.' },
                { label: 'AI Agent', desc: 'Viewers can ask questions on your video and our AI agent will respond.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={12} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-200">{item.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600/90 text-white text-xs font-semibold transition-colors">
                Try now
              </button>
              <button className="flex-1 py-2 rounded-lg border border-[#2a2a2a] text-neutral-300 text-xs font-semibold hover:bg-[#2a2a2a] transition-colors">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Transcript */}
      <TabsContent value="transcript" className="flex-1 overflow-auto mt-4">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-base font-semibold text-white">Transcript</h3>
          {summary ? (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wider">AI Summary</p>
              <p className="text-sm text-neutral-300 leading-relaxed">{summary}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3">
                <FileText size={18} className="text-neutral-600" />
              </div>
              <p className="text-neutral-500 text-sm font-medium">No transcript yet</p>
              <p className="text-neutral-700 text-xs mt-1">
                Enable AI Tools to generate a full transcript
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Activity / Comments */}
      <TabsContent value="activity" className="flex-1 overflow-auto mt-4 min-h-0">
        <CommentSection videoId={videoId} initialComments={initialComments} />
      </TabsContent>
    </Tabs>
  )
}

export default VideoTabs
