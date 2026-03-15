import { useState } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

type Message = { role: 'user' | 'assistant'; content: string }

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (content: string) => {
    setMessages((prev) => [...prev, { role: 'user', content }])
    setLoading(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'Request failed'
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${detail}` }])
        return
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer ?? '' }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Is the backend running?' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 px-4 border-t border-zinc-800/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">Chat</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col max-h-[420px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 ? (
              <p className="text-zinc-500 text-sm">Send a message to start the conversation.</p>
            ) : (
              messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)
            )}
          </div>
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </section>
  )
}
