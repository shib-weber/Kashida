import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/storeData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // API call to local backend search endpoint
      const res = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      console.log("Search Results:", data);
    } catch {
      console.log("Offline mode: Search submitted for:", searchQuery);
    }

    // Optionally navigate or close search bar after submission
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className={`nav${scrolled ? " nav--solid" : " nav--solid"}`}>
      <div className="nav__inner relative z-20">
        <Link 
          to="/" 
          className={`nav__logo font-serif text-xl tracking-[0.22em] transition-colors duration-400 ${
            scrolled ? "text-amber-900" : "text-amber-400"
          }`}
        >
          Kashida
        </Link>

        <nav className="nav__links">
          {NAV_LINKS.map((l) => (
            <Link key={l} to="/" className="nav__link">
              {l}
            </Link>
          ))}
        </nav>

        <div className="nav__icons">
          {/* Search Toggle Button */}
          <button 
            className="icon-btn nav__search-btn" 
            aria-label="Search"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>

          {/* Wishlist / Liked Items Route */}
          <Link to="/likes" className="icon-btn icon-btn--badge" aria-label="Wishlist" data-badge="0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-7.5-4.6-10-9.1C.5 8.2 2.4 5 6 5c2 0 3.5 1.1 4.5 2.7.9.9 1.5 0 2.4 0C13.9 6.1 15.4 5 17.4 5c3.6 0 5.5 3.2 4 6.9C19.9 16.4 12 21 12 21z" />
            </svg>
          </Link>

          {/* Account / Settings Route */}
          <Link to="/auth" className="icon-btn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" />
            </svg>
          </Link>

          {/* Dashboard Route */}
          <Link to="/my_cart" className="icon-btn icon-btn--badge" aria-label="Shopping bag" data-badge="5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l-1 13H7L6 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </Link>

          {/* Mobile Menu Burger */}
          <button className="icon-btn nav__burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slide-out Search Panel (Appears from bottom/behind topbar) */}
      <div 
        className={`w-full bg-[#2C0812] border-b border-[#C89B3C]/30 transition-all duration-300 ease-in-out overflow-hidden ${
          searchOpen ? "max-h-24 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto px-6 flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our luxury collection..."
            className="flex-1 bg-[#FBF3E7]/10 border border-[#C89B3C]/40 text-[#FBF3E7] placeholder-[#FBF3E7]/50 text-xs px-4 py-2 font-['Jost',sans-serif] focus:outline-none focus:border-[#C89B3C]"
          />
          <button
            type="submit"
            className="bg-[#C89B3C] text-[#2C0812] px-5 py-2 font-['Cinzel',serif] text-[11px] uppercase tracking-widest hover:bg-[#E8CB86] transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="text-[#FBF3E7]/70 hover:text-[#FBF3E7] text-sm px-2"
          >
            ✕
          </button>
        </form>
      </div>

      {/* Mobile Drawer Navigation */}
      {open && (
        <div className="nav__mobile">
          {NAV_LINKS.map((l) => (
            <Link key={l} to="/" onClick={() => setOpen(false)}>
              {l}
            </Link>
          ))}
          <Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link>
          <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/settings" onClick={() => setOpen(false)}>Account Settings</Link>
          <Link to="/likes" onClick={() => setOpen(false)}>Saved Wishlist</Link>
        </div>
      )}
    </header>
  );
}