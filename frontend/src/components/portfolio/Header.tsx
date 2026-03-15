import { BackendStatus } from '../BackendStatus'

export function Header() {
  return (
    <header className="border-b border-zinc-800/80 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-semibold text-zinc-100 hover:text-white transition-colors">
          Portfolio
        </a>
        <div className="group flex items-center gap-2" title="Backend status">
          <BackendStatus />
        </div>
      </div>
    </header>
  )
}
