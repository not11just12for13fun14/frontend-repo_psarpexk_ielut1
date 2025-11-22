import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-14">
        <Hero />
        <div id="catalog">
          <Catalog />
        </div>
        <div id="cabinet">
          <Dashboard />
        </div>
        <section id="about" className="bg-slate-950 py-16 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-white text-2xl font-semibold">About</h2>
            <p className="text-blue-200/80 mt-3 max-w-3xl">
              A clean, modern photo agency experience. Curated thematics, fast filters, and private spaces for both sellers and customers. Built with a black, light blue and white palette.
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-black border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6 text-blue-200/70 text-sm">
          © {new Date().getFullYear()} BlueBank — Modern Photo Catalog
        </div>
      </footer>
    </div>
  )
}

export default App
