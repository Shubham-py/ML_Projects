export interface Lesson {
  slug: string
  title: string
  category: string
  description: string
  content: string
}

export const lessons: Lesson[] = [
  {
    slug: 'waveforms-and-pitch',
    title: 'How Sound Works: Waveforms & Pitch',
    category: 'Sound Design',
    description: 'What an oscillator actually is, and why a sawtooth wave sounds so different from a sine wave.',
    content: `
## What is a sound wave?

Every sound is air pressure vibrating back and forth very fast. A speaker (or your headphones) recreates this by moving a tiny membrane in and out. How fast it moves back and forth is the **frequency**, measured in Hertz (Hz) — cycles per second. The faster it vibrates, the higher the pitch you hear.

The note **A4** (the A above middle C) vibrates at exactly **440 Hz**. Every octave up doubles the frequency (A5 = 880 Hz), and every octave down halves it (A3 = 220 Hz). That's why octaves sound so "the same" to our ears — they're the simplest possible mathematical relationship (2:1).

## The four basic waveforms (try them in the Keys tab!)

An **oscillator** is the part of a synthesizer that generates this repeating wave. The *shape* of the wave — not just its frequency — is what gives an instrument its character (its **timbre**). Beat Studio's synths give you four to try:

- **Sine wave** — the purest possible tone, just one frequency with nothing else added. Sounds soft, round, almost flute-like. Great for sub-bass because it has no harshness at all.
- **Triangle wave** — a sine wave with a bit of edge added (odd harmonics, quickly fading). Slightly buzzier than sine but still soft — think retro video-game melodies.
- **Square wave** — alternates sharply between two levels. Sounds hollow and reedy (like a clarinet) — classic 8-bit game sound, and great for retro leads.
- **Sawtooth wave** — ramps up then drops sharply, over and over. Contains *all* harmonics (even and odd), giving it a bright, buzzy, aggressive sound. This is the workhorse waveform of EDM basses and leads — almost every big-room lead and wobble bass starts life as a sawtooth.

**Try this:** go to the Keys tab, hold down a note, and switch between waveforms while it's not playing to hear the difference. Notice how sawtooth instantly sounds more "EDM" than sine.

## Why does a filter matter so much then?

A raw sawtooth is harsh and buzzy — almost every EDM bass/lead sound you've ever heard is a sawtooth (or several detuned together) run through a **filter** to shave off some of that harshness and shape the tone. That's the whole subject of the next lesson.
`,
  },
  {
    slug: 'adsr-envelope',
    title: 'The ADSR Envelope',
    category: 'Sound Design',
    description: 'How a synth decides whether a sound plucks, stabs, or swells — and why it matters for basslines vs. pads.',
    content: `
## The problem envelopes solve

If you press a key and a synth just instantly blasts out full volume and cuts off instantly when you release — every sound would feel identical and robotic, no matter the waveform. Real instruments don't work that way: a plucked guitar string is loud immediately then fades; a violin swells in gradually; a piano note has a sharp hit then a long, slow decay.

An **envelope** shapes how loud a note is *over time*, from the moment you press it to long after you release it. The standard model — used in nearly every synthesizer ever made — has four stages, hence **ADSR**:

- **Attack** — how long it takes to reach full volume after you press the key. Near-zero attack = an instant, punchy pluck. A long attack (0.5s+) = a slow swell, like a pad or string sound fading in.
- **Decay** — after hitting full volume, how long it takes to fall to the sustain level.
- **Sustain** — the volume level held *while you keep the key pressed* (this is a level, not a time — the only stage measured in volume, not seconds).
- **Release** — how long the sound takes to fade to silence *after you let go* of the key.

## Matching envelope to purpose

- **Punchy EDM bass/pluck:** near-zero attack, short decay, low-to-mid sustain, short release. You want the note to hit immediately and get out of the way for the next one.
- **Pad / atmosphere:** slow attack (0.3-1s+), long release (1-3s+) — notes bloom in and blend into each other, filling space instead of poking through.
- **Drums:** kicks and snares are almost pure envelope — a MembraneSynth kick is really just a pitched click shaped by a very fast attack and short decay with zero sustain, which is exactly how Beat Studio's kick drum is built.

**Try this:** go to the Keys tab, drag Attack up to 1.5 and Release up to 1.5, then hold a note. Notice how different it feels from the punchy default — that's the entire difference between a "bass" patch and a "pad" patch, same waveform, same notes.
`,
  },
  {
    slug: 'filters-and-cutoff',
    title: 'Filters, Cutoff & Resonance',
    category: 'Sound Design',
    description: 'The single most important sound-shaping tool in electronic music — and the secret behind the "build-up sweep."',
    content: `
## What a filter does

A raw sawtooth wave contains a huge stack of frequencies all at once (its harmonics). A **filter** selectively lets some of those frequencies through and blocks others — reshaping a harsh, buzzy raw waveform into something musical.

The type you'll use 95% of the time is a **low-pass filter**: it lets frequencies *below* a certain point through, and cuts (attenuates) everything above it. That cutoff point is called the **cutoff frequency**.

- **High cutoff (near 20,000 Hz)** — almost nothing is filtered out. The sound stays bright, buzzy, and full of harmonics.
- **Low cutoff (a few hundred Hz)** — only the low rumble gets through. The sound becomes dark, muffled, bass-heavy.

## Resonance: the filter's "personality"

Turn up **resonance** (sometimes called **Q**) and the filter boosts the frequencies right *at* the cutoff point before cutting everything above it — creating a whistling, honky, sometimes squelchy emphasis right at the cutoff. High resonance is what gives acid-house basslines and dubstep wobbles their aggressive, vocal-like quality.

## The build-up sweep — the most famous EDM filter trick

You've heard this a thousand times without knowing its name: during a build-up, the filter cutoff on the whole mix (or a big riser sound) slowly sweeps from low to high (or high to low), and the moment it hits the extreme, the drop hits with everything wide open. That tension-and-release is *entirely* a filter cutoff automation.

**Try this:** go to Effects → Master Bus, and while a pattern is looping, slowly drag the "Master Filter" slider down to around 500 Hz, then quickly snap it back up to 20,000 Hz. That snap-back-up moment is exactly the sensation of a drop hitting.

## Filter envelope — an envelope, but for the filter

Just like an amplitude envelope shapes volume over time, a **filter envelope** shapes the *cutoff frequency* over time, automatically, on every single note. This is how a bass can start "closed" (dark) and quickly "open up" (bright) on every pluck without you manually moving anything — it's built into the Bass and Lead voices in Beat Studio, controlled by their attack/decay settings internally.
`,
  },
  {
    slug: 'notes-and-scales',
    title: 'Music Theory Basics: Notes & Scales',
    category: 'Music Theory',
    description: 'Why some notes sound "right" together and others clash — and how the piano roll\'s scale-lock guarantees you never hit a wrong note.',
    content: `
## The 12 notes

Western music divides one octave into 12 evenly-spaced notes: **C, C#, D, D#, E, F, F#, G, G#, A, A#, B**, then it repeats an octave higher. That's it — every melody in every song you've ever heard is built from just these 12 pitches, repeated across octaves.

## Why not just use all 12 notes freely?

You can — but most melodies that sound "good" actually only use a specific *subset* of those 12 notes at a time, called a **scale**. Using notes outside the chosen scale is what creates that "wrong note" clashing feeling. Using notes only from within the scale is (almost) guaranteed to sound coherent, because the notes are mathematically chosen to have pleasant frequency relationships with each other.

## The scales available in Beat Studio's piano roll

- **Natural Minor** — the default, moody EDM/house/techno scale. 7 notes: root, and specific whole/half step gaps that give it a slightly sad, driving character. Works for almost everything.
- **Major** — bright and uplifting, common in progressive house and trance.
- **Minor Pentatonic** — only 5 notes (no 2nd or 6th degree). Even more forgiving than natural minor — genuinely hard to make sound "wrong." Great for a first bassline.
- **Dorian** — minor, but with a brighter 6th degree — a deep-house and funk staple.
- **Phrygian** — dark and tense, thanks to a note sitting just a half-step above the root. Very common in dubstep and dark techno.
- **Harmonic Minor** — dramatic and a little exotic, thanks to a wide gap near the top of the scale. Great for trance and big-room leads.

## Why the piano roll only shows certain rows

When you open the Bass or Lead tab, the piano roll doesn't show all 12 notes per octave — it only shows the notes *in the currently selected scale*. This is called **scale-lock**, and it's the single biggest beginner-friendly trick in this whole app: since every row is already in the same scale, **any combination of notes you click will sound harmonically coherent.** You genuinely cannot make a "wrong" melody here — feel free to experiment freely.

## Root note = "home base"

The **root note** is the note the scale is built from — the note that feels like "home," where a melody often wants to resolve to at the end of a phrase. Beat Studio's starter song is rooted on **A**, so both the bass and lead patterns are built from an A-minor scale.
`,
  },
  {
    slug: 'rhythm-and-beat-programming',
    title: 'Rhythm & Beat Programming',
    category: 'Rhythm',
    description: 'What the 16-step grid actually represents, and the classic drum patterns behind house, trap, and dubstep.',
    content: `
## What is a "step," really?

Beat Studio's drum sequencer has 16 steps per pattern. Those 16 steps represent one musical **bar** (measure) of 4 beats, split into 16ths — so every 4 steps is one beat. This 16-step-per-bar grid is the single most common way drum machines have represented rhythm since the 1980s (the Roland TR-808 popularized exactly this layout), because it's fine-grained enough to program almost any dance rhythm while staying easy to read visually.

## The "four on the floor" kick — the foundation of house/EDM

Put a kick on **steps 0, 4, 8, 12** (i.e., every single beat). This is called **four-on-the-floor**, and it is the single most identifying feature of house, techno, trance, and most mainstream EDM. It creates a relentless, danceable pulse that's easy to move to.

## Classic hi-hat patterns

- **Off-beat 8th hats:** closed hat on steps **2, 6, 10, 14** (right between each kick) — the classic "chick-chick-chick-chick" house groove, driving the track forward between kicks.
- **Straight 16th hats:** closed hat on every single step — creates a busier, more energetic, "rolling" feel, common in the run-up to a drop.

## The backbeat: snare/clap

Put a clap or snare on **steps 4 and 12** (beats 2 and 4) — this is called the **backbeat**, and it's the foundation of virtually all Western pop, rock, and dance music rhythm. It's what your body naturally wants to clap along to.

## Genre-specific patterns worth trying

- **House/Techno:** Kick 0,4,8,12 · Hat 2,6,10,14 · Clap 4,12
- **Trap/Hip-Hop-influenced EDM:** Kick 0,7,8 (syncopated, not four-on-floor) · rapid hi-hat rolls (try several consecutive closed-hat steps in a row, then a gap) · snare/clap on 4,12
- **Dubstep (half-time feel):** Kick 0,10 only · snare/clap on step 8 only (this creates the characteristic "half-speed" heavy feel even though the tempo number is actually fast, often 140 BPM)

## Swing (the "human" feel)

Real drummers don't hit every 16th note with perfectly robotic timing — they push some slightly later, creating "swing" or "groove." Beat Studio's grid is intentionally quantized (perfectly on-grid) to keep things simple and learnable, but as you advance, know that adding subtle timing variation is exactly what separates a "programmed" beat from one that feels human.

**Try this:** open the Drums tab, clear everything, and build the house pattern above from scratch, step by step, listening after each addition. Notice how the groove "clicks into place" once the off-beat hats are added between the kicks.
`,
  },
  {
    slug: 'edm-song-structure',
    title: 'EDM Song Structure',
    category: 'Arrangement',
    description: 'Intro, build-up, drop, breakdown — the energy arc almost every dance track follows, and how to build it with the Arrangement tab.',
    content: `
## Why structure matters

A great drum pattern and a great bassline aren't a *song* by themselves — a song is the *arrangement* of sections that takes a listener on a journey of rising and falling energy. Almost every mainstream EDM track (house, trance, dubstep, big-room) follows some variation of the same core structure.

## The five core sections

1. **Intro** — establishes the groove at low energy. Usually just drums (often without the kick, or without the snare/clap) so DJs can smoothly mix into the track. Sets the tempo and vibe without giving everything away.
2. **Build-Up** — energy rises. Elements are added one at a time (extra hi-hats, a rising riser/sweep sound, a filter opening up — see the Filters lesson), creating tension and anticipation. Often the drums get busier and busier right before the drop.
3. **Drop** — the payoff. Full energy, full arrangement — kick, bass, lead, all the drums — this is the "chorus" of EDM, the part people came to hear and dance to.
4. **Breakdown** — after a drop, energy pulls back dramatically, often removing the drums entirely and leaving just a melodic/atmospheric element (with lots of reverb). This gives the listener's ears (and the dancefloor) a breather before building up again.
5. **Outro** — mirrors the intro, gradually stripping elements away so a DJ can mix out cleanly.

## A common full arrangement

Intro → Build-Up → Drop → Breakdown → Build-Up → Drop → Outro

Notice the Drop typically happens **at least twice** — tracks are built to reward the listener more than once, with a breakdown in between to reset the energy so the second drop hits just as hard as the first.

## Building this in Beat Studio

The **Arrangement tab** is built exactly for this. Each named Pattern (Intro, Build-Up, Drop, Breakdown) is really just a saved combination of drum + bass + lead patterns. You:

1. Design each section's pattern individually (weaker on Intro/Breakdown, everything-at-once on Drop).
2. Add them to the arrangement in order, repeating Drop as many times as you like.
3. Set **"Bars per section"** to control how many loops of 16 steps each section plays before automatically advancing to the next one.
4. Switch the transport to **"Song"** mode and hit play to hear your whole structure play out automatically.

**Try this:** the starter project already has this exact structure loaded (Intro → Build → Drop → Drop → Break → Build → Drop) — switch to Song mode and press play to hear a full arrangement, then go remix each section to make it your own.
`,
  },
  {
    slug: 'sidechain-pump',
    title: 'The Sidechain Pump',
    category: 'Production Technique',
    description: 'That rhythmic "breathing" sound in almost every EDM track — what it is and why producers use it on nearly every kick.',
    content: `
## What you're actually hearing

Listen to almost any big-room, house, or pop-EDM track and you'll notice the bass/pads seem to rhythmically "duck" out of the way every time the kick hits, then swell back up right before the next kick — a pumping, breathing quality to the whole mix. This is **sidechain compression**, and it is one of the most iconic and widely-used production techniques in all of electronic music.

## Why producers do this — a mixing problem, solved creatively

A kick drum and a bassline often occupy a lot of the same low-frequency space. Play them at the same time at full volume and they smear into a muddy, undefined low end — you lose the punch of the kick and the clarity of the bass. The classic (originally purely practical) fix: automatically turn the bass **down** for a few milliseconds every time the kick hits, then let it come back up. This carves out space for the kick to punch through cleanly.

Producers quickly realized this "ducking" effect sounds *great* on its own — it became a stylistic signature of the genre, not just a mixing fix.

## How it actually works (technically)

In a real DAW, this is done with a **compressor** on the bass channel, whose "sidechain input" is fed by the kick drum track instead of the bass track itself. So instead of the bass compressing itself when *it* gets loud, it compresses (gets quieter) whenever the **kick** gets loud — that's the "side" part of "sidechain": the trigger comes from a different (side) signal.

## How Beat Studio simulates it

Every time the kick drum triggers, Beat Studio automatically ramps the whole mix's volume down sharply, then smoothly back up to full over roughly the length of a few 16th notes — that's the "Sidechain Pump" toggle in the Effects tab. **Pump depth** controls how far it ducks (higher = more dramatic pumping effect).

**Try this:** load the Drop pattern, hit play, and toggle Sidechain Pump on and off while it's playing. Listen specifically to the bass — you'll hear it visibly "breathe" in time with the kick when it's enabled, and sit flat/constant when disabled. Try cranking Pump Depth to max for an exaggerated, obviously-pumping effect (common in future-bass and big-room), then back down to something subtler (common in house/techno, where it's felt more than consciously heard).
`,
  },
  {
    slug: 'wobble-bass-and-lfo',
    title: 'Wobble Bass & LFOs',
    category: 'Sound Design',
    description: 'The growling, rhythmic bass sound that defines dubstep — and the simple modulation trick behind it.',
    content: `
## What's actually happening in a "wobble" bass

That aggressive, rhythmic "wah-wah-wah" bass sound that defines dubstep isn't a special waveform or a special note pattern — it's a single sustained bass note whose **filter cutoff is being moved up and down automatically, over and over, in time with the music.** As the cutoff sweeps up, the sound opens up and brightens; as it sweeps back down, it darkens and closes — over and over, creating that signature growl.

## The tool that does this: an LFO

An **LFO (Low Frequency Oscillator)** is just like the oscillators from the Waveforms lesson — except instead of being fast enough to *hear* as a pitch (20 Hz - 20,000 Hz), it moves slowly (often less than 20 Hz) and is used to *modulate* — automatically wiggle — some other parameter over time, rather than being heard directly.

Point an LFO at a filter's cutoff frequency, and instead of you manually turning a knob up and down, the LFO does it automatically, rhythmically, forever, at whatever rate you set.

## The parameters that shape the wobble

- **Rate** — how fast the LFO cycles. Beat Studio lets you sync this to musical note values (4n = once per beat, 8n = twice per beat, 16n = four times per beat, 8t = a triplet feel) so the wobble always stays in time with your beat, rather than drifting.
- **Depth/range** — how far the cutoff sweeps (in Beat Studio, this is fixed to a wide, dramatic sweep by design — real dubstep production would let you dial this in too).
- **Waveform** — LFOs have shapes just like audio oscillators. A sine LFO gives a smooth, rounded wobble; a square LFO gives a hard on/off gating effect. (Beat Studio uses a sine LFO under the hood for a classic smooth wobble.)

## Try it yourself

1. Go to the Bass tab and place a single long, sustained note pattern (e.g., one note held across several steps by placing it once — remember, in Beat Studio each step re-triggers the note, so for a true "held" wobble feel, try placing the same note on several consecutive steps).
2. Go to Effects → Lead/Wobble Voice and enable **Wobble**.
3. Try each Rate setting and listen to how the growl speeds up or slows down.
4. This same modulation *concept* — an LFO pointed at a parameter — is used everywhere in synthesis: vibrato is an LFO on pitch, tremolo is an LFO on volume, auto-panning is an LFO on stereo position. Once you understand "LFO → parameter," you understand a huge chunk of sound design.
`,
  },
  {
    slug: 'build-your-first-drop',
    title: 'Guided Walkthrough: Build Your First Drop',
    category: 'Guided Walkthrough',
    description: 'A step-by-step, no-experience-required guide to building a complete EDM section from silence.',
    content: `
## Before you start

Open the **Studio** tab in a second window/tab if you can, so you can follow along step by step while reading. Click **New** first to start from a totally blank project (or just clear each pattern manually as you go).

## Step 1 — The foundation kick

1. Go to the **Drums** tab.
2. Click the **Kick** row's steps **1, 5, 9, 13** (i.e., the 1st, 5th, 9th, and 13th boxes — remember steps are 0-indexed internally but let's count visually left to right). This is the four-on-the-floor pattern from the Rhythm lesson.
3. Hit **Play** (Pattern mode). You should hear a steady pulsing kick.

## Step 2 — Add hats for movement

4. On the **Closed Hat** row, click the boxes directly *between* each kick (the 3rd, 7th, 11th, 15th boxes). Notice how much more "alive" the beat feels immediately — this off-beat hat pattern is doing a lot of work.

## Step 3 — Add the backbeat

5. On the **Clap** row, click the 5th and 13th boxes (beats 2 and 4). This is the backbeat from the Rhythm lesson — it should feel like the natural place you'd clap along.

## Step 4 — Give it a bassline

6. Go to the **Bass** tab. The rows are already scale-locked to A minor, so anything you click will sound coherent.
7. Click the lowest **A** row on the same steps as your kick (1st, 5th, 9th, 13th) — this locks the bass tightly to the kick, a very common, very effective EDM technique (this is exactly why sidechain pumping exists and sounds so good — bass and kick sharing the same rhythmic hits).
8. Try changing just ONE of those notes to a different scale row (e.g. the 9th step) to add a bit of movement instead of repeating the same note every time.

## Step 5 — Turn on the pump

9. Go to **Effects → Sidechain Pump** and make sure it's enabled with a Pump Depth around 0.6. Go back to Drums or Bass and press play again — listen to the bass duck under every kick.

## Step 6 — Add a lead hook

10. Go to the **Lead** tab. Place 3-4 notes across the pattern (try steps 1, 5, 9, and 13 again to start simple, using different scale rows for each to create a little melodic shape/riff).
11. Go to **Effects → Lead/Wobble Voice** and try turning on **Wobble** at rate \`16n\` for an aggressive, driving lead — or leave it off for a cleaner, more melodic lead sound.

## Step 7 — Season with effects

12. In **Effects → Master Bus**, add a touch of Reverb (try 0.15) and a touch of Delay (try 0.1) — small amounts on the master bus glue everything together and add a sense of space, without washing out the punch.

## Step 8 — Give it structure

13. Go to **Arrangement**. Rename your current pattern to "Drop." Click **+ New Pattern**, and on this new one, go remove the Clap and most of the bass/lead notes, keeping just kick + hats — call this "Intro."
14. Add both to the arrangement in order: Intro, then Drop (then Drop again if you want it to repeat).
15. Switch the transport to **Song** mode and press Play — you now have an actual arranged song section, not just a looping pattern.

## Step 9 — Record it

16. Hit **Record**, let it play through your whole arrangement once or twice, then hit **Record** again to stop — a download will start automatically with your track as an audio file you can actually keep and share.

You just built a complete EDM section from silence, using the same rhythm, harmony, sound design, and arrangement concepts real producers use every day. Go back through the other lessons any time you want to go deeper on any one piece of this.
`,
  },
]

export const lessonCategories = Array.from(new Set(lessons.map((l) => l.category)))
