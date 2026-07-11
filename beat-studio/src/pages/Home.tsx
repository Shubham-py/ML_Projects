import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="text-center space-y-5 pt-6">
        <span className="inline-block rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-neon-purple)]">
          A real synth + drum machine + piano roll, right in your browser
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
          Make a beat. Learn how it works.
        </h1>
        <p className="mx-auto max-w-2xl text-[var(--color-text-dim)] text-base md:text-lg">
          A synthesizer, drum sequencer, piano roll, and effects rack — plus built-in lessons on music theory, sound
          design, and how EDM tracks are actually structured. No downloads, no plugins.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/studio"
            className="rounded-lg bg-[var(--color-neon-purple)] px-5 py-2.5 text-sm font-semibold text-black glow-purple hover:opacity-90 transition-opacity"
          >
            Open the Studio
          </Link>
          <Link
            to="/lessons"
            className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-bright)] hover:border-[var(--color-neon-purple)] transition-colors"
          >
            Start with the Lessons
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        {[
          {
            title: 'Drum Sequencer',
            body: 'Program kick, snare, hats, clap and tom on a classic 16-step grid. Press play and hear it loop instantly.',
          },
          {
            title: 'Bass & Lead Piano Rolls',
            body: 'Scale-locked note grids — every note you place is guaranteed to sound good together. No music theory required to start.',
          },
          {
            title: 'Playable Synth Keyboard',
            body: 'A real polyphonic synth with waveform and ADSR envelope controls, playable with your computer keyboard.',
          },
          {
            title: 'Effects: Reverb, Delay, Sidechain, Wobble',
            body: 'The exact production techniques behind that "pumping" EDM sound and dubstep-style wobble bass — explained and dialed in live.',
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">{f.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-dim)] leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-[var(--color-text-bright)]">New to making music? Start here.</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-dim)] max-w-2xl mx-auto">
          The Lessons walk you through exactly what a kick/snare/hat pattern is, why some notes sound "right" together,
          what a filter and envelope actually do to a sound, and how a real EDM track is arranged from intro to drop —
          then send you straight back into the Studio to try it yourself.
        </p>
        <Link to="/lessons" className="mt-4 inline-block text-sm font-semibold text-[var(--color-neon-cyan)]">
          Browse Lessons &rarr;
        </Link>
      </section>
    </div>
  )
}
