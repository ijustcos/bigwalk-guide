import fs from 'node:fs'
import path from 'node:path'

const contentRoot = path.join(process.cwd(), 'data', 'blog')
const bannedPhrases = [
  'A direct, source-checked',
  'Read the quick answer before changing settings or leaving the area',
  'Big Walk players exploring and solving challenges together',
]

function findMdxFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory()
      ? findMdxFiles(fullPath)
      : entry.name.endsWith('.mdx')
        ? [fullPath]
        : []
  })
}

function frontmatterValue(frontmatter, field) {
  return frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1]?.trim()
}

const files = findMdxFiles(contentRoot)
const errors = []
const warnings = []
const summaries = new Map()

for (const file of files) {
  const relative = path.relative(process.cwd(), file)
  const source = fs.readFileSync(file, 'utf8')
  const parsed = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  const frontmatter = parsed?.[1] || ''
  const body = parsed?.[2] || source
  const words = body.match(/[A-Za-z0-9][A-Za-z0-9'/-]*/g)?.length || 0
  const route = `/${path
    .relative(contentRoot, file)
    .replace(/\\.mdx$/, '')
    .split(path.sep)
    .join('/')}`

  for (const field of ['title', 'summary', 'category', 'quickAnswer', 'lastmod']) {
    if (!frontmatterValue(frontmatter, field)) errors.push(`${relative}: missing ${field}`)
  }

  if (!body.includes('## Sources checked'))
    errors.push(`${relative}: missing Sources checked section`)
  if (!/<GameImage\b/.test(body)) errors.push(`${relative}: missing a contextual game image`)
  const heroImage = frontmatter.match(/^images:\s*\[['"]([^'"]+)/m)?.[1]
  const firstBodyImage = body.match(/<GameImage[\s\S]*?src="([^"]+)"/)?.[1]
  if (heroImage && heroImage === firstBodyImage) {
    errors.push(`${relative}: repeats the hero image as the first body image`)
  }
  if (body.includes(`](${route})`)) errors.push(`${relative}: contains a self-link to ${route}`)
  if (words < 160) errors.push(`${relative}: only ${words} English words`)
  else if (words < 250) warnings.push(`${relative}: thin page at ${words} English words`)

  for (const phrase of bannedPhrases) {
    if (source.includes(phrase))
      errors.push(`${relative}: contains banned template phrase "${phrase}"`)
  }

  const summary = frontmatterValue(frontmatter, 'summary')
  if (summary) {
    const normalizedSummary = summary.replace(/^['"]|['"]$/g, '')
    if (normalizedSummary.length < 85 || normalizedSummary.length > 190) {
      errors.push(
        `${relative}: summary length ${normalizedSummary.length} is outside the 85–190 character target`
      )
    }
    const previous = summaries.get(summary)
    if (previous) errors.push(`${relative}: duplicates summary from ${previous}`)
    else summaries.set(summary, relative)
  }
}

console.log(
  `Content audit: ${files.length} articles, ${errors.length} errors, ${warnings.length} warnings`
)
for (const warning of warnings) console.log(`WARN ${warning}`)
for (const error of errors) console.error(`ERROR ${error}`)

if (errors.length) process.exitCode = 1
