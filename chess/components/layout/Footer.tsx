import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#080b14] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">♛</span>
            <span className="font-bold text-white text-sm">Chess<span className="text-gradient font-black">Master</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 ChessMaster Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/tutorial" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/play/computer" className="hover:text-white transition-colors">Play</Link>
            <Link href="/puzzles" className="hover:text-white transition-colors">Puzzles</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
