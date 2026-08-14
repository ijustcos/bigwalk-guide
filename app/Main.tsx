import Image from 'next/image'
import Link from '@/components/Link'
import { ArrowRight, Compass, Headphones, Map, Play, Radio, Search, Users } from 'lucide-react'
import { allBlogs } from 'contentlayer/generated'

const puzzleCards = [
  {
    title: '4166 / 1899 Number Puzzle',
    cue: 'Numbers hanging above a glass case',
    href: '/puzzles/4166-1899-number-puzzle',
    image: '/static/images/big-walk/official-03.jpg',
  },
  {
    title: 'Purple Golf Puzzle',
    cue: 'A heavy ball that must cross the island',
    href: '/puzzles/purple-golf-puzzle',
    image: '/static/images/big-walk/official-07.jpg',
  },
  {
    title: 'Microphone / Headphone Puzzle',
    cue: 'Blue chair, headset and distant radio',
    href: '/puzzles/microphone-headphone-puzzle',
    image: '/static/images/big-walk/official-01.jpg',
  },
  {
    title: 'Button Room Puzzle',
    cue: 'Too many buttons for your group',
    href: '/puzzles/button-room',
    image: '/static/images/big-walk/official-08.jpg',
  },
]

const popularGuides = [
  {
    title: 'Beginner guide: what to do first',
    body: 'A spoiler-light route from choosing a host to opening the island.',
    href: '/guides/beginner-guide',
  },
  {
    title: 'How to play with friends',
    body: 'Friends list, Join Codes, passwords and cross-platform sessions.',
    href: '/multiplayer/how-to-play-with-friends',
  },
  {
    title: 'Map and compass locations',
    body: 'Unlock the Map Room and understand what both maps actually show.',
    href: '/guides/map-and-compass',
  },
  {
    title: 'Best tower order',
    body: 'The practical route through Red, Green, Yellow, Blue and Black.',
    href: '/guides/tower-order',
  },
  {
    title: 'All tools explained',
    body: 'What to carry, what to leave behind and which tools solve problems.',
    href: '/guides/all-tools',
  },
  {
    title: 'Achievements and 100%',
    body: 'A clean checklist for every Steam achievement and PS5 trophy.',
    href: '/guides/achievements',
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
    title: 'Progression guides',
    body: 'Tower order, transport unlocks, the ending and what to do next.',
    href: '/guides',
    icon: Compass,
  },
  {
    title: 'Multiplayer answers',
    body: 'Player count, crossplay, Join Codes, host saves and matchmaking.',
    href: '/multiplayer/how-to-play-with-friends',
    icon: Users,
  },
  {
    title: 'Technical help',
    body: 'Fix connection, microphone, controller and performance problems.',
    href: '/help/connection-failed',
    icon: Headphones,
  },
]

