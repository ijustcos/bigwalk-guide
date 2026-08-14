import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const date = '2026-08-15'
const images = Array.from(
  { length: 8 },
  (_, index) => `/static/images/big-walk/official-0${index + 1}.jpg`
)

const imageDescriptions = {
  '/static/images/big-walk/official-01.jpg':
    'four players carrying radios, a megaphone, a backpack and other communication tools',
  '/static/images/big-walk/official-02.jpg':
    'players stacking and gesturing together on the beach at sunset',
  '/static/images/big-walk/official-03.jpg':
    'a group navigating by landmarks with binoculars and a walkie-talkie',
  '/static/images/big-walk/official-04.jpg':
    'a group using a lantern to stay together in the island at night',
  '/static/images/big-walk/official-05.jpg':
    'players approaching a raised green structure in the forest',
  '/static/images/big-walk/official-06.jpg': 'players waiting beside a train platform at sunset',
  '/static/images/big-walk/official-07.jpg':
    'players stacking beneath a yellow crane to reach a high interaction',
  '/static/images/big-walk/official-08.jpg':
    'players communicating through glass while arranging picture symbols',
}

function imageForPage(page, index) {
  const search = `${page.slug} ${page.title} ${page.category}`.toLowerCase()
  if (/symbol|charades|sound|speaker|headphone|locked-room|button-room/.test(search)) {
    return '/static/images/big-walk/official-08.jpg'
  }
  if (/crane|head-stack|stacking|climb/.test(search)) {
    return '/static/images/big-walk/official-07.jpg'
  }
  if (/train|station|big-ride/.test(search)) {
    return '/static/images/big-walk/official-06.jpg'
  }
  if (/green|chairlift|scaffolding/.test(search)) {
    return '/static/images/big-walk/official-05.jpg'
  }
  if (/lantern|night|light|flare|torch/.test(search)) {
    return '/static/images/big-walk/official-04.jpg'
  }
  if (/map|gps|compass|binocular|location|tower/.test(search)) {
    return '/static/images/big-walk/official-03.jpg'
  }
  if (/beach|tutorial|drawbridge|beginner|sunset/.test(search)) {
    return '/static/images/big-walk/official-02.jpg'
  }
  if (/multiplayer|radio|megaphone|walkie|backpack|item|tool/.test(search)) {
    return '/static/images/big-walk/official-01.jpg'
  }
  if (page.category === 'Technical Help' || page.category === 'LFG') {
    return '/static/images/big-walk/official-01.jpg'
  }
  return images[index % images.length]
}

function imageCaption(page, image) {
  const prefix = `Official Big Walk screenshot showing ${imageDescriptions[image]}.`
  if (page.category === 'Puzzle') {
    return `${prefix} Use the identifying features and coordinates in this guide to confirm the exact puzzle.`
  }
  if (page.category === 'Location' || page.category === 'Tower') {
    return `${prefix} Pair the visual landmarks with the written route and coordinates below.`
  }
  if (page.category === 'Technical Help') {
    return `${prefix} This is gameplay context; menu names and troubleshooting steps are written below.`
  }
  return `${prefix} The guide below explains the relevant route, item or multiplayer behavior.`
}

function conciseSummary(answer) {
  if (answer.length <= 180) return answer
  const firstSentence = answer.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()
  if (firstSentence && firstSentence.length >= 60 && firstSentence.length <= 180) {
    return firstSentence
  }
  return `${answer.slice(0, 177).trimEnd()}...`
}

const extraSections = {
  'join-code-not-working': `## Check the error in this order

1. **Nothing happens:** confirm the host has pressed Start and loaded their character into the world.
2. **The code is rejected:** ask for the current code from Session Details; codes change when a host restarts.
3. **Connection times out:** compare the first two version numbers and set every device clock to automatic.
4. **Only cross-platform players fail:** confirm Crossplay is On in Big Walk settings on each system.

If a fresh session still fails, record the host platform, joining platform, full error text and both version numbers before contacting support.`,
  'crossplay-not-working': `## Supported combinations

Windows, Mac, PlayStation 5 and Nintendo Switch 2 can share the same session. Xbox is not currently supported. Cross-platform players should use a Join Code because platform friend lists do not span every system.

## Launch-week failure patterns

Current player reports repeatedly point to three causes: the host never entered the world, Switch 2 was on a different minor version, or a console clock was not synchronized. These reports support the troubleshooting order above; the official FAQ remains the authority for supported platforms and version matching.`,
  'switch2-connection': `## Switch 2 checks that matter most

- Open System Settings and synchronize date, time and timezone automatically.
- Confirm Crossplay is On inside Big Walk.
- Compare the first two game-version numbers with the host.
- Let the host enter the world before typing the Join Code.

If another Switch 2 can join the same host but yours cannot, include the console system version and exact Big Walk version in a support report.`,
  'local-coop-split-screen': `## Can two people play from the same home?

Yes, but each person needs a supported system and copy of the game. House House recommends separate rooms so players cannot hear unrestricted speech or see information on the other screen. Use the built-in voice or text chat so walls, distance and communication tools continue to affect puzzles.

## What will not work

Connecting a second controller does not create a second player. PlayStation Portal remote play also does not turn one copy into split screen; two simultaneous players still need separate accounts, devices and access to the game.`,
  'best-group-size': `## Pick by the group you can actually keep together

| Returning players | Recommended world | What to expect |
| --- | --- | --- |
| 2 | 2-player | Focused roles and easiest scheduling |
| 3 | 3-player | More communication chains without a crowded lobby |
| 4 or more | 4+ | More simultaneous roles and more regrouping |

The world setting changes challenge requirements; it does not cap the lobby. A 2-player world can still accept additional friends up to the 12-player session limit.`,
  'find-discord-and-lfg': `## Information that gets useful replies

- Region and timezone
- Platform and whether crossplay is acceptable
- Language and microphone or text-chat preference
- New game, current tower or 100% cleanup
- Minimum age or calm/chaotic play preference
- The next two-hour window when you can actually play

Do not post a permanent account login, phone number or reusable password. A Big Walk Join Code is temporary, but it is still safer to share it only when the group is ready.`,
  'what-to-do-after-tutorial': `## The four opening challenges

- **Yellow crane:** stack players so the upper player can press the button underneath.
- **Spyglass and red light:** one player holds the nearby control while another follows the indicated direction.
- **Blue symbol house:** the inside player describes symbols for the outside player to arrange.
- **Green scaffolding:** players coordinate the separated buttons within the timing window.

Return every red piece before shaping the key. Solving a mechanism does not count if its physical reward is still lying at the puzzle.`,
  'what-to-do-after-red-tower': `## Choose the next objective by what your group needs

- **Need faster travel:** work toward Blue Tower and the trains.
- **Need access to high routes:** work toward Green Tower and the chairlift.
- **Still getting lost:** stay in the Map Room long enough to understand flags, loose rewards and submitted rewards.
- **Cleaning up puzzles:** take the portable map, a compass and walkie-talkies before splitting up.

There is no mandatory colored-tower order after the opening route.`,
  'map-room-location': `## How to recognize the correct building

The Map Room is the large blue building near the starting hub and the bottom of the long red stairs. Its color causes confusion: Blue Tower does not open it. The completed Red Tower key does.

Inside you will find the large progress map, a portable folding map, a compass and laser pointers. The large map is also the fastest way to identify rewards that were solved but never submitted.`,
}

