import { useEffect, useMemo, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const THEMES = [
  'Nature', 'Urban', 'Portrait', 'Technology', 'Food', 'Travel', 'Business', 'Abstract'
];

export default function Catalog() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [orientation, setOrientation] = useState('');
  const [themes, setThemes] = useState([]);
  const [price, setPrice] = useState([0, 500]);

  const themeParam = useMemo(() => themes.join(','), [themes]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchPhotos() {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (orientation) params.set('orientation', orientation);
      if (themeParam) params.set('themes', themeParam);
      if (price[0] > 0) params.set('min_price', String(price[0]));
      if (price[1] < 500) params.set('max_price', String(price[1]));
      try {
        const res = await fetch(`${BACKEND_URL}/api/photos?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
    return () => controller.abort();
  }, [query, orientation, themeParam, price]);

  function toggleTheme(t) {
    setThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  return (
    <section className="bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-semibold">Explore the catalog</h2>
            <p className="text-blue-200/80 mt-1">Filter by themes, orientation and price.</p>
          </div>
          <div className="w-full md:w-auto grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-blue-300/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search photos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="">Any orientation</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
            </select>
            <div className="flex items-center gap-2 text-blue-200/80">
              <input type="number" min={0} max={500} value={price[0]} onChange={(e)=>setPrice([Number(e.target.value), price[1]])} className="w-24 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none"/>
              <span>-</span>
              <input type="number" min={0} max={500} value={price[1]} onChange={(e)=>setPrice([price[0], Number(e.target.value)])} className="w-24 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none"/>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {THEMES.map(t => (
            <button
              key={t}
              className={`px-3 py-1 rounded-full border ${themes.includes(t) ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-blue-200 border-slate-700'} hover:border-blue-500 transition`}
              onClick={() => toggleTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-slate-800 animate-pulse" />
            ))
          ) : photos.length === 0 ? (
            <div className="col-span-full text-center text-blue-200/80">No photos match your filters yet.</div>
          ) : (
            photos.map((p) => (
              <figure key={p.id || p.url} className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
                <img src={p.thumbnail_url || p.url} alt={p.title} className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-blue-200/80">${p.price?.toFixed?.(2) ?? '0.00'} • {p.orientation}</div>
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
