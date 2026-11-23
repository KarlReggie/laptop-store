import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Menu,
  X,
  Laptop,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
  Cpu,
  Monitor,
  HardDrive,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  Clock3,
  Heart,
  Zap,
  Plus,
  Minus,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./index.css";
import { supabase } from "./supabaseClient";
import ContactPage, { PageLoader } from "./ContactPage.jsx";
import HeroLaptop from "./HeroLaptop.jsx";

// Temporary listing link used for every laptop for now.
// Later, each laptop will get its own Facebook post link.
const TEMP_LISTING_LINK = "https://www.facebook.com/share/p/18t2sU9HTS/";

// Fallback / demo data. Used only when Supabase isn't configured yet.
// Once VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, laptops
// come from the `laptops` table instead (see supabase/schema.sql).
const sampleLaptops = [
  {
    id: 1,
    name: "MacBook Air M2",
    brand: "Apple",
    price: 39999,
    condition: "Pre-owned",
    status: "Available",
    processor: "Apple M2",
    ram: "8GB",
    storage: "256GB SSD",
    display: "13.6-inch Retina",
    graphics: "Apple M2 GPU",
    description:
      "A lightweight and powerful MacBook Air, perfect for productivity, students, and everyday use.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000",
    ],
    facebook: "https://www.facebook.com/share/p/18t2sU9HTS/",
    featured: true,
  },
  {
    id: 2,
    name: "Lenovo ThinkPad T14",
    brand: "Lenovo",
    price: 24500,
    condition: "Pre-owned",
    status: "Available",
    processor: "Intel Core i5 11th Gen",
    ram: "16GB",
    storage: "512GB SSD",
    display: "14-inch FHD",
    graphics: "Intel Iris Xe",
    description:
      "A dependable business laptop with excellent performance for office work, multitasking, and productivity.",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: true,
  },
  {
    id: 3,
    name: "ASUS TUF Gaming F15",
    brand: "ASUS",
    price: 38999,
    condition: "Pre-owned",
    status: "Available",
    processor: "Intel Core i5 12th Gen",
    ram: "16GB",
    storage: "512GB SSD",
    display: "15.6-inch 144Hz",
    graphics: "NVIDIA RTX 3050",
    description:
      "A gaming laptop built for demanding tasks, gaming, and creative applications.",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1000",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: true,
  },
  {
    id: 4,
    name: "HP EliteBook 840 G8",
    brand: "HP",
    price: 21999,
    condition: "Pre-owned",
    status: "Reserved",
    processor: "Intel Core i5 11th Gen",
    ram: "16GB",
    storage: "256GB SSD",
    display: "14-inch FHD",
    graphics: "Intel Iris Xe",
    description:
      "A sleek business-class laptop designed for professional work and daily productivity.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: false,
  },
  {
    id: 5,
    name: "Acer Nitro 5",
    brand: "Acer",
    price: 32999,
    condition: "Pre-owned",
    status: "Available",
    processor: "AMD Ryzen 5 5600H",
    ram: "16GB",
    storage: "512GB SSD",
    display: "15.6-inch 144Hz",
    graphics: "NVIDIA GTX 1650",
    description:
      "A capable gaming laptop offering a balance of performance and value.",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: false,
  },
  {
    id: 6,
    name: "Dell Latitude 5420",
    brand: "Dell",
    price: 19999,
    condition: "Pre-owned",
    status: "Available",
    processor: "Intel Core i5 11th Gen",
    ram: "8GB",
    storage: "256GB SSD",
    display: "14-inch FHD",
    graphics: "Intel Iris Xe",
    description:
      "A practical and portable laptop for school, business, and everyday computing.",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: false,
  },
  {
    id: 7,
    name: "MacBook Pro 14 M1 Pro",
    brand: "Apple",
    price: 52999,
    condition: "Pre-owned",
    status: "Available",
    processor: "Apple M1 Pro",
    ram: "16GB",
    storage: "512GB SSD",
    display: "14-inch Liquid Retina XDR",
    graphics: "16-core GPU",
    description:
      "A powerful MacBook for professionals, creators, and demanding workflows.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: false,
  },
  {
    id: 8,
    name: "ASUS VivoBook 15",
    brand: "ASUS",
    price: 17999,
    condition: "New",
    status: "Available",
    processor: "Intel Core i3 12th Gen",
    ram: "8GB",
    storage: "512GB SSD",
    display: "15.6-inch FHD",
    graphics: "Intel UHD Graphics",
    description:
      "A new everyday laptop suitable for students, browsing, and office productivity.",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1000",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000",
    ],
    facebook: TEMP_LISTING_LINK,
    featured: false,
  },
];

