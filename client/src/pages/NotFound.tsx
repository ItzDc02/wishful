import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-6 text-neutral-600 dark:text-neutral-300">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="rounded-md px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
