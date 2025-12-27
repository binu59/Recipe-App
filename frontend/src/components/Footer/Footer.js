import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: "About", href: "#about" },
    { label: "Collections", href: "#collections" },
    { label: "Submit a recipe", href: "#submit" },
  ];

  const supportLinks = [
    { label: "Help center", href: "#help" },
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
  ];

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__eyebrow">RecipeApp</p>
          <h3 className="footer__title">Cook something worth sharing.</h3>
          <p className="footer__copy">
            Curated recipes, trusted techniques, and a community that helps you nail every dish.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__group">
            <p className="footer__label">Explore</p>
            <ul>
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__group">
            <p className="footer__label">Support</p>
            <ul>
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <div className="footer__meta">
        <p>© {currentYear} RecipeApp. Crafted for home cooks.</p>
        <div className="footer__meta-links">
          <a href="#contact">Contact</a>
          <a href="#press">Press</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
