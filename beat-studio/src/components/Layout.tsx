import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/studio', label: 'Studio' },
  { to: '/lessons', label: 'Lessons' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-[var(--color-text-bright)] font-bold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--color-neon-purple)] to-[var(--color-neon-pink)] text-white text-sm">
              ♪
            </span>
            <span>Beat Studio</span>
          </NavLink>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-neon-purple)]'
                      : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] py-5">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-[var(--color-text-dim)]">
          Beat Studio — make a beat, learn how it works, all in your browser. Projects are saved locally.
        </div>
      </footer>
    </div>
  )
}