const urls = {
  faq: 'https://bigwalk.game/faq/',
  press: 'https://bigwalk.game/presskit/',
  lfg: 'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
  items: 'https://www.screenhype.co.uk/all-items-how-to-use-them-in-big-walk/',
  beach: 'https://www.screenhype.co.uk/how-to-unlock-the-crosswalk-in-big-walk/',
  red: 'https://www.screenhype.co.uk/how-to-unlock-the-map-room-in-big-walk/',
  blue: 'https://www.screenhype.co.uk/how-to-unlock-the-trains-in-big-walk/',
  green: 'https://www.screenhype.co.uk/how-to-unlock-the-chairlift-in-big-walk/',
  yellow: 'https://www.screenhype.co.uk/how-to-unlock-the-tunnels-in-big-walk/',
  trophies: 'https://www.playstationtrophies.org/game/big-walk/print-list/',
  voice:
    'https://www.pcgamer.com/games/puzzle/big-walk-patch-addresses-voice-volume-complaints-with-restraint-we-consider-it-an-important-part-of-the-games-design-that-you-can-only-hear-players-who-are-close-to-you/',
  number: 'https://www.pcgamer.com/games/puzzle/big-walk-number-puzzle-4166-1899/',
  crossplay: 'https://www.reddit.com/r/BigWalk/comments/1vhairy/crossplay_does_not_work/',
  localCoop:
    'https://www.reddit.com/r/gaming/comments/1vkoru0/were_house_house_we_made_untitled_goose_game_and/',
}

function yaml(value) {
  return JSON.stringify(value)
}

function sourceLines(sources) {
  const seen = new Set()
  return sources
    .filter(([, href]) => {
      if (seen.has(href)) return false
      seen.add(href)
      return true
    })
    .map(([label, href, note]) => `- [${label}](${href}) — ${note}`)
    .join('\n')
}

