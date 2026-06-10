"use client";

import { useEffect, useRef, useState } from "react";

/* Five training-stack slides — image + title + description, ported from the
   old project's PatternMappingSection. Each img maps to that component's
   matching slide asset (copied to /pm1–5.png). */
const CARD_DATA = [
  {
    heading: "Real-time pattern mapping",
    caption: "See what's driving your decisions before it does.",
    img: "/pm4.png",
  },
  {
    heading: "Decision simulator",
    caption:
      "Run any choice through the lens of both your current self and your future self, and know exactly which one is making the call.",
    img: "/pm1.png",
  },
  {
    heading: "Future-self identity training",
    caption:
      "Rehearse the behaviors, decisions, and language of who you're becoming, before you believe it's possible.",
    img: "/pm5.png",
  },
  {
    heading: "90-day transformation protocol",
    caption:
      "Personalized to your pattern. Built to make new mental defaults inevitable.",
    img: "/pm2.png",
  },
  {
    heading: "Rehearse future self responses",
    caption: "Practice thinking at your best before the moment demands it.",
    img: "/pm3.png",
  },
];

/* Quote 1 — animated typewriter, ported from the old project's TextCarousel.
   A fixed gray prefix, then these dark phrases typed/deleted in a loop. */
const TEXT_SLIDES = [
  "performing from confidence",
  "moving before you feel ready",
  "showing up for yourself",
  "living in your full potential",
];

/* MailerLite embedded form — account 1766848, form 189837262958101971.
   We keep the custom design and POST to MailerLite's subscribe endpoint. */
const ML_ENDPOINT =
  "https://assets.mailerlite.com/jsonp/1766848/forms/189837262958101971/subscribe";

/* Stripe Payment Link — users are sent here after signup to complete payment. */
const STRIPE_URL = "https://buy.stripe.com/eVqbJ1a1p21naJ70XJcwg0d";

