'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Filter,
  Flag,
  Mic,
  Plus,
  RefreshCw,
  Users,
  X,
} from 'lucide-react'
import type { PublicLfgPost } from '@/lib/lfg'
import TurnstileWidget from './TurnstileWidget'

const samplePosts: PublicLfgPost[] = [
  {
    id: 'sample-1',
    displayName: 'Maple',
    platform: 'PC',
    region: 'Europe',
    language: 'English',
    groupType: 'Hosting',
    availability: 'Playing now',
    playersNeeded: 2,
    microphone: 'Optional',
    experience: 'New',
    goal: 'Early puzzles and Red Tower',
    message: 'First session, happy to explore slowly.',
    joinCode: 'PREVIEW',
    status: 'Active',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 3600000).toISOString(),
  },
  {
    id: 'sample-2',
    displayName: 'Nori',
    platform: 'PS5',
    region: 'Asia',
    language: 'English',
    groupType: 'Looking to join',
    availability: 'Today',
    playersNeeded: 1,
    microphone: 'Required',
    experience: 'Some progress',
    goal: 'Purple puzzles',
    message: 'Looking for a relaxed completion run.',
    joinCode: '',
    status: 'Active',
    createdAt: new Date(Date.now() - 26 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 3600000).toISOString(),
  },
]

