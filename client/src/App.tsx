import NotFound from './pages/NotFound';
import { Routes, Route, NavLink, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import NewWish from "./pages/NewWish";
import WishDetails from "./pages/WishDetails";
import { AuthProvider } from "./context/AuthContext";
import { useDarkMode } from "./hooks/useDarkMode";

export default function App() {
  const [isDark, toggleDark] = useDarkMode();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        <header className="border-b border-neutral-200 dark:border-neutral-800/60 px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <Link to="/" className="text-2xl font-semibold">
              Wishful
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  (isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-neutral-600 dark:text-neutral-300") +
                  " hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                }
              >
                Wish Feed
              </NavLink>
              <NavLink
                to="/new"
                className={({ isActive }) =>
                  "rounded-md px-3 py-1 font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition " +
                  (isActive ? "opacity-80" : "")
                }
              >
                Post Wish
              </NavLink>
              <button
                aria-label="Toggle dark mode"
                onClick={toggleDark}
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
              >
                {isDark ? "🌞" : "🌙"}
              </button>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewWish />} />
          <Route path="/wish/:id" element={<WishDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