export default function Home() {
  const puzzleCount = allBlogs.filter((post) => post.category === 'Puzzle').length
  const answerCount = allBlogs.filter((post) => !post.draft).length
  return (
    <div className="pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#102f2a] text-white shadow-xl shadow-emerald-950/15 sm:rounded-[2rem]">
        <div className="grid lg:min-h-[590px] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10 order-2 flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:order-1 lg:px-14 lg:py-16">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-[#f8d77d] uppercase">
              Updated August 14, 2026
            </div>
            <h1 className="text-[2.5rem] leading-[1.02] font-black tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]">
              Your field guide for a
              <br />
              <span className="text-[#f5c24d]">very Big Walk.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50/80">
              Find the puzzle you are looking at, work out where to go next, fix multiplayer
              problems, or find people ready to play.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/puzzles"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f5c24d] px-5 py-3 font-bold text-[#153f38] transition hover:-translate-y-0.5 hover:bg-[#ffd66c]"
              >
                Find my puzzle <ArrowRight size={18} />
              </Link>
              <Link
                href="/guides/beginner-guide"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
              >
                Start here
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-emerald-50/60">
              <span>2–12 players</span>
              <span>Crossplay</span>
              <span>Spoiler-controlled</span>
            </div>
          </div>

          <div className="relative order-1 min-h-[290px] sm:min-h-[380px] lg:order-2 lg:min-h-full">
            <Image
              src="/static/images/big-walk/official-01.jpg"
              alt="Four colorful Big Walk characters carrying tools on a coastal cliff"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center lg:object-[58%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f2a] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#102f2a] lg:via-[#102f2a]/15 lg:to-transparent" />
            <span className="absolute right-4 bottom-4 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-semibold text-white/85 backdrop-blur-sm">
              Official screenshot © House House / Panic
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 py-7 text-center dark:divide-slate-800 dark:border-slate-800">
        <div>
          <div className="text-2xl font-black text-[#1f6b5b] sm:text-3xl dark:text-emerald-300">
            {answerCount}
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:text-xs">
            useful answers
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[#1f6b5b] sm:text-3xl dark:text-emerald-300">
            {puzzleCount}
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:text-xs">
            puzzle pages
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[#1f6b5b] sm:text-3xl dark:text-emerald-300">
            9
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:text-xs">
            guide categories
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#1f6b5b] uppercase dark:text-emerald-300">
              Start with what you see
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Which puzzle is this?</h2>
          </div>
          <Link
            href="/puzzles"
            className="hidden items-center gap-1 text-sm font-bold text-[#1f6b5b] sm:flex dark:text-emerald-300"
          >
            All puzzles <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {puzzleCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-40 overflow-hidden bg-slate-200">
                <Image
                  src={card.image}
                  alt="Big Walk gameplay screenshot"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
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

      <section className="border-y border-slate-200 py-14 dark:border-slate-800">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-6">
            <p className="text-xs font-bold tracking-[0.2em] text-[#1f6b5b] uppercase dark:text-emerald-300">
              Popular now
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Answers players need first
            </h2>
            <p className="mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-300">
              Direct, source-checked answers for the questions that appear as soon as a group lands
              on the island.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {popularGuides.map((guide, index) => (
              <Link
                href={guide.href}
                key={guide.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-700/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-xs font-black tracking-[0.16em] text-[#1f6b5b] dark:text-emerald-300">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-black group-hover:text-[#1f6b5b]">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {guide.body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl sm:min-h-[440px]">
            <Image
              src="/static/images/big-walk/official-02.jpg"
              alt="Big Walk characters making shapes together on a beach at sunset"
              fill
              sizes="(max-width: 768px) 100vw, 65vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 text-white">
              <p className="text-xs font-bold tracking-[0.18em] text-[#f8d77d] uppercase">
                Teamwork is the mechanic
              </p>
              <h2 className="mt-2 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                Talking, pointing and getting wonderfully lost.
              </h2>
              <a
                href="https://www.youtube.com/watch?v=xfzapBQssa0"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#153f38] transition hover:scale-[1.02]"
              >
                <Play size={16} fill="currentColor" /> Watch the official trailer
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="relative min-h-[210px] overflow-hidden rounded-3xl">
              <Image
                src="/static/images/big-walk/official-04.jpg"
                alt="A Big Walk group exploring the island at night"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                Night exploration
              </span>
            </div>
            <div className="relative min-h-[210px] overflow-hidden rounded-3xl">
              <Image
                src="/static/images/big-walk/official-06.jpg"
                alt="Big Walk characters waiting together at a train platform at sunset"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                Unlock the train
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-right text-[11px] text-slate-400">
          Official Big Walk screenshots © House House in cooperation with Panic
        </p>
      </section>

      <section className="grid gap-4 border-y border-slate-200 py-12 md:grid-cols-2 dark:border-slate-800">
        {quickLinks.map(({ title, body, href, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className="group flex gap-4 rounded-2xl border border-transparent p-5 transition hover:border-slate-200 hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-900"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#dbeadf] text-[#1f6b5b] dark:bg-emerald-950 dark:text-emerald-300">
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
            <div className="flex gap-3 text-[#1f6b5b] dark:text-emerald-300">
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
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#153f38] px-6 py-3.5 font-bold text-white hover:bg-[#1f6b5b]"
          >
            Open Find Players <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
