export const guideCategories = [
  {
    slug: 'beginner',
    label: 'Beginner',
    description: 'How the game works, what to do first and spoiler-light starting routes.',
    image: '/static/images/big-walk/official-03.jpg',
  },
  {
    slug: 'progression',
    label: 'Progression',
    description: 'Tower order, nubbins, endings and what to do after each milestone.',
    image: '/static/images/big-walk/official-06.jpg',
  },
  {
    slug: 'towers',
    label: 'Tower',
    description: 'Red, Blue, Green, Yellow and Black tower walkthroughs.',
    image: '/static/images/big-walk/official-05.jpg',
  },
  {
    slug: 'multiplayer',
    label: 'Multiplayer',
    description: 'Player counts, crossplay, Join Codes, world sizes and hosting.',
    image: '/static/images/big-walk/official-01.jpg',
  },
  {
    slug: 'find-players',
    label: 'LFG',
    description: 'Find compatible groups and write listings that get useful replies.',
    image: '/static/images/big-walk/official-02.jpg',
  },
  {
    slug: 'locations',
    label: 'Location',
    description: 'Map Room, tower, transport, tool and landmark locations.',
    image: '/static/images/big-walk/official-04.jpg',
  },
  {
    slug: 'items',
    label: 'Item',
    description: 'Every tool, where it appears and what it is actually useful for.',
    image: '/static/images/big-walk/official-07.jpg',
  },
  {
    slug: 'achievements',
    label: 'Achievement',
    description: 'Steam achievements, PS5 trophies and an efficient 100% route.',
    image: '/static/images/big-walk/official-08.jpg',
  },
  {
    slug: 'technical-help',
    label: 'Technical Help',
    description: 'Connection, microphone, save, controller and performance fixes.',
    image: '/static/images/big-walk/official-04.jpg',
  },
] as const

export function getCategorySlug(label?: string) {
  return guideCategories.find((category) => category.label === label)?.slug
}
