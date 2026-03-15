type Role = 'user' | 'assistant'

interface ChatMessageProps {
  role: Role
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isUser ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}
