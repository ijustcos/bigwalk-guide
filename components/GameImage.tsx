import NextImage from 'next/image'

type GameImageProps = {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

export default function GameImage({ src, alt, caption, priority = false }: GameImageProps) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
        <NextImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>
      <figcaption className="flex flex-col gap-1 px-4 py-3 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <span>{caption || alt}</span>
        <a
          href="https://bigwalk.game/presskit/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-semibold text-[#1f6b5b] hover:underline dark:text-emerald-400"
        >
          Official screenshot © House House / Panic
        </a>
      </figcaption>
    </figure>
  )
}
