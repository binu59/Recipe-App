import React, { useState } from "react";
import { createPortal } from "react-dom";
import { loginUser } from "../../services/api";
import "./auth.css";

function SignInModal({ open, onClose, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("Signing you in...");
    setLoading(true);

    try {
      await loginUser({ email: form.email, password: form.password });
      setStatus("Signed in! Welcome back.");
      setTimeout(onClose, 800);
    } catch (err) {
      const message = err?.message || "Unable to sign in";
      setError(message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="auth-modal__backdrop" onClick={onClose} />
      <div className="auth-modal__card">
        <div className="auth-modal__head">
          <div>
            <p className="home-section__overline">Sign in</p>
            <h3>Welcome back</h3>
            <p className="auth-modal__sub">Access your saved recipes and collections.</p>
          </div>
          <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close sign in form">
            ×
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__field">
            <span>Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
            />
          </label>
          <label className="auth-form__field">
            <span>Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
            />
          </label>
          <div className="auth-form__actions">
            <button type="submit" className="auth-form__submit" disabled={loading}>
              Sign in
            </button>
            <button type="button" className="auth-form__cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
          <p className="auth-form__switch">
            Do not have an account?{" "}
            <button type="button" onClick={onSwitch} className="auth-form__link">
              Sign up
            </button>
          </p>
          {status ? <p className="auth-form__status">{status}</p> : null}
          {error ? <p className="auth-form__error">{error}</p> : null}
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

export default SignInModal;
