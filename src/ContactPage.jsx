import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Laptop,
} from "lucide-react";
import "./Contact.css";

/* ---------- FORMSPREE ----------
   1. Go to formspree.io and create a free account.
   2. Click "New Form", give it a name, and set the email where
      you want to receive the inquiries.
   3. Copy the form ID (the part after /f/ in the endpoint URL,
      e.g. https://formspree.io/f/xyzabcde  ->  xyzabcde)
   4. Put it in your .env file:  VITE_FORMSPREE_ID=xyzabcde
*/
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || "xoednvao";
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

// Change these to your real details
const CONTACT_EMAIL = "karlreggieabinon@gmail.com";
const CONTACT_LOCATION = "Philippines";
const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Messenger", href: "https://m.me/Karl.lemons" },
];

const INQUIRY_TYPES = [
  "Buying a laptop",
  "Question about a listing",
  "Selling / trade-in",
  "Other",
];

/* ---------- LOADING SCREEN ---------- */
export function PageLoader({ label = "Loading" }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="loader-logo">
        <Laptop size={26} strokeWidth={2.2} />
      </div>
      <div className="loader-bar">
        <span />
      </div>
      <p>{label}…</p>
    </div>
  );
}

/* ---------- CONTACT PAGE ---------- */
export default function ContactPage({ onBack }) {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // "instant" skips the site-wide smooth scrolling, which made the page drift
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never fill this hidden field
    if (data.get("_gotcha")) return;

    if (FORMSPREE_ID === "YOUR_FORM_ID") {
      setStatus("error");
      setErrorMsg(
        "The contact form isn't connected yet. Add your Formspree ID to the .env file."
      );
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        setErrorMsg(
          json?.errors?.map((x) => x.message).join(", ") ||
            "Something went wrong. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div className="contact-page">
      {/* TOP BAR (same header as the main site) */}
      <header className="header">
        <div className="container header-inner">
          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
          >
            <span className="logo-icon">
              <Laptop size={23} strokeWidth={2.2} />
            </span>
            <span className="logo-text">
              LAPTOP SHOP <span>PH.</span>
              <small>YOUR NEXT UPGRADE</small>
            </span>
          </a>

          <div className="header-actions">
            <button className="cp-back" onClick={onBack}>
              <ArrowLeft size={15} /> <span>Back to Home</span>
            </button>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="cp-container cp-main">
        <section className="cp-left">
          <div className="eyebrow">GET IN TOUCH</div>

          <h1>
            Let's talk
            <br />
            <span>laptops.</span>
          </h1>

          <p className="cp-intro">
            Looking for a laptop, have a question about a listing, or want to
            sell or trade yours? Send a message and I'll get back to you as
            soon as I can.
          </p>

          <div className="cp-divider" />

          <dl className="cp-details">
            <div>
              <dt>EMAIL</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>LOCATION</dt>
              <dd>{CONTACT_LOCATION}</dd>
            </div>
            <div>
              <dt>SOCIAL</dt>
              <dd className="cp-socials">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <section className="cp-card">
          {status === "success" ? (
            <div className="cp-success">
              <CheckCircle2 size={54} strokeWidth={1.6} />
              <h2>Message sent!</h2>
              <p>
                Thank you for reaching out. I'll reply to your email as soon
                as possible.
              </p>
              <button className="cp-send" onClick={() => setStatus("idle")}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate={false}>
              {/* Hidden honeypot field for spam bots */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                className="cp-honeypot"
                aria-hidden="true"
              />

              <div className="cp-row">
                <label className="cp-field">
                  <span>NAME</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </label>
                <label className="cp-field">
                  <span>EMAIL</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </label>
              </div>

              <label className="cp-field">
                <span>INQUIRY TYPE</span>
                <div className="cp-select">
                  <select name="inquiry_type" defaultValue="" required>
                    <option value="" disabled>
                      Select an inquiry type
                    </option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
              </label>

              <label className="cp-field">
                <span>MESSAGE</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell me which laptop you're looking for…"
                  required
                />
              </label>

              {status === "error" && (
                <p className="cp-error" role="alert">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="cp-send"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  "Sending…"
                ) : (
                  <>
                    Send Inquiry <ArrowUpRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}