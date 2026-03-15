export function Projects() {
  return (
    <section className="py-12 px-4 border-t border-zinc-800/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">Projects</h2>
        <ul className="space-y-4">
          <li className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800">
            <h3 className="font-medium text-white">Project one</h3>
            <p className="text-sm text-zinc-400 mt-1">Short description.</p>
          </li>
          <li className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800">
            <h3 className="font-medium text-white">Project two</h3>
            <p className="text-sm text-zinc-400 mt-1">Short description.</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