const formatPrice = (price) =>
  "₱" + Number(price).toLocaleString("en-PH");

/* ---------- SELLER CHAT SETTINGS ----------
   Replace this with the seller's Facebook username or Page name.
   e.g. facebook.com/juan.delacruz  ->  "juan.delacruz"
*/
const SELLER_MESSENGER_ID = "Karl.lemons";

const buildMessengerUrl = (text, sellerId) =>
  `https://m.me/${sellerId || SELLER_MESSENGER_ID}?text=${encodeURIComponent(text)}`;

// Message sent when the buyer clicks "View seller listing" on a laptop
const buildProductMessage = (product) =>
  `Hi! I'm interested in this laptop:\n\n` +
  `${product.name} (${formatPrice(product.price)})\n` +
  (product.facebook ? `Listing: ${product.facebook}\n` : "") +
  `\n` +
  `Is it still available?`;

// Message sent from the sticky "Chat with seller" button
const buildGeneralMessage = () =>
  `Hi! I found your laptops on LAPTOP SHOP PH and I have a question.\n` +
  `${window.location.href}`;

/* ---------- PAGINATION ---------- */
const PAGE_SIZE = 6; // laptops per page

// Builds [1, "...", 4, 5, 6, "...", 12] style page lists
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

/* ---------- SUPABASE ----------
   Converts a row from the `laptops` table (snake_case) into the
   shape this app uses. Keep this in sync with supabase/schema.sql.
*/
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000";

const mapRowToLaptop = (row) => ({
  id: row.id,
  name: row.name ?? "Untitled laptop",
  brand: row.brand ?? "Other",
  price: row.price ?? 0,
  condition: row.condition ?? "Pre-owned",
  status: row.status ?? "Available",
  processor: row.processor ?? "",
  ram: row.ram ?? "",
  storage: row.storage ?? "",
  display: row.display ?? "",
  graphics: row.graphics ?? "",
  description: row.description ?? "",
  images:
    Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : [PLACEHOLDER_IMAGE],
  facebook: row.facebook_url ?? "",
  sellerMessenger: row.seller_messenger ?? "",
  featured: Boolean(row.featured),
});

