import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Flame, Info, Mail, PhoneCall } from "lucide-react";
import { searchExternalRecipes } from "../../services/api";
import SignInModal from "../auth/SignInModal";
import SignUpModal from "../auth/SignUpModal";
import "./home.css";
import "../auth/auth.css";

const TRENDING_KEY = "recipeapp.trendingVideos.v1";

const contactCards = [
  {
    title: "Studio mail",
    contact: "hello@recipeapp.com",
    support: "We reply within 24 hours.",
    icon: Mail,
    href: "mailto:hello@recipeapp.com?subject=RecipeApp%20studio%20note",
  },
  {
    title: "Kitchen line",
    contact: "+1 (555) 201-8743",
    support: "Mon–Fri, 9a–6p PT for partner calls.",
    icon: PhoneCall,
    href: "tel:+15552018743",
  },
  {
    title: "Feedback & tips",
    contact: "tips@recipeapp.com",
    support: "We highlight the freshest ideas on every update.",
    icon: Info,
    href: "mailto:tips@recipeapp.com?subject=Recipe%20idea%20or%20feedback",
    hideEmail: true,
  },
];

const loadTrending = () => {
  try {
    const raw = localStorage.getItem(TRENDING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", message: "" });
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const trimmedSearchTerm = searchTerm.trim();
  const location = useLocation();

  useEffect(() => {
    setTrending(loadTrending());
  }, []);

  useEffect(() => {
    if (!trimmedSearchTerm) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }
    let canceled = false;
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchExternalRecipes(trimmedSearchTerm);
        if (canceled) return;
        setSearchResults(Array.isArray(results) ? results : []);
        setSearchError("");
      } catch (err) {
        if (canceled) return;
        setSearchError("Unable to load recipes from TheMealDB.");
        setSearchResults([]);
      } finally {
        if (!canceled) {
          setSearchLoading(false);
        }
      }
    }, 400);

    return () => {
      canceled = true;
      clearTimeout(timer);
    };
  }, [trimmedSearchTerm]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.dispatchEvent(new CustomEvent("recipeappActiveSection", { detail: id }));
    }
  }, [location.hash]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return undefined;
    const sections = document.querySelectorAll("[data-nav-section]");
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.dispatchEvent(
              new CustomEvent("recipeappActiveSection", { detail: entry.target.id })
            );
          }
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    window.dispatchEvent(new CustomEvent("recipeappActiveSection", { detail: "home" }));

    return () => observer.disconnect();
  }, []);

  const visibleTrending = (trending || []).filter((item) => item && item.ytId);

  const openFeedback = () => {
    setFeedbackSent(false);
    setFeedbackOpen(true);
  };

  const closeFeedback = () => setFeedbackOpen(false);

  const handleFeedbackChange = (field) => (event) => {
    setFeedbackForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();
    setFeedbackSent(true);
    setFeedbackForm({ name: "", email: "", message: "" });
    setTimeout(() => setFeedbackOpen(false), 900);
  };

  const openSignIn = () => {
    setSignInOpen(true);
    setSignUpOpen(false);
  };

  const closeSignIn = () => setSignInOpen(false);

  const openSignUp = () => {
    setSignUpOpen(true);
    setSignInOpen(false);
  };

  const closeSignUp = () => setSignUpOpen(false);

  return (
    <div className="home-page">
      <section className="home-search" id="home" data-nav-section>
        <div className="home-search__bar">
          <input
            type="text"
            placeholder="Search recipes"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </section>

      {trimmedSearchTerm && (
        <section className="home-search-results" aria-live="polite">
          <header className="home-search-results__header">
            <div>
              <p className="home-section__overline">Online search</p>
              <h2>Recipes from TheMealDB</h2>
              <p className="home-search-results__term">
                Showing results for “{trimmedSearchTerm}”
              </p>
            </div>
          </header>
          {searchLoading ? (
            <p className="home-search-results__status">Searching recipes…</p>
          ) : searchError ? (
            <p className="home-search-results__status home-search-results__status--error">
              {searchError}
            </p>
          ) : searchResults.length === 0 ? (
            <p className="home-search-results__status">
              No online recipes matched “{trimmedSearchTerm}”. Try another keyword.
            </p>
          ) : (
            <div className="home-search-results__grid">
              {searchResults.map((recipe) => (
                <article key={recipe._id || recipe.externalId} className="home-search-card">
                  <div className="home-search-card__media">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} loading="lazy" />
                    ) : (
                      <div className="home-search-card__placeholder">No image</div>
                    )}
                  </div>
                  <div className="home-search-card__body">
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description || recipe.instructions}</p>
                    <div className="home-search-card__meta">
                      {recipe.servings && <span>{recipe.servings} servings</span>}
                      {recipe.cookTime ? <span>{recipe.cookTime} min</span> : null}
                    </div>
                    <div className="home-search-card__actions">
                      {recipe.video && (
                        <a
                          href={recipe.video}
                          target="_blank"
                          rel="noreferrer"
                          className="home-search-card__action"
                        >
                          Watch video
                        </a>
                      )}
                      <a
                        href={`https://www.themealdb.com/meal.php?c=${encodeURIComponent(
                          recipe.externalId
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="home-search-card__action home-search-card__action--primary"
                      >
                        View recipe
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="home-cta">
        <div className="home-cta__content">
          <p className="home-section__overline">Start cooking</p>
          <h2>Organize your kitchen flow</h2>
          <p>
            Collect recipes, plan meals, and keep your grocery notes synced. Sign in to save your
            favorites across devices.
          </p>
          <div className="home-cta__actions">
            <button type="button" className="home-cta__button" onClick={openSignIn}>
              Get started
            </button>
          </div>
        </div>

        {signInOpen ? (
          <SignInModal open={signInOpen} onClose={closeSignIn} onSwitch={openSignUp} />
        ) : null}

        {signUpOpen ? (
          <SignUpModal open={signUpOpen} onClose={closeSignUp} onSwitch={openSignIn} />
        ) : null}
      </section>

      <section className="home-trending">
        <header className="home-trending__header">
          <Flame size={24} />
          <div>
            <p className="home-section__overline">Trending</p>
            <h2>Chef cues worth saving</h2>
          </div>
        </header>
        {visibleTrending.length > 0 ? (
          <div className="home-trending__grid">
            {visibleTrending.slice(0, 6).map((video) => (
              <article key={video.id || video.ytId} className="home-trending__card">
                <div className="home-trending__video">
                  <iframe
                    title={video.name || "Chef highlight"}
                    src={`https://www.youtube.com/embed/${video.ytId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="home-trending__meta">
                  <h3>{video.name || "Chef highlight"}</h3>
                  {video.subtitle && <p>{video.subtitle}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="home-trending__empty">Save videos to fill this space with fresh cues.</p>
        )}
      </section>

      <section id="about-us" data-nav-section className="home-about">
        <div className="home-about__content">
          <p className="home-section__overline">About Us</p>
          <p className="home-about__summary">
           Our recipe app is a platform that brings together community-created recipes 
           and recipes sourced from the internet, giving users a single place to discover, 
           share, and explore a wide variety of dishes. Users can add and manage their own recipes 
           while also browsing a rich collection of external recipes through integrated APIs, 
           making it easy to find inspiration for any meal. Designed with simplicity and usability in mind,
            the app supports both creativity and discovery, helping users cook confidently whether they are 
            sharing personal favorites or exploring new cuisines from around the world.
          </p>
        </div>
      </section>

      <section id="contact" data-nav-section className="home-contact">
        <div className="home-contact__header">
          <p className="home-section__overline">Support</p>
          <h2>Get Support</h2>
          <p>Pick the quickest channel for your ask.</p>
        </div>
        <div className="home-contact__cards">
          {contactCards.map((card) => {
            const Icon = card.icon;
            const isFeedbackCard = card.title === "Feedback & tips";
            const cardProps = isFeedbackCard
              ? {
                  role: "button",
                  tabIndex: 0,
                  onClick: openFeedback,
                  onKeyDown: (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openFeedback();
                    }
                  },
                }
              : {};
            return (
              <article key={card.title} className="home-contact-card" {...cardProps}>
                <Icon size={28} className="home-contact-card__icon" />
                <h3>{card.title}</h3>
                {!card.hideEmail && card.contact ? (
                  <a href={card.href || `mailto:${card.contact}`} className="home-contact-card__email">
                    {card.contact}
                  </a>
                ) : null}
                <p>{card.support}</p>
                {isFeedbackCard ? <span className="home-contact-card__cta">Open form</span> : null}
              </article>
            );
          })}
        </div>

        {feedbackOpen ? (
          <div className="home-feedback-modal" role="dialog" aria-modal="true" aria-label="Feedback form">
            <div className="home-feedback-modal__backdrop" onClick={closeFeedback} />
            <div className="home-feedback-modal__card">
              <div className="home-feedback-modal__head">
                <div>
                  <p className="home-section__overline">Feedback</p>
                  <h3>Tell us what to improve</h3>
                  <p className="home-feedback-modal__sub">We read every note and usually reply within one business day.</p>
                </div>
                <button type="button" className="home-feedback-modal__close" onClick={closeFeedback} aria-label="Close feedback form">
                  ×
                </button>
              </div>
              <form className="home-feedback-form" onSubmit={handleFeedbackSubmit}>
                <label className="home-feedback-form__field">
                  <span>Name (optional)</span>
                  <input
                    type="text"
                    value={feedbackForm.name}
                    onChange={handleFeedbackChange("name")}
                    placeholder="Your name"
                  />
                </label>
                <label className="home-feedback-form__field">
                  <span>Email (optional)</span>
                  <input
                    type="email"
                    value={feedbackForm.email}
                    onChange={handleFeedbackChange("email")}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="home-feedback-form__field">
                  <span>Your feedback</span>
                  <textarea
                    value={feedbackForm.message}
                    onChange={handleFeedbackChange("message")}
                    placeholder="Share ideas, bugs, or requests..."
                    required
                  />
                </label>
                <div className="home-feedback-form__actions">
                  <button type="submit" className="home-feedback-form__submit">Submit feedback</button>
                  <button type="button" className="home-feedback-form__cancel" onClick={closeFeedback}>
                    Cancel
                  </button>
                </div>
                {feedbackSent ? <p className="home-feedback-form__status">Thanks! We received your note.</p> : null}
              </form>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Home;
