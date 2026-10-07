import { ArrowLeft, Compass } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-20 text-center">
      <section aria-labelledby="not-found-title" className="max-w-lg">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-700">
          <Compass size={34} weight="duotone" />
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-blue-700">404</p>
        <h1 id="not-found-title" className="mt-2 font-heading text-3xl font-black text-slate-950 sm:text-4xl">This route is not on the itinerary</h1>
        <p className="mt-4 text-sm font-medium leading-6 text-slate-600">The page may have moved or the address may be incorrect. Return home to continue exploring verified travel partners and packages.</p>
        <Link to="/" className="mx-auto mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
          <ArrowLeft size={17} weight="bold" /> Return home
        </Link>
      </section>
    </main>
  );
}