export default function LandingPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(2); // start on the middle card
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const n = CARD_DATA.length;

  // Quote 1 typewriter state (TextCarousel logic from the old project).
  const [tcIndex, setTcIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = TEXT_SLIDES[tcIndex];
    let id: number;
    if (!deleting && typed.length < currentText.length) {
      id = window.setTimeout(
        () => setTyped(currentText.slice(0, typed.length + 1)),
        42
      );
    } else if (!deleting && typed.length === currentText.length) {
      id = window.setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && typed.length > 0) {
      id = window.setTimeout(
        () => setTyped(currentText.slice(0, typed.length - 1)),
        22
      );
    } else {
      id = window.setTimeout(() => {
        setDeleting(false);
        setTcIndex((i) => (i + 1) % TEXT_SLIDES.length);
      }, 240);
    }
    return () => window.clearTimeout(id);
  }, [tcIndex, typed, deleting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const data = new FormData();
    data.append("fields[name]", name);
    data.append("fields[email]", email);
    data.append("ml-submit", "1");
    data.append("anticsrf", "true");

    setStatus("loading");
    try {
      // MailerLite's JSONP endpoint is cross-origin; no-cors lets the POST
      // through (response is opaque, so we treat completion as success).
      await fetch(ML_ENDPOINT, { method: "POST", body: data, mode: "no-cors" });
      setStatus("success");
      // Send the subscriber to Stripe to complete payment, prefilling email.
      window.location.href = `${STRIPE_URL}?prefilled_email=${encodeURIComponent(
        email
      )}`;
    } catch {
      setStatus("error");
    }
  };

  // Scale the fixed 1440px stage down to fit narrower viewports.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const s = Math.min(1, window.innerWidth / 1440);
      stage.style.zoom = String(s);
    };
    window.addEventListener("resize", fit);
    fit();
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Auto-advance the slider every 3s (matches the old project's carousel).
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, 3000);
    return () => clearInterval(timer);
  }, [n]);

  const go = (dir: number) => setCurrent((c) => (c + dir + n) % n);

  // Three visible slides: blurred prev | sharp center | blurred next.
  const active = CARD_DATA[current];
  const prev = CARD_DATA[(current - 1 + n) % n];
  const next = CARD_DATA[(current + 1) % n];

  return (
    <div className="viewport">
      <div className="stage" ref={stageRef}>
        {/* ===== HERO ===== */}
        <header className="hero">
          <a className="hero__logo" href="#" aria-label="Space of Mind" />

          <div className="stat stat--left">
            <span className="stat__line" />
            <div className="stat__body">
              <span className="stat__value">492</span>
              <span className="stat__label">milestones recorded</span>
            </div>
          </div>

          <div className="stat stat--right">
            <span className="stat__line" />
            <div className="stat__body">
              <span className="stat__value">
                <i className="ic ic--dot" />
                76%
              </span>
              <span className="stat__label">
                alignment with your future vision
              </span>
            </div>
          </div>

          <div className="stat stat--right stat--top">
            <span className="stat__line" />
            <div className="stat__body">
              <span className="stat__value">
                <i className="ic ic--mark" />
                82%
              </span>
              <span className="stat__label">increase in self confidence</span>
            </div>
          </div>

          <h1 className="hero__title">Join the Founding 100</h1>
        </header>

        {/* ===== FEATURED IN — under hero ===== */}
        <div className="featured featured--hero">
          <span className="featured__label">Featured in</span>
          <ul className="featured__logos">
            <li className="flogo flogo--usatoday" aria-label="USA Today">
              <span className="flogo__img" />
              <span className="flogo__rect" />
            </li>
            <li className="flogo flogo--forbes" aria-label="Forbes">
              <span className="flogo__img" />
              <span className="flogo__rect" />
            </li>
            <li className="flogo flogo--fastco" aria-label="Fast Company">
              <span className="flogo__img" />
              <span className="flogo__rect" />
            </li>
          </ul>
        </div>

        {/* ===== TAGLINE ===== */}
        <h2 className="tagline-h">
          Join as a Founding 100 member and start training with a future you,
          today.
        </h2>
        <p className="tagline-p">
          Space of mind is a science-backed daily protocol that builds the
          mental patterns your next level demands, one rep at a time. Join as a
          founding member before we open to the public.
        </p>

        {/* ===== MODULE 2 — Founding 100 club ===== */}
        <div className="club-panel" />

        <div className="benefits">
          <div className="benefit">
            <h3 className="benefit__title">Space of mind app access</h3>
            <p className="benefit__text">
              24/7 access to the Space of mind app, where you can access Future
              self training™ daily.
            </p>
          </div>
          <div className="benefit">
            <h3 className="benefit__title">Monthly live coaching calls</h3>
            <p className="benefit__text">
              Every month, you&apos;ll join a live call with a coach who knows
              this work. Bring what&apos;s actually in the way and leave with
              traction
            </p>
          </div>
          <div className="benefit">
            <h3 className="benefit__title">
              A private community to keep each other accountable
            </h3>
            <p className="benefit__text">
              Access a private, curated community of women who are pushing the
              limits of what&apos;s possible and supporting each other in the
              in-between moments.
            </p>
          </div>
          <div className="benefit">
            <h3 className="benefit__title">
              A direct line into what we&apos;re building
            </h3>
            <p className="benefit__text">
              You&apos;re a co-creator. Your feedback, your needs, and your
              experience shape the product as it&apos;s built. You&apos;ll get
              regular updates on what&apos;s coming, and a real say in it.
            </p>
          </div>
          <div className="benefit">
            <h3 className="benefit__title">
              Founding member pricing, locked for life
            </h3>
            <p className="benefit__text">
              Whatever we charge when we open to the public, you&apos;ll never
              pay more than your founding rate. That price is yours,
              permanently.
            </p>
          </div>
        </div>

        <h2 className="club-title">Founding 100 club</h2>
        <p className="club-sub">
          You don&apos;t just get early access to the app, but a seat at the
          table while we build, and a community of people doing the exact same
          work.
        </p>

        {/* ===== QUOTE 1 ===== */}
        <p className="quote1">
          <span className="quote1__a">This is your space to start</span>{" "}
          <span className="quote1__b type-caret">{typed}</span>
        </p>

        {/* ===== 90-DAY PROTOCOL ===== */}
        <div className="protocol-img" />
        <h3 className="protocol-cap">90 day transformation protocol</h3>

        {/* ===== MODULE 4 — training stack ===== */}
        {/* Header re-animates (carousel-copy-enter) on each slide, like old. */}
        <h2 key={`h1-${current}`} className="stack-h1 carousel-copy-enter">
          Future-self training ™
        </h2>
        <h2 key={`h2-${current}`} className="stack-h2 carousel-copy-enter">
          Your complete mental training stack
        </h2>
        <p key={`p-${current}`} className="stack-p carousel-copy-enter">
          Most self-improvement apps give you content. Space of mind gives you a
          relationship, with a concrete model of who you&apos;re becoming. An
          actual identity to train toward.
        </p>

        {/* ===== CARD SLIDER — old project's PatternMappingSection:
            blurred prev | sharp white center (panel-enter) | blurred next.
            Side cards are the nav; content swaps each tick. ===== */}
        <div className="cards" id="cards">
          <button
            className="tcard tcard--side"
            type="button"
            onClick={() => go(-1)}
            aria-label={`Show ${prev.heading}`}
          >
            <div
              className="tcard__media"
              style={{ backgroundImage: `url('${prev.img}')` }}
            />
            <h3 className="tcard__title">{prev.heading}</h3>
          </button>

          <article
            key={active.heading}
            className="tcard tcard--center carousel-panel-enter"
          >
            <div
              className="tcard__media"
              style={{ backgroundImage: `url('${active.img}')` }}
            />
            <div className="tcard__cap">
              <h3 className="tcard__title">{active.heading}</h3>
              <p className="tcard__desc">{active.caption}</p>
            </div>
          </article>

          <button
            className="tcard tcard--side"
            type="button"
            onClick={() => go(1)}
            aria-label={`Show ${next.heading}`}
          >
            <div
              className="tcard__media"
              style={{ backgroundImage: `url('${next.img}')` }}
            />
            <h3 className="tcard__title">{next.heading}</h3>
          </button>
        </div>

        {/* ===== QUOTE 2 ===== */}
        <p className="quote2">
          <span className="quote2__a">
            The brain doesn&apos;t respond to who you want to be.
          </span>
          <span className="quote2__b">But who you train it to be.</span>
        </p>

        {/* ===== MODULE 5 — science ===== */}
        <div className="science">
          <div className="science__row">
            <h2 className="science__title">
              Where science meets self-discovery.
            </h2>
            <p className="science__text">
              Space of Mind is built on the same principles elite performers use
              to train their minds – evidence-based practices for behavioral
              change, and the science of identity formation. A training system
              built on one belief: you&apos;re not behind, you&apos;re just
              between versions.
            </p>
          </div>
        </div>

        {/* ===== TESTIMONIALS ===== */}
        <p className="tm tm--1">
          &quot;I had explored therapy and every book on the shelf, understood
          why I self-sabotage, yet kept doing the same thing over and over.
          Space of Mind was the first experience that shifted things in
          real-time, rather than just in reflection.&quot;
          <br />
          <br />
          <i>
            <b>Priya M.</b> VP of Sales, Series A Startup Exec
          </i>
        </p>
        <p className="tm tm--2">
          &quot;Took me years, but I finally stopped minimizing myself. I now
          walk into a room confident, making my presence felt, knowing my
          worth&quot;
          <br />
          <br />
          <i>
            <b>Beatrice L.</b>, Startup Advisor
          </i>
        </p>
        <p className="tm tm--3">
          &quot;Within 3 months, I stopped relying on others to get me out of a
          low place and learned how to get myself to baseline with my future
          self&quot;
          <br />
          <br />
          <i>
            <b>Andrea, B.</b>, Seed-stage founder
          </i>
        </p>

        {/* ===== FINAL CTA ===== */}
        {/* Mark + soft radial glow — ported from the old project's beta section. */}
        <div className="cta-glow" aria-hidden="true">
          <span className="cta-glow__halo" />
          <span className="cta-glow__mark" />
        </div>
        <h2 className="cta-title">Join the Founding 100</h2>
        <p className="cta-sub">Built for the ones who were there first.</p>
        <p className="cta-sub-credit">$50/month</p>

        <form className="signup" onSubmit={handleSubmit}>
          <input
            className="signup__name"
            type="text"
            name="name"
            placeholder="Your name"
            aria-label="Your name"
            autoComplete="given-name"
          />
          <div className="signup__row">
            <input
              className="signup__email"
              type="email"
              name="email"
              placeholder="Your email"
              aria-label="Your email"
              autoComplete="email"
              required
            />
            <button
              className="signup__submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "…" : "SUBMIT"}
            </button>
          </div>
          <p className="signup__note">
            {status === "loading"
              ? "Securing your spot…"
              : status === "success"
                ? "Redirecting you to checkout…"
                : status === "error"
                  ? "Something went wrong. Please try again."
                  : "Limited spots available."}
          </p>
        </form>

        {/* ===== FOOTER ===== */}
        <div className="footer-bar">
          <span className="footer-copy">©️ 2026 Space of Mind</span>
          <nav className="footer-links">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </div>
  );
}
