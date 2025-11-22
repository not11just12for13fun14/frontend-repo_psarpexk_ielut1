import { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Dashboard() {
  const [tab, setTab] = useState('seller');
  const [form, setForm] = useState({
    title: '',
    description: '',
    url: '',
    thumbnail_url: '',
    themes: '',
    tags: '',
    orientation: 'landscape',
    price: 0,
    seller_id: 'demo-seller-1',
    is_public: true,
  });
  const [myPhotos, setMyPhotos] = useState([]);

  async function submit(e){
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      themes: form.themes ? form.themes.split(',').map(s=>s.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(',').map(s=>s.trim()).filter(Boolean) : [],
    };
    const res = await fetch(`${BACKEND_URL}/api/seller/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setForm({ ...form, title:'', description:'', url:'', thumbnail_url:'', themes:'', tags:'', price:0 });
      loadMyPhotos();
    }
  }

  async function loadMyPhotos() {
    const res = await fetch(`${BACKEND_URL}/api/seller/photos?seller_id=${encodeURIComponent(form.seller_id)}`);
    const data = await res.json();
    setMyPhotos(Array.isArray(data) ? data : []);
  }

  useEffect(()=>{ loadMyPhotos(); }, []);

  return (
    <section className="bg-slate-950 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-semibold">Private Cabinets</h2>
          <div className="bg-slate-800 rounded-lg p-1">
            <button onClick={()=>setTab('seller')} className={`px-3 py-1 rounded-md text-sm ${tab==='seller'?'bg-blue-600 text-white':'text-blue-200'}`}>Seller</button>
            <button onClick={()=>setTab('customer')} className={`px-3 py-1 rounded-md text-sm ${tab==='customer'?'bg-blue-600 text-white':'text-blue-200'}`}>Customer</button>
          </div>
        </div>

        {tab==='seller' ? (
          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={submit} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">Upload new photo</h3>
              <div className="grid grid-cols-2 gap-3">
                <input className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
                <input className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
                <input className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Image URL" value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/>
                <input className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Thumbnail URL (optional)" value={form.thumbnail_url} onChange={e=>setForm({...form,thumbnail_url:e.target.value})}/>
                <input className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Themes (comma separated)" value={form.themes} onChange={e=>setForm({...form,themes:e.target.value})}/>
                <input className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
                <select className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" value={form.orientation} onChange={e=>setForm({...form,orientation:e.target.value})}>
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
                <input type="number" min={0} step="0.01" className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
                <input className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700" placeholder="Seller ID" value={form.seller_id} onChange={e=>setForm({...form,seller_id:e.target.value})}/>
                <label className="flex items-center gap-2 text-blue-200 mt-1">
                  <input type="checkbox" checked={form.is_public} onChange={e=>setForm({...form,is_public:e.target.checked})}/>
                  Public
                </label>
                <button className="col-span-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
              </div>
            </form>

            <div>
              <h3 className="text-white font-medium mb-4">Your uploads</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {myPhotos.map(p => (
                  <figure key={p.id || p.url} className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img src={p.thumbnail_url || p.url} alt={p.title} className="w-full h-full object-cover aspect-[4/3]" />
                    <figcaption className="p-2 text-xs text-blue-200/80">{p.title}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-medium mb-2">Customer cabinet</h3>
            <p className="text-blue-200/80">Browse your purchased images and invoices (placeholder UI). Purchasing flows can be added next.</p>
          </div>
        )}
      </div>
    </section>
  );
}
