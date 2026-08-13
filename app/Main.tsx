import Link from '@/components/Link'
import { ArrowRight, Compass, Headphones, Map, Radio, Search, Users } from 'lucide-react'

const puzzleCards = [
  {
    title: '4166 / 1899 Number Puzzle',
    cue: 'Numbers hanging above a glass case',
    href: '/puzzles/4166-1899-number-puzzle',
    icon: '4166',
  },
  {
    title: 'Purple Golf Puzzle',
    cue: 'A heavy ball that must cross the island',
    href: '/puzzles/purple-golf-puzzle',
    icon: '●',
  },
  {
    title: 'Microphone / Headphone Puzzle',
    cue: 'Blue chair, headset and distant radio',
    href: '/puzzles/microphone-headphone-puzzle',
    icon: '♫',
  },
  {
    title: 'Button Room Puzzle',
    cue: 'Too many buttons for your group',
    href: '/puzzles/button-room',
    icon: '•••',
  },
]

const quickLinks = [
  {
    title: 'Puzzle solutions',
    body: 'Identify a puzzle by what you can see, then reveal only the hint you need.',
    href: '/puzzles',
    icon: Search,
  },
  {
    title: 'Purple things',
    body: 'What the purple gourds are and where they are used after the main path.',
    href: '/guides/purple-gourds',
    icon: Compass,
  },
  {
    title: 'Solo & matchmaking',
    body: 'Can you play alone or with random players? Get the direct answer.',
    href: '/multiplayer/solo-and-matchmaking',
    icon: Users,
  },
  {
    title: 'Mic not working',
    body: 'Separate a broken microphone from normal proximity voice behavior.',
    href: '/help/mic-not-working',
    icon: Headphones,
  },
]

export default function Home() {
  return (
    <div className="pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#153f38] px-5 py-10 text-white shadow-xl shadow-emerald-950/10 sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-14 lg:py-20">
        <div className="pointer-events-none absolute -top-20 -right-24 h-60 w-60 rounded-full border-[34px] border-[#f5c24d]/10 sm:-top-24 sm:-right-24 sm:h-80 sm:w-80 sm:border-[42px] sm:border-[#f5c24d]/15" />
        <div className="pointer-events-none absolute right-12 -bottom-24 h-56 w-56 rounded-full bg-[#5f8f70]/20 blur-2xl sm:right-32" />
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-[#f8d77d] uppercase">
            Updated for launch week
          </div>
          <h1 className="text-[2.5rem] leading-[1.02] font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Stuck on your
            <br />
            <span className="text-[#f5c24d]">Big Walk?</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/80">
            Find the puzzle you are looking at, reveal spoiler-safe hints, fix multiplayer problems,
            or find people ready to play.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/puzzles"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5c24d] px-5 py-3 font-bold text-[#153f38] transition hover:-translate-y-0.5 hover:bg-[#ffd66c]"
            >
              Find my puzzle <ArrowRight size={18} />
            </Link>
            <Link
              href="/find-players"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
            >
              <Users size={18} /> Find players
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#1f6b5b] uppercase">
              Start with what you see
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Which puzzle is this?</h2>
          </div>
          <Link
            href="/puzzles"
            className="hidden items-center gap-1 text-sm font-bold text-[#1f6b5b] sm:flex"
          >
            All puzzles <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {puzzleCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`grid h-36 place-items-center text-4xl font-black ${index === 0 ? 'bg-[#f5c24d] text-[#153f38]' : index === 1 ? 'bg-[#8763a8] text-white' : index === 2 ? 'bg-[#80abc4] text-[#102e3a]' : 'bg-[#dc6d4f] text-white'}`}
              >
                {card.icon}
              </div>
              <div className="p-5">
                <h3 className="leading-5 font-bold group-hover:text-[#1f6b5b]">{card.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {card.cue}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 border-y border-slate-200 py-12 md:grid-cols-2 dark:border-slate-800">
        {quickLinks.map(({ title, body, href, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className="group flex gap-4 rounded-2xl border border-transparent p-5 transition hover:border-slate-200 hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-900"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#dbeadf] text-[#1f6b5b] dark:bg-emerald-950">
              <Icon size={21} />
            </span>
            <span>
              <span className="font-bold group-hover:text-[#1f6b5b]">{title}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">
                {body}
              </span>
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-14 overflow-hidden rounded-3xl border border-[#153f38]/10 bg-[#e4efe5] p-7 sm:p-10 dark:bg-emerald-950/40">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex gap-3 text-[#1f6b5b]">
              <Radio />
              <Map />
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight">
              No random matchmaking? No problem.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Post a short-lived group listing without creating an account. Choose your platform,
              region and play style, then share a Join Code safely.
            </p>
          </div>
          <Link
            href="/find-players"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#153f38] px-6 py-3.5 font-bold text-white hover:bg-[#1f6b5b]"
          >
            Open Find Players <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
