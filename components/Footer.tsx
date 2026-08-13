import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer>
      <div className="mt-20 border-t border-slate-200 py-10 dark:border-slate-800">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Big Walk Field Guide</div>
            <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              A community-made companion. Not affiliated with House House or Panic.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/puzzles">Puzzles</Link>
            <Link href="/find-players">Find Players</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} {siteMetadata.title}. Game names and trademarks belong to
          their respective owners.
        </div>
      </div>
    </footer>
  )
}
