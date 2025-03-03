export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#212525]/80 backdrop-blur-lg border-b border-[#DDFFDC]/10">
      <div className="max-w-7xl mx-auto px-7 py-4 flex items-center justify-between">
        <div className="text-[#DDFFDC] font-bold text-xl">DePL</div>
        <nav className="flex items-center gap-6">
          <a href="/docs" className="text-[#DDFFDC]/70 hover:text-[#DDFFDC] transition-colors">Docs</a>
          <a href="/dashboard" className="text-[#DDFFDC]/70 hover:text-[#DDFFDC] transition-colors">Dashboard</a>
          <a href="/login" className="px-4 py-2 bg-[#DDFFDC]/10 text-[#DDFFDC] rounded-lg hover:bg-[#DDFFDC]/20 transition-all">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
} 