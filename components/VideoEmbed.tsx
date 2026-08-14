type VideoEmbedProps = {
  id: string
  title: string
  caption?: string
}

export default function VideoEmbed({ id, title, caption }: VideoEmbedProps) {
  return (
    <figure className="not-prose my-8">
      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950 shadow-lg">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