const communityLeads = [
  {
    title: 'English group at Yellow Tower',
    detail:
      'An active 4+ world was looking for more voice-chat players while progressing Yellow Tower.',
    tags: ['4+ world', 'Yellow Tower', 'English voice'],
    source:
      'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  },
  {
    title: 'Fresh North America group',
    detail: 'A host was starting a new 4+ world for respectful English-speaking adult players.',
    tags: ['North America', 'Fresh save', '18+'],
    source:
      'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  },
  {
    title: 'Fourth player for Blue Tower',
    detail:
      'A small late-night group needed one more person for puzzles beginning around Blue Tower.',
    tags: ['One needed', 'Blue Tower', 'Late night'],
    source:
      'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  },
  {
    title: 'Second-playthrough puzzle group',
    detail: 'An experienced host started again at Red Tower and welcomed relaxed adult puzzlers.',
    tags: ['Red Tower', 'Second run', '18+'],
    source:
      'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  },
  {
    title: 'New player looking for a 4+ group',
    detail:
      'A first-time adult player wanted a larger group after discovering the game through a video.',
    tags: ['New player', '4+ world', '18+'],
    source:
      'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  },
  {
    title: 'Replay for missed puzzles',
    detail:
      'A returning player wanted to revisit the island and complete puzzles they missed the first time.',
    tags: ['Replay', 'Missed puzzles', 'Completion'],
    source:
      'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  },
]

const fieldClass =
  'mt-1 w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#1f6b5b] focus:ring-[#1f6b5b] dark:border-slate-700 dark:bg-slate-900'

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`
}

export default function FindPlayersBoard() {
  const [posts, setPosts] = useState<PublicLfgPost[]>([])
  const [configured, setConfigured] = useState(true)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [platform, setPlatform] = useState('Any')
  const [region, setRegion] = useState('Any')
  const [mic, setMic] = useState('Any')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [revealed, setRevealed] = useState<string[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/lfg', { cache: 'no-store' })
      const data = await response.json()
      setConfigured(data.configured !== false)
      setPosts(data.configured === false ? samplePosts : data.posts || [])
    } catch {
      setConfigured(false)
      setPosts(samplePosts)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(
    () =>
      posts.filter(
        (post) =>
          (platform === 'Any' || post.platform === platform) &&
          (region === 'Any' || post.region === region) &&
          (mic === 'Any' || post.microphone === mic)
      ),
    [posts, platform, region, mic]
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries()) as Record<string, unknown>
    payload.turnstileToken = turnstileToken
    try {
      const response = await fetch('/api/lfg', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to publish.')
      const manageUrl = `/find-players/manage/${data.post.id}/${data.manageToken}`
      localStorage.setItem(`bw-manage-${data.post.id}`, data.manageToken)
      setMessage(`Published. Save this management link: ${location.origin}${manageUrl}`)
      await load()
      event.currentTarget.reset()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to publish.')
    } finally {
      setSubmitting(false)
    }
  }

  async function report(id: string) {
    if (id.startsWith('sample-') || !confirm('Report this listing as invalid or expired?')) return
    await fetch(`/api/lfg/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reason: 'Invalid or expired code' }),
    })
    setMessage('Report received. Thank you.')
  }

  return (
    <div>
      {!configured && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Preview mode: these are example listings. Live posting opens as soon as the production
          database is connected.
        </div>
      )}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end dark:border-slate-800 dark:bg-slate-900">
        {[
          ['Platform', platform, setPlatform, ['Any', 'PC', 'PS5', 'Switch 2']],
          ['Region', region, setRegion, ['Any', 'Americas', 'Europe', 'Asia', 'Oceania']],
          ['Microphone', mic, setMic, ['Any', 'Required', 'Optional', 'No mic']],
        ].map(([label, value, setter, options]) => (
          <label
            key={label as string}
            className="min-w-0 flex-1 text-xs font-bold tracking-wider text-slate-500 uppercase"
          >
            {label as string}
            <select
              value={value as string}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              className={fieldClass}
            >
              {(options as string[]).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        ))}
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f5c24d] px-5 py-3 font-bold text-[#153f38] transition hover:bg-[#ffd66c]"
        >
          <Plus size={18} /> Post a group
        </button>
      </div>

      <section className="mt-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#1f6b5b] uppercase">
              Fresh community leads
            </p>
            <h2 className="mt-1 text-2xl font-black">Recent public LFG examples</h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-right">
            Curated from the August 13 community thread and paraphrased for privacy. Open the source
            to find current replies; we do not copy usernames, private details or expiring codes.
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {communityLeads.map((lead) => (
            <a
              key={lead.title}
              href={lead.source}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-emerald-900/10 bg-[#e4efe5] p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-emerald-950/40"
            >
              <h3 className="font-black group-hover:text-[#1f6b5b]">{lead.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {lead.detail}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-900/80 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1f6b5b]">
                View original request <ExternalLink size={13} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Filter size={16} /> {filtered.length} active groups
        </div>
        <button
          type="button"
          onClick={load}
          className="grid h-11 w-11 place-items-center rounded-full text-slate-500 transition hover:bg-white dark:hover:bg-slate-800"
          aria-label="Refresh"
        >
          <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {filtered.map((post) => {
          const isRevealed = revealed.includes(post.id)
          return (
            <article
              key={post.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      {post.availability}
                    </span>
                    <span className="text-xs text-slate-400">{relativeTime(post.createdAt)}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-black break-words">
                    {post.displayName} · {post.platform} · {post.region}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => report(post.id)}
                  className="p-2 text-slate-400 hover:text-red-600"
                  aria-label="Report listing"
                >
                  <Flag size={16} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">
                  {post.language}
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">
                  <Mic size={12} className="mr-1 inline" />
                  {post.microphone}
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">
                  <Users size={12} className="mr-1 inline" />
                  Needs {post.playersNeeded}
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">
                  {post.experience}
                </span>
              </div>
              <p className="mt-4 font-bold break-words text-[#1f6b5b] dark:text-emerald-300">
                {post.goal}
              </p>
              {post.message && (
                <p className="mt-1 text-sm leading-6 break-words text-slate-500 dark:text-slate-400">
                  {post.message}
                </p>
              )}
              <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock3 size={14} /> Expires{' '}
                  {new Date(post.expiresAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {post.joinCode && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (isRevealed) await navigator.clipboard.writeText(post.joinCode)
                      else setRevealed([...revealed, post.id])
                    }}
                    className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg bg-[#153f38] px-3 py-2 text-xs font-bold text-white"
                  >
                    {isRevealed ? (
                      <>
                        <Copy size={14} />
                        {post.joinCode}
                      </>
                    ) : (
                      'Reveal Join Code'
                    )}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      {!loading && filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No matching groups right now. Post one or try a broader filter.
        </div>
      )}

      <Dialog open={formOpen} onClose={setFormOpen} className="relative z-[250]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition duration-200 data-closed:opacity-0"
        />
        <div className="fixed inset-0 overflow-y-auto p-3 sm:p-6">
          <DialogPanel
            transition
            className="mx-auto w-full max-w-2xl rounded-3xl bg-[#f7f4ea] shadow-2xl transition duration-200 data-closed:translate-y-3 data-closed:opacity-0 dark:bg-slate-950"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-slate-200 bg-[#f7f4ea]/95 px-5 py-5 shadow-sm backdrop-blur sm:px-8 dark:border-slate-800 dark:bg-slate-950/95">
              <div>
                <DialogTitle className="text-2xl font-black">Post a group</DialogTitle>
                <p className="mt-1 text-sm text-slate-500">
                  No account required. Posts expire automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white dark:hover:bg-slate-800"
                aria-label="Close post form"
              >
                <X />
              </button>
            </div>
            <form onSubmit={submit} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
              <label className="text-sm font-bold">
                Display name
                <input
                  name="displayName"
                  required
                  minLength={2}
                  maxLength={24}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-bold">
                Platform
                <select name="platform" className={fieldClass}>
                  {['PC', 'PS5', 'Switch 2'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Region
                <select name="region" className={fieldClass}>
                  {['Americas', 'Europe', 'Asia', 'Oceania'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Language
                <input name="language" required defaultValue="English" className={fieldClass} />
              </label>
              <label className="text-sm font-bold">
                Group type
                <select name="groupType" className={fieldClass}>
                  {['Hosting', 'Looking to join', 'Either'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Availability
                <select name="availability" className={fieldClass}>
                  {['Playing now', 'Today', 'Later'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Players needed
                <select name="playersNeeded" className={fieldClass}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Microphone
                <select name="microphone" className={fieldClass}>
                  {['Required', 'Optional', 'No mic'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Experience
                <select name="experience" className={fieldClass}>
                  {['New', 'Some progress', 'Experienced'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Post lifetime
                <select name="lifetime" defaultValue="6" className={fieldClass}>
                  <option value="2">2 hours</option>
                  <option value="6">6 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Goal
                <input
                  name="goal"
                  required
                  maxLength={80}
                  placeholder="Explore, Red Tower, purple puzzles…"
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-bold">
                Join Code <span className="font-normal text-slate-400">(required for hosts)</span>
                <input name="joinCode" maxLength={24} className={fieldClass} />
              </label>
              <label className="text-sm font-bold">
                Short message
                <input name="message" maxLength={160} className={fieldClass} />
              </label>
              <div className="sm:col-span-2">
                <TurnstileWidget onToken={setTurnstileToken} />
              </div>
              {message && (
                <div
                  className={`rounded-xl p-3 text-sm break-words sm:col-span-2 ${message.startsWith('Published') ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}
                >
                  {message}
                </div>
              )}
              <label className="flex gap-2 text-xs leading-5 text-slate-500 sm:col-span-2">
                <input type="checkbox" required className="mt-1 rounded" />I will not share personal
                information, links or abusive content.
              </label>
              <button
                disabled={submitting || !configured}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#153f38] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
              >
                {submitting ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Check size={18} />
                )}{' '}
                Publish group
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
