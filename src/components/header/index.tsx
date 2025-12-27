import { Link } from "@tanstack/react-router"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-300 flex-shrink-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
            DF
          </div>
          <div className="text-sm font-medium text-gray-900">DuckFish</div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">工作台</Link>
          <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">博客</Link>
        </nav>
      </div>
    </header>
  )
}
