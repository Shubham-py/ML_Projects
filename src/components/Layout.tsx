import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/algorithms', label: 'Algorithms' },
  { to: '/projects', label: 'Projects' },
  { to: '/interview-prep', label: 'Interview Prep' },
  { to: '/sql-practice', label: 'SQL Lab' },
  { to: '/python-practice', label: 'Python Lab' },
  { to: '/practice', label: 'Quiz' },
  { to: '/roadmap', label: 'Roadmap' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-[var(--color-text-bright)] font-bold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent2)] text-[#0b0d12] text-sm">
              ML
            </span>
            <span>DS Interview Lab</span>
          </NavLink>

          <nav className="hidden lg:flex items-center flex-wrap justify-end gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="lg:hidden rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text)]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-[var(--color-border)] px-4 py-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-dim)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-[var(--color-text-dim)]">
          Built for deep, interview-ready ML/DS prep — startups to big tech in India. Your progress is saved locally in this browser.
        </div>
      </footer>
    </div>
  )
}