function writePage(page, index) {
  const directory = path.join(root, 'data', 'blog', page.section)
  fs.mkdirSync(directory, { recursive: true })
  const image = imageForPage(page, index)
  const inlineImage = image
  const aliases = page.aliases || []
  const tags = page.tags || [page.category.toLowerCase(), 'big-walk']
  const steps = (page.steps || []).map((step, stepIndex) => `${stepIndex + 1}. ${step}`).join('\n')
  const checklist = (page.checklist || []).map((item) => `- ${item}`).join('\n')
  const related = (page.related || []).map(([label, href]) => `- [${label}](${href})`).join('\n')
  const isPuzzle = page.category === 'Puzzle'
  const answerSection = isPuzzle
    ? `## How to identify it

This guide covers **${aliases[0] || page.title}** at **${page.location}**. Confirm the visible objects and coordinates before opening a hint; Big Walk does not display official puzzle names.

## Hint ladder

<Spoiler label="Show a light hint">
  ${page.hints?.[0] || page.context}
</Spoiler>

<Spoiler label="Show a stronger hint">
  ${page.hints?.[1] || page.steps?.[1] || 'Assign each player a position and agree on one short signal before activating the puzzle.'}
</Spoiler>

## Quick solution

<Spoiler label="Reveal the quick solution">
  ${page.answer}
</Spoiler>`
    : `## The useful answer

${page.answer}`
  const stepsSection = isPuzzle
    ? `## Complete step-by-step solution

<Spoiler label="Reveal every step">

${steps}

</Spoiler>`
    : `## Step by step

${steps}`
  const contextSection = isPuzzle
    ? ''
    : `## Why players get stuck here

${page.context}

${extraSections[page.slug] ? `${extraSections[page.slug]}\n\n` : ''}`
  const supportNote =
    page.supportNote ||
    {
      'Technical Help':
        'Change one variable at a time, then retest from a fresh session. That makes it clear which fix worked and avoids turning a connection, audio or input problem into several overlapping problems.',
      Multiplayer:
        'Before inviting everyone, agree on the host, world size, voice or text preference and the next session time. Those four details prevent most groups from losing progress or creating a world they cannot continue.',
      LFG: 'Never publish a permanent friend code, account login or other private detail. Share only the information needed to judge compatibility, then exchange the temporary Join Code when the group is ready.',
      Location:
        'Use a fixed landmark and one set of coordinates when giving directions. If the group splits, leave one player at the landmark while the others search so everyone has a reliable point to return to.',
      Progression:
        'Before leaving the area, confirm that the reward or key has actually registered with its receiver. Big Walk often represents progress with physical objects, so solving the interaction and banking the result are separate steps.',
      Tower:
        'Keep the tower reward with one named carrier and regroup before travelling. If the session ends, let the original host reload and verify the tower state before repeating every nearby puzzle.',
      Beginner:
        'When the game gives no marker, pick one visible landmark, describe what each player can see and test a single idea together. That communication loop is the intended navigation system, not a sign that the group missed a quest prompt.',
      Item: 'Test the item near the place where you found it, then note whether it changes with distance, sound, light or another player. Many tools are communication aids rather than keys that directly unlock one door.',
      Achievement:
        'Wait for the platform notification before marking the requirement complete. If it does not appear, keep the same host, reload the saved world and repeat only the final trigger instead of restarting the whole route.',
      Puzzle:
        'After the reward appears, choose one carrier and take it to the correct receiver before the group disperses. A solved mechanism and a banked progression item are not always the same thing.',
    }[page.category]
  const body = `---
title: ${yaml(page.title)}
date: '${date}'
lastmod: '${date}'
summary: ${yaml(page.summary)}
category: ${yaml(page.category)}
aliases: ${yaml(aliases)}
players: ${yaml(page.players || '2–12 players')}
location: ${yaml(page.location || 'Big Walk island')}
quickAnswer: ${yaml(page.answer)}
tags: ${yaml(tags)}
images: [${yaml(image)}]
layout: GuideLayout
---

${answerSection}

<GameImage
  src="${inlineImage}"
  alt="Official Big Walk screenshot showing ${imageDescriptions[inlineImage]}"
  caption="${imageCaption(page, inlineImage)}"
/>

${stepsSection}

${contextSection}
${checklist ? `## Quick checklist\n\n${checklist}\n\n` : ''}
## Verify it before moving on

${supportNote}

${page.spoiler && !isPuzzle ? `## Full solution\n\n<Spoiler label="Reveal the complete solution">\n  ${page.spoiler}\n</Spoiler>\n\n` : ''}## Related Big Walk help

${related}

## Sources checked

${sourceLines(page.sources)}
`
  fs.writeFileSync(path.join(directory, `${page.slug}.mdx`), body)
}

const puzzleGroups = {
  beach: {
    label: 'Beach opening area',
    source: [
      'Screen Hype opening puzzle route',
      urls.beach,
      'coordinates and puzzle-state cross-check',
    ],
  },
  red: {
    label: 'Near Red Tower',
    source: ['Screen Hype Red Tower route', urls.red, 'coordinates and puzzle-state cross-check'],
  },
  blue: {
    label: 'Near Blue Tower',
    source: ['Screen Hype Blue Tower route', urls.blue, 'coordinates and puzzle-state cross-check'],
  },
  green: {
    label: 'Near Green Tower',
    source: [
      'Screen Hype Green Tower route',
      urls.green,
      'coordinates and puzzle-state cross-check',
    ],
  },
  yellow: {
    label: 'Near Yellow Tower',
    source: [
      'Screen Hype Yellow Tower route',
      urls.yellow,
      'coordinates and puzzle-state cross-check',
    ],
  },
}

const puzzles = [
  [
    'yellow-crane-head-stack-puzzle',
    'Big Walk Yellow Crane Puzzle Solution',
    'beach',
    '35.20, 12.80',
    'a yellow crane with a red button underneath',
    'Stack one player on another player’s head, walk under the crane and have the upper player press the underside button. The reward drops from the crane.',
    'Approach from level ground and make the upper player do the interaction; kicking the crane does nothing.',
  ],
  [
    'spyglass-red-light-puzzle',
    'Big Walk Spyglass and Red Light Puzzle',
    'beach',
    '3510, 1195',
    'a telescope beside a red hold button',
    'Leave one player holding the button while the other follows the red beacon in the telescope’s direction to the glass reward case.',
    'If everyone leaves the platform, the case closes before the runner arrives.',
  ],
  [
    'blue-house-symbol-puzzle',
    'Big Walk Blue House Symbol Puzzle',
    'beach',
    '3660, 1295',
    'a blue house, five screens and nine wooden symbols',
    'Lock one player inside. They read the five symbols from left to right while the outside player places matching wooden pieces in that order, then checks the answer.',
    'Do not drop a piece while showing it through the window; the useful face can land downward.',
  ],
  [
    'green-scaffolding-buttons-puzzle',
    'Big Walk Green Scaffolding Button Puzzle',
    'beach',
    '3650, 1220',
    'green scaffolding with a button on each side',
    'Put one player at each button. Press the first, signal immediately, then press the second inside the short timing window.',
    'Agree on one visible signal before starting; latency and long voice calls make the timing harder.',
  ],
  [
    'silent-room-pointing-puzzle',
    'Big Walk Silent Room Pointing Puzzle',
    'red',
    '3760, 1430',
    'a glass room, a semicircle of stones and five outside buttons',
    'The locked-in player points toward the outside button matching the lit stone. The outside player presses it; repeat until the progress display fills.',
    'Use large, deliberate turns and pointing gestures because speech does not pass through the room.',
  ],
  [
    'beach-maze-timer-puzzle',
    'Big Walk Beach Maze Timer Puzzle',
    'red',
    '3840, 1350',
    'two separated maze lanes and a tomato-shaped timer',
    'Split up, reach the communication window, pass the timer across, then place it in the holder on the opposite route before it expires.',
    'Position both players before picking up the timer so its countdown is not wasted.',
  ],
  [
    'heavy-ball-pass-puzzle',
    'Big Walk Heavy Ball Pass Puzzle',
    'red',
    '3740, 1620',
    'a heavy ball that freezes the carrier in place',
    'Stand in front of the carrier and take the ball, then alternate handoffs until the ball reaches the upper goal platform.',
    'The carrier cannot walk. Move the receiving player first, then transfer the ball.',
  ],
  [
    'basketball-lantern-hoop-puzzle',
    'Big Walk Basketball Hoop Puzzle',
    'red',
    '3830, 1560',
    'a hoop and a score meter in the forest',
    'Throw lanterns through the hoop until the meter fills. Two players can shoot in turn and retrieve misses faster.',
    'Use the same release angle and stand close enough that the lantern travels on a stable arc.',
  ],
  [
    'cannonball-timer-puzzle',
    'Big Walk Cannonball Timer Puzzle',
    'red',
    '3880, 1520',
    'a launcher, a field and a green timer holder',
    'Station one player in the field, fire the tomato timer, throw it back to the platform player and insert it into the green holder.',
    'The field player should be ready before the launch; starting together wastes most of the timer.',
  ],
  [
    'turnstile-house-symbol-puzzle',
    'Big Walk Turnstile House Symbol Puzzle',
    'blue',
    '3505, 1960',
    'a red house with paired yellow turnstiles',
    'Enter separate sides. The right player describes five symbols; the left player places matching pieces in order and presses the check button.',
    'Pick up dropped gear after leaving the turnstiles and use the rear canvas gap or radios if the wall blocks speech.',
  ],
  [
    'five-minute-locked-room-puzzle',
    'Big Walk Five-Minute Locked Room Puzzle',
    'blue',
    '3590, 2020',
    'a red house with a large black countdown',
    'Get the whole group inside, hold the required buttons to lock the room, then remain inside until the five-minute timer finishes.',
    'Leaving or failing to activate every scaled button interrupts the simple but intentionally patient challenge.',
  ],
  [
    'leapfrog-obstacle-course-puzzle',
    'Big Walk Leapfrog Obstacle Course Puzzle',
    'blue',
    '3700, 1950',
    'walls, block stairs, red planks and a timer throw',
    'Stack to clear the first wall, hold the door, leapfrog up the steps, crouch under the low wall, synchronize switches and throw the timer to the final holder.',
    'Send one player ahead of the final throw so the receiver is already beside the holder.',
  ],
  [
    'blindfold-obstacle-course-puzzle',
    'Big Walk Blindfolded Golden Head Puzzle',
    'blue',
    '3360, 1930',
    'a golden head beside an obstacle course',
    'One player wears the golden head and enters with blurred sight. A guide outside moves along the wall and gives short instructions until the wearer reaches the final red button.',
    'Use “forward, stop, right, jump, crouch” instead of angles or long sentences.',
  ],
  [
    'charades-locked-room-puzzle',
    'Big Walk Charades Pose Puzzle',
    'blue',
    '3250, 1940',
    'a locked room with action poses instead of symbols',
    'The inside player performs each of the five displayed actions at the window. The outside player places the matching pose pieces in order.',
    'Stand squarely at the glass and hold each pose long enough to distinguish similar arm positions.',
  ],
  [
    'lightbulb-speaker-locked-room-puzzle',
    'Big Walk Lightbulb and Speaker Room Puzzle',
    'green',
    '3825, 1930',
    'two locked rooms with incomplete displays',
    'Each player can see the symbols missing from the other display. Use the tannoy in one room and counted red-light flashes in the other to exchange piece numbers.',
    'Number the nine pieces before locking in; one flash system is far clearer than inventing descriptions mid-puzzle.',
  ],
  [
    'coastal-crane-two-switch-puzzle',
    'Big Walk Coastal Crane Two-Switch Puzzle',
    'green',
    '3790, 2250',
    'a huge coastal crane and two distant switches',
    'Put one player at the north switch and one at the south switch, then press them almost together after a visible signal.',
    'A raised lantern is easier to see than a small arm wave, especially at night.',
  ],
  [
    'invisible-ink-memory-puzzle',
    'Big Walk Invisible Ink Memory Puzzle',
    'green',
    '3740, 2140',
    'nine blank-looking pieces viewed through a fixed lens',
    'Inside, hold every piece under the lens and create a memorable order. Take the pieces outside, activate the changing target and place the five requested symbols.',
    'Sort pieces beside matching landmarks before activating; the target changes between attempts.',
  ],
  [
    'minesweeper-lamps-puzzle',
    'Big Walk Minesweeper Lamp Puzzle',
    'green',
    '4020, 1870',
    'a blue arena filled with yellow lamps',
    'Test lamps, remember which reveal red stars, and on a fresh attempt press only the green-safe lamps. The red positions remain fixed.',
    'Drop lanterns or spare objects beside dangerous lamps so the team does not repeat a known bad press.',
  ],
  [
    'head-count-puzzle',
    'Big Walk Head Count Puzzle',
    'green',
    '4100, 1880',
    'ten striped lamps and a blue number counter',
    'Divide the lamps between players, activate the sequence, count every black head you see, add the totals and enter the combined number.',
    'Call out lamp colors before starting so nobody counts the same viewing lane twice.',
  ],
  [
    'colored-piece-egg-hunt-puzzle',
    'Big Walk 36-Piece Egg Hunt Puzzle',
    'yellow',
    '3370, 1490',
    'a wheel requiring 36 colored wooden pieces',
    'Collect nine pieces of each color: yellow by trees, green near rocks, red around the main arena and blue along the rail, then place all 36 on the wheel.',
    'Do this in daylight and search the orange tunnel for the elevated green piece.',
  ],
  [
    'music-room-sound-matching-puzzle',
    'Big Walk Music Room Sound Matching Puzzle',
    'yellow',
    '3200, 1260',
    'two sets of sound booths and movable speakers',
    'The locked-in player listens to each reference sound and recreates it over the intercom. The outside player finds the matching speaker and hangs it in the correct booth.',
    'Agree on repeatable sound words such as rhythm, pitch and pulse instead of only humming louder.',
  ],
  [
    'stage-directions-lights-puzzle',
    'Big Walk Stage Directions Light Puzzle',
    'yellow',
    '3410, 1590',
    'a booth with seven lights facing a button panel',
    'Mirror the booth view before communicating: 1↔3, 2 stays 2, 4↔7 and 5↔6. The outside player presses the mirrored number.',
    'The booth player should convert the number before signaling so only one interpretation is in use.',
  ],
  [
    'aerial-chair-symbol-puzzle',
    'Big Walk Aerial Chair Symbol Puzzle',
    'yellow',
    '3570, 1600',
    'a moon-shaped chair carrying players between symbol boards',
    'Read the five-symbol order on the far platform, ferry the matching pieces across on the chair and place them beside the screen before checking.',
    'Backpacks let two players carry four pieces per trip; leave inventory slots free first.',
  ],
]

const pages = puzzles.map((puzzle) => {
  const [slug, title, group, coord, identify, solution, tip] = puzzle
  const info = puzzleGroups[group]
  return {
    section: 'puzzles',
    slug,
    title,
    category: 'Puzzle',
    summary: `Progressive, source-checked help for the Big Walk puzzle at ${coord}: how to identify it, coordinate the team and claim the reward.`,
    aliases: [identify, `${group} tower puzzle`, `${coord} puzzle`],
    location: `${info.label} — coordinates ${coord}`,
    answer: solution,
    steps: [
      `Confirm the puzzle by looking for ${identify}.`,
      'Place each player in position before activating any timer, lock or moving part.',
      solution,
      'Collect the red control-panel piece after the confetti and carry it to the tower you are progressing.',
    ],
    context: `Big Walk does not give most challenges official names. Players often search by the visible object, nearby tower or coordinates. This page uses all three so you can confirm the correct puzzle before revealing the answer. ${tip}`,
    hints: [
      tip,
      'Split the team into clear roles before starting: one side observes, holds or signals while the other side moves, places or completes the interaction.',
    ],
    checklist: [
      'At least two players are present',
      'The team has agreed on short signals',
      'Someone has a free hand or bag slot for the reward',
      tip,
    ],
    spoiler: solution,
    related: [
      ['Find every puzzle visually', '/puzzles'],
      ['Recommended tower order', '/guides/tower-order'],
      ['Find another player', '/find-players'],
    ],
    sources: [
      info.source,
      [
        'Community guide index',
        'https://www.reddit.com/r/BigWalk/comments/1vf9oe3/big_walk_guides_unlockables_map_locations_items/',
        'player names and 24-puzzle coverage cross-check',
      ],
    ],
  }
})

const items = [
  [
    'backpack-location',
    'Big Walk Backpack Locations and How to Carry More',
    'inside nine large blue basket-like buildings',
    'wear it to carry one extra item on your back',
    'Backpacks are removable by friends, so agree before taking someone else’s stored tool.',
  ],
  [
    'hip-bag-location',
    'Big Walk Hip Bag Locations and Big Help',
    'inside the same blue bag buildings as backpacks',
    'wear it to hold one item on your hip and unlock Big Help',
    'A hip bag and backpack can be used together, but puzzle pieces do not fit every carrier.',
  ],
  [
    'piece-carrier-bag',
    'Big Walk Two-Piece Carrier Bag Location',
    'under the weather balloon',
    'carry two red control-panel pieces at once',
    'This special carrier is useful for tower cleanup and is not the same as a normal backpack.',
  ],
  [
    'binoculars',
    'Big Walk Binoculars: Locations and Uses',
    'on top of control-panel towers and beside some radio points',
    'identify distant landmarks, players, lights and puzzle targets',
    'Pair binoculars with a laser pointer or radio so the observer can direct the rest of the team.',
  ],
  [
    'cowbell',
    'Big Walk Cowbell Location and What It Does',
    'in the tutorial area',
    'make a recognizable sound for nearby regrouping',
    'The cowbell is fun but not a replacement for radios when the group has split across the island.',
  ],
  [
    'directional-torch',
    'Big Walk Directional Torch Location and Use',
    'inside the colored control-panel towers',
    'shine a focused beam on distant or dark objects',
    'Use it to highlight a precise target; use a lantern when you need broad area light.',
  ],
  [
    'flare-points',
    'Big Walk Flare Locations and Regrouping Guide',
    'at the tutorial exit, Map Room and the tops of towers',
    'launch a fixed-location signal visible from far away',
    'Tell lost players which flare station you are using because multiple red flares can be visible.',
  ],
  [
    'flare-guns',
    'Big Walk Flare Gun Colors and Locations',
    'inside four ring-shaped structures around the map',
    'fire a colored smoke flare with a short cooldown',
    'Name the color before firing so the group follows the correct signal.',
  ],
  [
    'golden-head',
    'Big Walk Golden Head Location and Blindfold Effect',
    'outside the blindfold obstacle course near Blue Tower',
    'blind the wearer so they can enter and complete its communication challenge',
    'This is a puzzle prop, not a permanent cosmetic; keep a sighted guide outside the course.',
  ],
  [
    'golden-keys',
    'Big Walk Golden Keys and Key Cutters Explained',
    'behind tower control panels after enough red pieces are inserted',
    'unlock the drawbridge, Map Room, trains, chairlift, tunnels and late-game routes',
    'A raw key rarely fits its lock. Follow every revealed cutter arrow first.',
  ],
  [
    'gps',
    'Big Walk GPS Location and Coordinate Guide',
    'in a red square frame below Green Tower near the chairlift',
    'show exact live coordinates and solve coordinate clues',
    'Put the GPS on a teammate’s back so another player can read it while they move.',
  ],
  [
    'item-scanner',
    'Big Walk Item Scanner Location and Yellow X Marks',
    'by the flare near the tutorial area and inside control-panel towers',
    'mark interactable items with a yellow X',
    'Scan slowly from a high point; walls and terrain can hide an item even when the marker appears.',
  ],
  [
    'lantern',
    'Big Walk Lantern Locations and Best Uses',
    'in the tutorial, near points of interest and across the island',
    'create a wide amber pool of light or mark a route',
    'Lanterns are also throwable puzzle objects, so do not abandon the team’s only light after scoring a hoop.',
  ],
  [
    'laser-pointer',
    'Big Walk Laser Pointer Locations and Team Signals',
    'on tower roofs and three places in the Map Room',
    'point out a route or distant object without needing a long description',
    'Confirm the observer and target are looking from roughly the same direction.',
  ],
  [
    'megaphone',
    'Big Walk Megaphone Locations and Voice Range',
    'on yellow cube blocks near Green Tower, Yellow Tower and the Purple Tunnel',
    'amplify a voice across a very large distance',
    'It broadcasts loudly but does not replace the special logic of receivers or sealed communication rooms.',
  ],
  [
    'paintbrush-customization',
    'Big Walk Paintbrush and Character Customization',
    'at the paint-palette structure around coordinates 3570, 1190',
    'paint a friend’s head, torso and legs using palette colors',
    'You cannot paint yourself; metallic paint for Big Makeover is found much later.',
  ],
  [
    'radio-transmitters',
    'Big Walk Radio Transmitters and Receivers',
    'at tower tops, the Map Room, trains and the central mountain',
    'broadcast from a microphone to every receiver where a player is listening',
    'Hold the transmitter button while speaking; listeners only need to stand near a receiver.',
  ],
  [
    'walkie-talkies',
    'Big Walk Walkie-Talkie Locations and Long-Distance Chat',
    'below Red Tower, near the red ravine tunnel and on a central mountainside frame',
    'let separated players talk over distance and coordinate remote switches',
    'Carry them in pairs and test the channel before splitting up.',
  ],
  [
    'whiteboards',
    'Big Walk Whiteboard Locations and Persistent Messages',
    'three near the Map Room and one behind the coordinate locator',
    'leave drawn messages, plans and landmarks for the group',
    'Use simple arrows and tower colors; detailed drawings are slower to read during a puzzle.',
  ],
]

items.forEach((item, itemIndex) => {
  const [slug, title, location, use, warning] = item
  pages.push({
    section: 'items',
    slug,
    title,
    category: 'Item',
    summary: conciseSummary(`Find it ${location}. Use it to ${use}. ${warning}`),
    aliases: [`Big Walk ${slug.replaceAll('-', ' ')}`, title.replace(/^Big Walk /, '')],
    location,
    answer: `Find it ${location}. Its main use is to ${use}.`,
    steps: [
      `Go to the item location: ${location}.`,
      'Make sure one player has a free hand, back slot or hip slot before picking it up.',
      `Use it to ${use}.`,
      'Return it to a memorable landmark if your group does not want to carry it.',
    ],
    context: `Tools are physical objects in Big Walk: they can be dropped, moved, worn or left behind between destinations. ${warning} A useful item is only useful if the rest of the group knows who is carrying it.`,
    checklist: [
      'Confirm the item visually before leaving the area',
      'Choose one named carrier',
      'Tell the group where it will be returned',
      warning,
    ],
    related: [
      ['All tools overview', '/guides/all-tools'],
      ['Map and compass guide', '/guides/map-and-compass'],
      ['Find teammates', '/find-players'],
    ],
    sources: [
      ['All Items and How to Use Them', urls.items, 'location and function cross-check'],
      ['Official Big Walk press kit', urls.press, 'gameplay and tool context'],
    ],
  })
})

const achievements = [
  [
    'big-walk-achievement',
    'Big Walk Achievement: Cross the Drawbridge',
    'cross the opening drawbridge',
    'Complete the four mandatory beach challenges, shape the first key and use it at the bridge.',
  ],
  [
    'big-view-achievement',
    'Big View Achievement: Visit the Map',
    'visit the island map',
    'Complete Red Tower, shape its key and enter the Map Room.',
  ],
  [
    'big-sit-achievement',
    'Big Sit Achievement: Ride the Chairlift',
    'ride the chairlift',
    'Complete Green Tower, cut the key and activate the chairlift station.',
  ],
  [
    'big-ride-achievement',
    'Big Ride Achievement: Ride the Train',
    'ride a train',
    'Complete Blue Tower, unlock the rail network and board any moving train.',
  ],
  [
    'big-tunnel-achievement',
    'Big Tunnel Achievement: Enter a Big Tunnel',
    'enter a major tunnel',
    'Complete Yellow Tower and open the matching tunnel route.',
  ],
  [
    'big-wall-achievement',
    'Big Wall Achievement: Go Beyond the Wall',
    'go beyond the late-game wall',
    'Complete the main tower progression and use the Black Tower route.',
  ],
  [
    'big-pack-achievement',
    'Big Pack Achievement: Wear a Backpack',
    'wear a backpack',
    'Find a blue bag building, pick up a backpack and attach it to your back.',
  ],
  [
    'big-help-achievement',
    'Big Help Achievement: Wear a Hip Item',
    'wear something on your hip',
    'Find a hip bag or compatible wearable and attach it to the side slot.',
  ],
  [
    'big-climb-achievement',
    'Big Climb Achievement: Reach the Highest Point',
    'reach the island’s highest point',
    'Use the central mountain routes and team movement to stand at the highest reachable point.',
  ],
  [
    'big-makeover-achievement',
    'Big Makeover Achievement: Get Shiny',
    'receive metallic paint',
    'Open the Yellow Tunnel, reach the hidden metallic palette and have another player paint you.',
  ],
  [
    'big-goodbye-achievement',
    'Big Goodbye Hidden Achievement',
    'finish the standard ending',
    'Complete the main colored-tower progression and follow the ending route.',
  ],
  [
    'big-game-achievement',
    'Big Game Hidden Achievement and 100% Requirement',
    'completely finish the game',
    'Complete every normal challenge, the purple post-game set and the final completion route.',
  ],
]

achievements.forEach(([slug, title, requirement, method]) =>
  pages.push({
    section: 'achievements',
    slug,
    title,
    category: 'Achievement',
    summary: `Exact requirement and efficient route for ${title.replace('Big Walk ', '')} on Steam and PS5, with spoiler control and related progression help.`,
    aliases: [requirement, `${title.split(':')[0]} trophy`],
    location: 'Achievement and trophy checklist',
    answer: `Requirement: ${requirement}. ${method}`,
    steps: [
      method,
      'Wait for the achievement notification before leaving the area.',
      'If it does not unlock, let the host save, regroup and repeat the final interaction.',
    ],
    context:
      'Steam has 12 in-game achievements. PS5 uses the same 12 requirements and adds Big Trophy, the platinum awarded after the others. Progression achievements are easiest with the same host because the host owns the world save.',
    checklist: [
      `Required action: ${requirement}`,
      'Use the same host for progression',
      'Keep the game version matched across the group',
      'Check the full 100% list before final cleanup',
    ],
    related: [
      ['Complete achievement checklist', '/guides/achievements'],
      ['100% and endings route', '/guides/endings-and-100-percent'],
      ['Find a trophy group', '/find-players'],
    ],
    sources: [
      ['Printable PS5 trophy list', urls.trophies, 'official names and descriptions'],
      [
        'Big Walk community guide index',
        'https://www.reddit.com/r/BigWalk/comments/1vf9oe3/big_walk_guides_unlockables_map_locations_items/',
        'completion route cross-check',
      ],
    ],
  })
)

const factPages = [
  [
    'guides',
    'what-is-big-walk',
    'What Is Big Walk? Gameplay Explained',
    'Beginner',
    'Big Walk is a 2–12 player online cooperative “walker-talker” about exploring an island, solving communication puzzles and hanging out with friends. There is no combat, death loop or random matchmaking.',
    [
      'Watch the official trailer or scan the spoiler-free overview.',
      'Choose a reliable host and the correct world size.',
      'Bring at least one other player; solo exploration cannot finish the puzzle route.',
    ],
    'Players expect a quest list or mission arrows, but the game deliberately replaces them with landmarks, physical tools and conversation.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'guides',
    'what-to-do-after-tutorial',
    'Big Walk: What to Do After the Tutorial',
    'Beginner',
    'Leave through the large archway, complete the four beach-area challenges, insert their red pieces, shape the golden key and lower the drawbridge.',
    [
      'Exit through the floor-to-ceiling arch.',
      'Use the nearby crane, telescope, blue house and green scaffold challenges.',
      'Return four pieces to the beach panel.',
      'Follow five key cutters and unlock the bridge.',
    ],
    'The island opens only after these four specific puzzles; later towers can accept rewards from many different challenges.',
    'Opening puzzle route',
    urls.beach,
  ],
  [
    'guides',
    'what-to-do-after-red-tower',
    'Big Walk: What to Do After Red Tower',
    'Progression',
    'Use the Red Tower key to open the Map Room, take the handheld map and compass, then choose Blue Tower for trains or Green Tower for the chairlift.',
    [
      'Finish shaping the Red Tower key.',
      'Open the Map Room at 3560, 1425.',
      'Check the floor map for unfinished challenges.',
      'Pick the next transport unlock that helps your group.',
    ],
    'Players often leave without taking navigation tools or assume the towers must be completed in a fixed order. They do not.',
    'Red Tower route',
    urls.red,
  ],
  [
    'guides',
    'what-to-do-after-ending',
    'Big Walk: What to Do After the First Ending',
    'Progression',
    'For the complete ending, clear every remaining normal challenge, finish the seven purple challenges and use the final collection route.',
    [
      'Return to the Map Room and inspect incomplete markers.',
      'Recover unused red pieces and all purple rewards.',
      'Finish the purple-area challenges.',
      'Follow the completion route for Big Game.',
    ],
    'The first ending unlocks Big Goodbye, but it is not the same requirement as completely finishing the game.',
    'Community completion discussion',
    'https://www.reddit.com/r/BigWalk/comments/1vif8k5/what_should_i_do_after/',
  ],
  [
    'multiplayer',
    'two-player-coop',
    'Can You Play Big Walk With 2 Players?',
    'Multiplayer',
    'Yes. Two players is the minimum supported group, and the host should select the 2-player world so every scaled objective remains completable.',
    [
      'Choose the most reliable player as host.',
      'Select the 2-player world at session creation.',
      'Carry radios and divide puzzle roles clearly.',
    ],
    'A 3-player or 4+ world can ask for more simultaneous targets than a duo can operate, so world size matters more than lobby capacity.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'three-player-coop',
    'Big Walk With 3 Players: Best World Size',
    'Multiplayer',
    'Choose the 3-player world when three players are the minimum group expected for every session. More friends may still join up to the 12-player cap.',
    [
      'Start from the host’s save.',
      'Select the 3-player world.',
      'Assign a caller, carrier and runner on separated puzzles.',
    ],
    'World size sets minimum simultaneous puzzle requirements; it is not a hard maximum on who may join later.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'four-plus-world',
    'Big Walk 4+ Player World Explained',
    'Multiplayer',
    'Use the 4+ world only when at least four players can reliably return. It supports the busiest challenge variants and still allows up to 12 players.',
    [
      'Confirm four regular players before creation.',
      'Select 4+ at the host screen.',
      'Use short role names and a fixed regroup point.',
    ],
    'Starting 4+ for a launch-night crowd can strand the save when only two or three friends return next week.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'twelve-player-limit',
    'Big Walk 12 Players: Lobby Limit and Tips',
    'Multiplayer',
    'Big Walk supports up to 12 players online. Large groups are chaotic but work best with one host, one route caller and smaller puzzle teams.',
    [
      'Use a password or controlled join code.',
      'Split into named subgroups.',
      'Choose one landmark for regrouping.',
    ],
    'The puzzle world scales only across 2, 3 and 4+ variants, not separately for every player count up to 12.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'local-coop-split-screen',
    'Does Big Walk Have Split Screen or Local Co-op?',
    'Multiplayer',
    'No. Big Walk does not have split screen or local co-op. House House says each player needs a separate device because restricted information and communication are central to its puzzles.',
    [
      'Give each player a supported copy and device.',
      'Join the same hosted session by friends list or code.',
      'Use in-game voice or text instead of room-wide shortcuts.',
    ],
    'House House recommends separate rooms when two systems are in the same home, because overhearing or watching another screen reveals information that several puzzles deliberately hide.',
    'House House developer AMA',
    urls.localCoop,
  ],
  [
    'multiplayer',
    'join-code',
    'How to Use a Big Walk Join Code',
    'Multiplayer',
    'The host must enter the world first, then share the active session code. Other players choose Join Game and enter that code while running a matching game version.',
    [
      'Have the host load the save fully.',
      'Open the active session information and copy the code.',
      'Enter it from Join Game.',
      'If it fails, compare the first two version numbers and system clocks.',
    ],
    'Codes are session access details, not permanent group identities. Do not leave a live code on a public page longer than necessary.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'session-password',
    'Big Walk Session Passwords and Private Games',
    'Multiplayer',
    'A host can protect a session with a password so a shared join code does not allow unintended players to enter.',
    [
      'Set the password before distributing the code.',
      'Share it privately with the intended group.',
      'Replace the session details if a code was posted publicly.',
    ],
    'Passwords are useful for 18+, language-specific and trophy groups where the host needs a predictable roster.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'steam-friends-invite',
    'How to Join Big Walk Through Steam Friends',
    'Multiplayer',
    'Same-platform Steam friends can see and join an active friend session when space is available; cross-platform players should use the session code instead.',
    [
      'Add the host on Steam.',
      'Have the host load into the world.',
      'Open the in-game friends list and join the active session.',
    ],
    'The game’s friends view uses platform friendship. It does not create a separate permanent Big Walk account list.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'best-group-size',
    'Best Group Size for Big Walk',
    'Multiplayer',
    'Two to four players is easiest to coordinate; five to twelve creates more social chaos. Pick the world for the smallest reliable group, not the largest launch-day attendance.',
    [
      'Choose focus or chaos before creating the save.',
      'Count the people likely to return next session.',
      'Select 2, 3 or 4+ based on that minimum.',
    ],
    'A large lobby adds hands but also makes voice overlap, item ownership and regrouping harder.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'crossplay-pc-ps5',
    'Big Walk PC and PS5 Crossplay Guide',
    'Multiplayer',
    'PC, Mac and PS5 players can play together using crossplay and an active join code. They should enable crossplay and match the first two game-version numbers.',
    [
      'Enable crossplay on both systems.',
      'Have the host enter the world.',
      'Share the active code.',
      'Compare versions and system time if the connection fails.',
    ],
    'Platform friends lists do not cross systems, so use the code instead of waiting for the other player to appear as a friend.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'crossplay-switch2',
    'Big Walk Switch 2 Crossplay Guide',
    'Multiplayer',
    'Switch 2 can join PC, Mac and PS5 sessions through crossplay. A wrong console date/time is a known cause of connection failure.',
    [
      'Enable crossplay.',
      'Synchronize the Switch 2 clock automatically.',
      'Enter the host’s live join code.',
      'Restart after version updates.',
    ],
    'A correct code can still fail when system time is wrong or one platform has not installed the current patch.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'find-discord-and-lfg',
    'Where to Find Big Walk Players, LFGs and Discord Groups',
    'LFG',
    'Use short-lived LFG listings that state platform, region, language, timezone, microphone preference, experience and goal. Exchange permanent invites privately.',
    [
      'Post a listing on our Find Players board.',
      'State when you are available and how much progress you have.',
      'Move join codes or Discord invites to private messages when possible.',
    ],
    'Public community threads remove permanent Discord links and rotate daily because stale codes and spam make open lists unsafe.',
    'Reddit LFG megathread',
    urls.lfg,
  ],
  [
    'multiplayer',
    'lfg-post-template',
    'Big Walk LFG Post Template That Gets Replies',
    'LFG',
    'A useful post says who, where, when and why: platform, region/timezone, language, mic, experience, player count and the session goal.',
    [
      'Use a recognizable display name.',
      'Add platform, region and local time window.',
      'Say whether the run is blind, spoiler-light or 100%.',
      'Post a temporary code only when playing now.',
    ],
    '“Anyone?” creates extra questions. Specific listings let compatible players decide in seconds.',
    'Reddit LFG megathread',
    urls.lfg,
  ],
  [
    'multiplayer',
    'choose-a-host',
    'How to Choose the Right Big Walk Host',
    'LFG',
    'Choose the person most likely to attend every future session, with a stable connection and enough time to load the save before everyone joins.',
    [
      'Compare schedules before starting.',
      'Let the most reliable attendee host.',
      'Write down the chosen world size and group goal.',
    ],
    'Progress belongs to the host’s save. Picking by fastest connection alone is a mistake if that person rarely returns.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'multiplayer',
    'trophy-lfg',
    'How to Find a Big Walk Trophy or 100% Group',
    'LFG',
    'Advertise the exact cleanup goal, current tower progress, platform, world size and whether you need the standard or complete ending.',
    [
      'List completed towers and remaining challenges.',
      'Say whether spoilers are allowed.',
      'Choose a host who owns the relevant save.',
      'Plan more than one sitting if cleanup is large.',
    ],
    'A fresh host cannot automatically continue another host’s world progress, even if every player earned some personal achievements.',
    'Reddit LFG megathread',
    urls.lfg,
  ],
  [
    'locations',
    'map-room-location',
    'Big Walk Map Room Location and Coordinates',
    'Location',
    'The Map Room entrance is at 3560, 1425 below Red Tower. Complete Red Tower, shape its key through five cutters and unlock the blue building by the long red stairs.',
    [
      'Reach Red Tower at roughly 3670, 1400.',
      'Insert five red puzzle rewards.',
      'Shape the key along the downhill cutter route.',
      'Use it at the Map Room entrance.',
    ],
    'Players sometimes search Blue Tower because the Map Room building itself is blue. The unlock actually comes from Red Tower.',
    'Red Tower route',
    urls.red,
  ],
  [
    'locations',
    'red-tower-location',
    'Big Walk Red Tower Location and Coordinates',
    'Location',
    'Red Tower is around 3670, 1400 on the mountain above the Map Room and is the best first major tower because it unlocks navigation.',
    [
      'Cross the opening drawbridge.',
      'Follow the red platforms and staircase area.',
      'Take the mountain path behind you to the tower.',
    ],
    'You will not have the handheld map yet, so use the red structures and long Map Room stairs as landmarks.',
    'Red Tower route',
    urls.red,
  ],
  [
    'locations',
    'blue-tower-location',
    'Big Walk Blue Tower Location and Coordinates',
    'Location',
    'Blue Tower is around 3540, 1850. Its golden key unlocks all three trains through the main station at 3380, 1740.',
    [
      'Use the Map Room to mark the northwest route.',
      'Climb to the tower roof.',
      'Return five red pieces, then shape the key toward the station.',
    ],
    'The blue tower and blue Map Room are different buildings; use the coordinates and train tracks to distinguish them.',
    'Blue Tower route',
    urls.blue,
  ],
  [
    'locations',
    'green-tower-location',
    'Big Walk Green Tower Location and Coordinates',
    'Location',
    'Green Tower is around 3930, 1900 beside the main chairlift station at 3950, 1950. A red frame below it holds the GPS.',
    [
      'Travel east using the map grid.',
      'Look for the chairlift infrastructure.',
      'Climb to the tower and check the red GPS frame below.',
    ],
    'This area contains several navigation and transport tools, so leave inventory space before making the trip.',
    'Green Tower route',
    urls.green,
  ],
  [
    'locations',
    'yellow-tower-location',
    'Big Walk Yellow Tower and Tunnel Locations',
    'Location',
    'Yellow Tower is around 3310, 1560. The Yellow Tunnel entrance is southeast at roughly 3500, 1620.',
    [
      'Mark both coordinates before leaving the Map Room.',
      'Complete five nearby or spare puzzles.',
      'Shape the tower key toward the tunnel entrance.',
    ],
    'The tower reward and the door it opens are not in the same spot. Follow cutter arrows instead of returning to the tower roof.',
    'Yellow Tower route',
    urls.yellow,
  ],
  [
    'locations',
    'black-tower-location',
    'Big Walk Black Tower Location and Late-Game Route',
    'Location',
    'The Black Tower sits in the central late-game area between the Yellow region and the highest mountain routes. It becomes relevant after the colored transport towers.',
    [
      'Finish the core colored-tower unlocks.',
      'Use the Map Room to identify remaining central markers.',
      'Bring the required red or purple progression pieces.',
    ],
    'Reaching the structure early does not mean the final route is ready; preserve spare rewards for late-game receivers.',
    'Community guide index',
    'https://www.reddit.com/r/BigWalk/comments/1vf9oe3/big_walk_guides_unlockables_map_locations_items/',
  ],
  [
    'locations',
    'main-train-station',
    'Big Walk Main Train Station Location',
    'Location',
    'The train unlock station is around 3380, 1740, northwest of Blue Tower and tucked into the mountain. Use the Blue Tower key there.',
    [
      'Complete Blue Tower.',
      'Follow all five cutter arrows down the mountain.',
      'Insert the finished key at the station.',
      'Board any of the three moving trains.',
    ],
    'The key activates the whole rail loop, not only the red train visible near the station.',
    'Blue Tower route',
    urls.blue,
  ],
  [
    'locations',
    'chairlift-station',
    'Big Walk Chairlift Station Location',
    'Location',
    'The main chairlift station is around 3950, 1950 directly beside Green Tower. Unlock it with the fully cut Green Tower key.',
    [
      'Complete Green Tower at 3930, 1900.',
      'Follow the cutter route around the station supports.',
      'Insert the finished key inside the station.',
    ],
    'Several cutters sit near the large chairlift legs; look up and around the structure before walking away.',
    'Green Tower route',
    urls.green,
  ],
  [
    'locations',
    'customization-area',
    'Big Walk Character Customization Location',
    'Location',
    'The paint palette is around 3570, 1190 across the river below the tutorial exit. Another player must use the brush to paint you.',
    [
      'Leave the tutorial through the large arch.',
      'Pass the first flare and bench.',
      'Look across the river for green, yellow and red walls plus a giant palette.',
    ],
    'Color changes persist with the player, and the mirror helps confirm each head, torso and leg section.',
    'Character customization guide',
    'https://www.screenhype.co.uk/how-to-change-your-appearance-in-big-walk/',
  ],
  [
    'help',
    'join-code-not-working',
    'Big Walk Join Code Not Working: Fixes in Order',
    'Technical Help',
    'Make sure the host has loaded into the world, the first two version numbers match and every system clock is correct. Then restart the game and use the current session code.',
    [
      'Host loads fully into the save before sharing the code.',
      'Compare version numbers on both clients.',
      'Synchronize date, time and timezone automatically.',
      'Restart the game and create a fresh code.',
    ],
    'Most “wrong code” reports are actually session-state, version or clock problems. A code copied before the world is active may not connect.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'crossplay-not-working',
    'Big Walk Crossplay Not Working: PC, PS5 and Switch 2',
    'Technical Help',
    'Turn Crossplay on in Big Walk settings, let the host enter the world, match the first two version numbers and synchronize every system clock before retrying the active Join Code.',
    [
      'Confirm Crossplay is On in Big Walk settings.',
      'Let the host load their character into the world.',
      'Update and compare the first two version numbers.',
      'Set date and time automatically.',
      'Have the host reload and issue a new code.',
    ],
    'The most common false start is waiting together at the title screen. The host must start the world before the other players can join it.',
    'Launch-week crossplay troubleshooting thread',
    urls.crossplay,
  ],
  [
    'help',
    'versions-do-not-match',
    'Big Walk Version Mismatch and Update Fix',
    'Technical Help',
    'The first two version numbers shown by every player must match. Close the game, install the newest platform update and restart before retrying.',
    [
      'Read the version number on each title screen.',
      'Force an update check on every platform.',
      'Restart the game after patching.',
      'Regenerate the host code.',
    ],
    'Cross-platform patches can become available at slightly different times, leaving one player on an older build.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'system-clock-connection',
    'Big Walk Connection Error Caused by Date and Time',
    'Technical Help',
    'Set the PC or console date, time and timezone to automatic, then restart Big Walk. An incorrect system clock can prevent secure session connections.',
    [
      'Open system date and time settings.',
      'Enable automatic time and timezone.',
      'Synchronize now.',
      'Restart the game and retry the live code.',
    ],
    'This is easy to miss on Switch 2 or a console that has been offline because every other network setting can look correct.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'voice-chat-too-quiet',
    'Big Walk Voice Chat Too Quiet: Settings and Patch Help',
    'Technical Help',
    'Install the latest update, check the selected microphone/output device and keep proximity in mind: distant players are intentionally quiet or inaudible.',
    [
      'Update Big Walk.',
      'Confirm the correct input and output devices.',
      'Test at face-to-face distance.',
      'Compare in-game volume with system mixer levels.',
    ],
    'House House increased usability after launch but kept distance-based voice as a core mechanic, so there is no setting that should make the whole island equally loud.',
    'PC Gamer voice patch report',
    urls.voice,
  ],
  [
    'help',
    'ps5-microphone',
    'Big Walk PS5 Microphone Not Working',
    'Technical Help',
    'Unmute the DualSense or headset, allow game voice, select the correct input device and test close to another player after restarting the session.',
    [
      'Check the controller mute light.',
      'Open PS5 microphone and game voice permissions.',
      'Select the intended headset or controller mic.',
      'Restart Big Walk and test nearby.',
    ],
    'Party-chat settings and hardware mute can block the game before Big Walk ever receives microphone input.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'controller-not-detected',
    'Big Walk Controller Not Detected',
    'Technical Help',
    'Reconnect the controller before launching, close conflicting remapping software, choose a supported layout and test default bindings before rebinding.',
    [
      'Power-cycle or reconnect the controller.',
      'Close duplicate input and remapper apps.',
      'Launch Big Walk and restore defaults.',
      'Rebind one action at a time.',
    ],
    'Steam Input or two simultaneous controller layers can produce duplicate or missing actions.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'rebind-controls',
    'How to Rebind Big Walk Controls',
    'Technical Help',
    'Big Walk supports rebinding. Change one action at a time, avoid duplicate assignments and keep point, interact, kick, crouch and communication actions easy to reach.',
    [
      'Open Controls in settings.',
      'Select an action and press the new input.',
      'Resolve duplicate warnings.',
      'Test movement and interaction in a safe area.',
    ],
    'Communication puzzles are much harder if pointing or gesture controls are placed on awkward combinations.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'save-not-loading',
    'Big Walk Save Not Loading or Progress Missing',
    'Technical Help',
    'Confirm the original host is loading the world. Progress is stored with the host; another player starting a session creates or loads a different save.',
    [
      'Identify who hosted the original run.',
      'Have that person choose Host Game and the correct save.',
      'Let everyone else join after the world loads.',
    ],
    'Personal achievement unlocks do not turn every client into a copy of the host’s world save.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'change-host-transfer-save',
    'Can You Change Host or Transfer a Big Walk Save?',
    'Technical Help',
    'Treat the original host as the owner of that world. The official guidance says the host saves progress, so do not assume another player can seamlessly continue the same island state.',
    [
      'Keep the original host for the campaign.',
      'Schedule sessions around that player.',
      'If starting over, choose a smaller sustainable world size.',
    ],
    'A host change is not the same as ordinary crossplay or joining from another platform.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'game-crash-reconnect',
    'Big Walk Crashed: How to Rejoin Safely',
    'Technical Help',
    'Restart the game, let the host confirm the world is still active, then use a fresh code if the old one no longer works. Check that the last tower or puzzle reward was saved.',
    [
      'Close and relaunch the game.',
      'Host checks the current world state.',
      'Rejoin through friends or a new code.',
      'Verify carried progression objects after loading.',
    ],
    'Temporary puzzle objects may reset while host progression remains. Re-check the receiver before repeating a whole route.',
    'Official FAQ',
    urls.faq,
  ],
  [
    'help',
    'switch2-connection',
    'Big Walk Switch 2 Connection Troubleshooting',
    'Technical Help',
    'Synchronize the Switch 2 clock, update the game, turn Crossplay on and enter a code created after the host has loaded into the world.',
    [
      'Set date/time automatically.',
      'Install the newest Big Walk update.',
      'Enable crossplay.',
      'Use a newly generated active code.',
    ],
    'Players have repeatedly fixed apparently valid crossplay codes by correcting an unsynchronized console clock.',
    'Launch-week Switch 2 crossplay troubleshooting thread',
    urls.crossplay,
  ],
  [
    'help',
    'text-chat-restrictions',
    'Big Walk Text Chat: Range and Puzzle Restrictions',
    'Technical Help',
    'Text chat can be used through the game, but it follows the same designed distance and barrier restrictions as voice so communication puzzles still work.',
    [
      'Enable the in-game text option.',
      'Test it near teammates.',
      'Expect range and room restrictions.',
      'Use gestures, lights and tools when chat is blocked.',
    ],
    'External chat bypasses intended communication obstacles; in-game text preserves them for players who cannot use a microphone.',
    'Official FAQ',
    urls.faq,
  ],
]

const factRelated = {
  'Technical Help': [
    ['Crossplay troubleshooting', '/help/crossplay-not-working'],
    ['Join Code troubleshooting', '/help/join-code-not-working'],
    ['How host saves work', '/help/save-progress-host'],
  ],
  Multiplayer: [
    ['Multiplayer overview', '/multiplayer/crossplay-player-count'],
    ['How Join Codes work', '/multiplayer/join-code'],
    ['Find compatible players', '/find-players'],
  ],
  Location: [
    ['Map and compass guide', '/guides/map-and-compass'],
    ['Tower progression order', '/guides/tower-order'],
    ['Browse puzzle locations', '/puzzles'],
  ],
  Progression: [
    ['Beginner route', '/guides/beginner-guide'],
    ['Recommended tower order', '/guides/tower-order'],
    ['Map and compass guide', '/guides/map-and-compass'],
  ],
  Beginner: [
    ['Start here: beginner guide', '/guides/beginner-guide'],
    ['Multiplayer and saves', '/multiplayer/crossplay-player-count'],
    ['Find a group', '/find-players'],
  ],
}

for (const entry of factPages) {
  const [section, slug, title, category, answer, steps, context, sourceLabel, sourceUrl] = entry
  pages.push({
    section,
    slug,
    title,
    category,
    summary: conciseSummary(answer),
    aliases: [slug.replaceAll('-', ' ')],
    answer,
    steps,
    context,
    related: (
      factRelated[category] || [
        ['Browse all guides', '/guides'],
        ['Big Walk beginner guide', '/guides/beginner-guide'],
        ['Find players', '/find-players'],
      ]
    ).filter(([, href]) => href !== `/${section}/${slug}`),
    sources: [
      [sourceLabel, sourceUrl, 'primary fact and step cross-check'],
      ['Official Big Walk FAQ', urls.faq, 'platform, multiplayer, save and accessibility facts'],
    ],
  })
}

let created = 0
pages.forEach((page, index) => {
  writePage(page, index)
  created += 1
})

console.log(`Generated ${created} source-checked Big Walk pages.`)