function App() {
  const [products, setProducts] = useState(supabase ? [] : sampleLaptops);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All Brands");
  const [condition, setCondition] = useState("All Conditions");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  // Simple page switching: "home" | "loading" | "contact"
  const [view, setView] = useState(() =>
    window.location.hash === "#contact-page" ? "contact" : "home"
  );

  // Dark mode is the default theme
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });

  // Load laptops from Supabase (if configured)
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("laptops")
        .select("*")
        // Only published listings are shown to buyers (hides Draft and Sold)
        .eq("listing_status", "Posted")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Supabase error:", error);
        setLoadError("We couldn't load the laptops right now. Please try again later.");
      } else {
        setProducts((data || []).map(mapRowToLaptop));
        setLoadError("");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Go back to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, brand, condition, availability, sort]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable, ignore */
    }
  }, [theme]);

  const goToContact = (e) => {
    if (e) e.preventDefault();
    setMobileMenu(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setView("loading");
    window.history.pushState({ view: "contact" }, "", "#contact-page");
    setTimeout(() => setView("contact"), 500);
  };

  const goHome = () => {
    if (window.location.hash === "#contact-page") {
      window.history.back();
    } else {
      setView("home");
    }
  };

  // Browser back/forward buttons
  useEffect(() => {
    const onPop = () =>
      setView(window.location.hash === "#contact-page" ? "contact" : "home");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  };

  // Messenger doesn't always pre-fill the text, so we also copy it
  // to the clipboard as a backup the buyer can paste.
  const copyMessage = async (text) => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      // Fallback for browsers/pages where the Clipboard API is blocked
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        copied = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* ignore */
      }
    }
    showToast(
      copied
        ? "Inquiry copied! If the chat box is empty, just paste (Ctrl+V / long-press) and send."
        : "Couldn't copy automatically. Please mention the laptop name in your message."
    );
  };

  // Brands are built from the laptops themselves, so when the seller
  // adds a new brand it shows up automatically.
  const brands = useMemo(
    () => [
      "All Brands",
      ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b)
      ),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const term = search.toLowerCase().trim();

      const matchesSearch =
        !term ||
        [
          product.name,
          product.brand,
          product.processor,
          product.ram,
          product.storage,
          product.graphics,
        ].some((value) => String(value ?? "").toLowerCase().includes(term));

      const matchesBrand =
        brand === "All Brands" || product.brand === brand;

      const matchesCondition =
        condition === "All Conditions" ||
        product.condition === condition;

      const matchesAvailability =
        availability === "All" ||
        product.status === availability;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCondition &&
        matchesAvailability
      );
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else {
      result.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return result;
  }, [products, search, brand, condition, availability, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  const goToPage = (n) => {
    setPage(Math.min(Math.max(1, n), totalPages));
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setActiveImage(0);
  };

  const resetFilters = () => {
    setSearch("");
    setBrand("All Brands");
    setCondition("All Conditions");
    setAvailability("All");
    setSort("featured");
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  if (view === "loading") return <PageLoader label="Loading" />;
  if (view === "contact")
    return <ContactPage onBack={goHome} />;

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <a href="#home" className="brand-logo">
            <span className="logo-icon">
              <Laptop size={23} strokeWidth={2.2} />
            </span>
            <span className="logo-text">
              LAPTOP SHOP <span>PH.</span>
              <small>YOUR NEXT UPGRADE</small>
            </span>
          </a>

          <nav className={`nav ${mobileMenu ? "nav-open" : ""}`}>
            <a
              href="#home"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </a>
            <a
              href="#shop"
              onClick={() => setMobileMenu(false)}
            >
              Shop Laptops
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenu(false)}
            >
              About
            </a>
            <a href="#contact-page" onClick={goToContact}>
              Contact
            </a>
          </nav>

          <div className="header-actions">
            <div className="theme-toggle" role="group" aria-label="Color theme">
              <button
                className={theme === "light" ? "active" : ""}
                onClick={() => setTheme("light")}
                aria-label="Light mode"
                aria-pressed={theme === "light"}
              >
                <Sun size={15} />
                <span>Light</span>
              </button>
              <button
                className={theme === "dark" ? "active" : ""}
                onClick={() => setTheme("dark")}
                aria-label="Dark mode"
                aria-pressed={theme === "dark"}
              >
                <Moon size={15} />
                <span>Dark</span>
              </button>
            </div>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle navigation"
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="container hero-inner">
            <div className="hero-content">
              <div className="hero-tag">
                <span className="live-dot"></span>
                FIND YOUR NEXT LAPTOP
              </div>

              <h1>
                The right laptop.
                <br />
                <span>The right price.</span>
              </h1>

              <p>
                Explore quality laptops from trusted listings.
                Find the perfect device for work, school, gaming,
                and everything in between.
              </p>

              <div className="hero-buttons">
                <a href="#shop" className="primary-btn">
                  Explore laptops <ArrowRight size={18} />
                </a>
                <a href="#about" className="secondary-btn">
                  Learn more
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <CheckCircle2 size={17} />
                  <span>Seller-listed products</span>
                </div>
                <div className="trust-item">
                  <ShieldCheck size={17} />
                  <span>Clear product details</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <HeroLaptop
                items={products.filter((p) => p.featured && p.images)}
              />
              <div className="hero-decoration"></div>
            </div>
          </div>
          <div className="hero-bottom-line"></div>
        </section>

        {/* SHOP */}
        <section className="shop-section" id="shop">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">OUR COLLECTION</div>
                <h2>Explore laptops.</h2>
                <p>
                  Find a laptop that fits your needs and budget.
                </p>
              </div>
              <div className="collection-count">
                <span>{filteredProducts.length}</span> laptops found
              </div>
            </div>

            {/* SEARCH */}
            <div className="search-bar">
              <Search size={21} />
              <input
                type="text"
                placeholder="Search laptop model, brand, processor or specs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  <X size={18} />
                </button>
              )}
              <button
                className={`filter-toggle ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>
            </div>

            {/* FILTERS */}
            <div className={`filters ${showFilters ? "filters-visible" : ""}`}>
              <div className="filter-group">
                <label>Brand</label>
                <div className="select-wrap">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    {brands.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>

              <div className="filter-group">
                <label>Condition</label>
                <div className="select-wrap">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option>All Conditions</option>
                    <option>New</option>
                    <option>Pre-owned</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>

              <div className="filter-group">
                <label>Availability</label>
                <div className="select-wrap">
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>

              <div className="filter-group sort-group">
                <label>Sort by</label>
                <div className="select-wrap">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Recently added</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>

              <button className="reset-btn" onClick={resetFilters}>
                Reset filters
              </button>
            </div>

            {/* BRAND SHORTCUTS */}
            <div className="brand-shortcuts">
              {brands.map((item) => (
                <button
                  key={item}
                  className={`brand-chip ${
                    brand === item ? "selected" : ""
                  }`}
                  onClick={() => setBrand(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* PRODUCT GRID */}
            {loading ? (
              <div className="empty-state">
                <h3>Loading laptops…</h3>
                <p>Please wait a moment.</p>
              </div>
            ) : loadError ? (
              <div className="empty-state">
                <h3>Something went wrong</h3>
                <p>{loadError}</p>
                <button
                  className="primary-btn"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
              <div className="product-grid">
                {pagedProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div
                      className="product-image"
                      onClick={() => openProduct(product)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                      />

                      <div className="image-badges">
                        <span
                          className={`status-badge ${
                            product.status === "Available"
                              ? "available"
                              : "reserved"
                          }`}
                        >
                          <span></span>
                          {product.status}
                        </span>
                        <span className="condition-badge">
                          {product.condition}
                        </span>
                      </div>

                      <button
                        className={`favorite-btn ${
                          favorites.includes(product.id) ? "favorited" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          size={18}
                          fill={
                            favorites.includes(product.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>

                    <div className="product-info">
                      <div className="product-brand">{product.brand}</div>
                      <h3>{product.name}</h3>

                      <div className="product-price">
                        {formatPrice(product.price)}
                      </div>

                      <div className="product-specs">
                        <span><Cpu size={14} /> {product.processor}</span>
                        <span><Monitor size={14} /> {product.ram} RAM</span>
                        <span><HardDrive size={14} /> {product.storage}</span>
                      </div>

                      <div className="product-card-bottom">
                        <button
                          className="details-btn"
                          onClick={() => openProduct(product)}
                        >
                          View details <ArrowUpRight size={16} />
                        </button>
                        <span className="product-id">
                          #{String(product.id).padStart(3, "0")}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Laptop pages">
                  <button
                    className="page-btn page-arrow"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((item, i) =>
                    item === "..." ? (
                      <span key={`dots-${i}`} className="page-dots">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        className={`page-btn ${
                          item === currentPage ? "active" : ""
                        }`}
                        onClick={() => goToPage(item)}
                        aria-label={`Page ${item}`}
                        aria-current={item === currentPage ? "page" : undefined}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <button
                    className="page-btn page-arrow"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              )}

              <p className="pagination-info">
                Showing {pageStart + 1}–
                {Math.min(pageStart + PAGE_SIZE, filteredProducts.length)} of{" "}
                {filteredProducts.length} laptops
              </p>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Search size={30} />
                </div>
                <h3>No laptops found</h3>
                <p>
                  Try another search or adjust your filters to find
                  what you're looking for.
                </p>
                <button className="primary-btn" onClick={resetFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <div className="container about-inner">
            <div className="about-content">
              <div className="eyebrow">ABOUT LAPTOP SHOP PH</div>
              <h2>
                Your search for the right laptop starts here.
              </h2>
              <p>
                LAPTOP SHOP PH makes it easier to discover available
                laptops in one place. Explore product details,
                compare specifications, check availability, and
                visit the seller's original listing.
              </p>
              <a href="#shop" className="about-link">
                Start exploring <ArrowRight size={17} />
              </a>
            </div>
            <div className="about-visual">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000"
                alt="Workspace with laptops"
                loading="lazy"
              />
              <div className="about-caption">
                <Laptop size={22} />
                <div>
                  <strong>Find the right fit.</strong>
                  <span>Work. Study. Create. Play.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact-section" id="contact">
          <div className="container contact-inner">
            <div>
              <div className="eyebrow">READY TO FIND YOUR LAPTOP?</div>
              <h2>Let's find your next upgrade.</h2>
              <p>
                Explore the listings and connect with the seller
                through their original Facebook listing.
              </p>
            </div>
            <a href="#contact-page" className="contact-btn" onClick={goToContact}>
              Contact the seller <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <a href="#home" className="brand-logo footer-logo">
            <span className="logo-icon">
              <Laptop size={22} />
            </span>
            <span className="logo-text">
              LAPTOP SHOP <span>PH.</span>
              <small>YOUR NEXT UPGRADE</small>
            </span>
          </a>

          <p>© {new Date().getFullYear()} LAPTOP SHOP PH. All rights reserved.</p>

          <a href="#home" className="back-top">
            Back to top ↑
          </a>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeProduct}>
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeProduct}
              aria-label="Close details"
            >
              <X size={21} />
            </button>

            <div className="modal-content">
              <div className="modal-gallery">
                <div className="modal-main-image">
                  <img
                    src={selectedProduct.images[activeImage]}
                    alt={selectedProduct.name}
                  />
                </div>
                <div className="modal-thumbnails">
                  {selectedProduct.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${
                        activeImage === index ? "thumbnail-active" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={image} alt={`${selectedProduct.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-details">
                <div className="modal-brand">
                  {selectedProduct.brand}
                </div>
                <h2>{selectedProduct.name}</h2>

                <div className="modal-badges">
                  <span
                    className={`status-badge ${
                      selectedProduct.status === "Available"
                        ? "available"
                        : "reserved"
                    }`}
                  >
                    <span></span>
                    {selectedProduct.status}
                  </span>
                  <span className="condition-badge">
                    {selectedProduct.condition}
                  </span>
                </div>

                <div className="modal-price">
                  {formatPrice(selectedProduct.price)}
                </div>

                <p className="modal-description">
                  {selectedProduct.description}
                </p>

                <div className="specification-heading">
                  <h3>Specifications</h3>
                </div>

                <div className="specification-list">
                  <div>
                    <span>Processor</span>
                    <strong>{selectedProduct.processor}</strong>
                  </div>
                  <div>
                    <span>Memory (RAM)</span>
                    <strong>{selectedProduct.ram}</strong>
                  </div>
                  <div>
                    <span>Storage</span>
                    <strong>{selectedProduct.storage}</strong>
                  </div>
                  <div>
                    <span>Display</span>
                    <strong>{selectedProduct.display}</strong>
                  </div>
                  <div>
                    <span>Graphics</span>
                    <strong>{selectedProduct.graphics}</strong>
                  </div>
                  <div>
                    <span>Condition</span>
                    <strong>{selectedProduct.condition}</strong>
                  </div>
                </div>

                {selectedProduct.status === "Available" ? (
                  <a
                    href={buildMessengerUrl(
                      buildProductMessage(selectedProduct),
                      selectedProduct.sellerMessenger
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="facebook-btn"
                    onClick={() =>
                      copyMessage(buildProductMessage(selectedProduct))
                    }
                  >
                    View seller listing <MessageCircle size={17} />
                  </a>
                ) : (
                  <button className="reserved-btn" disabled>
                    <Clock3 size={17} /> Currently reserved
                  </button>
                )}

                <p className="modal-note">
                  Clicking the button opens Messenger with the seller.
                  If the message box is empty, paste the copied inquiry
                  (it includes this laptop's listing link) and send it,
                  so the seller knows what you're asking about. Product
                  details and availability are provided by the seller.
                  Please confirm availability and condition directly
                  with the seller before purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY CHAT WITH SELLER */}
      <a
        href={buildMessengerUrl(buildGeneralMessage())}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-fab"
        aria-label="Chat with seller"
        onClick={() => copyMessage(buildGeneralMessage())}
      >
        <MessageCircle size={22} />
        <span>Chat with seller</span>
      </a>

      {/* TOAST */}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;