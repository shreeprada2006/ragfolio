export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 py-6 px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Portfolio. Built with React + Vite + Tailwind.
      </div>
    </footer>
  )
}
