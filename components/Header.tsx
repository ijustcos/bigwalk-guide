import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'flex items-center w-full border-b border-slate-200/80 bg-[#f7f4ea]/90 dark:border-slate-800 dark:bg-[#0e1716]/90 justify-between py-5 backdrop-blur'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#153f38] text-lg font-black text-[#f5c24d] shadow-sm">
            BW
          </span>
          <div className="hidden sm:block">
            <div className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
              Big Walk
            </div>
            <div className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              Field Guide
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-2 overflow-x-auto sm:flex md:max-w-72 lg:max-w-none">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-[#153f38] dark:text-slate-200 dark:hover:bg-slate-800 ${link.href === '/find-players' ? 'bg-[#f5c24d] text-[#153f38] hover:bg-[#ffd66c]' : ''}`}
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
