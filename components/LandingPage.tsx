"use client";

import { useEffect, useRef, useState } from "react";

/* Five distinct training-stack groups — heading + caption shown under the
   active (center) card. Verbatim from the original markup. */
const CARD_DATA = [
  {
    heading: "Real-time pattern mapping",
    caption: "See what's driving your decisions before it does.",
  },
  {
    heading: "Decision simulator",
    caption:
      "Run any choice through the lens of both your current self and your future self, and know exactly which one is making the call.",
  },
  {
    heading: "Future-self identity training",
    caption:
      "Rehearse the behaviors, decisions, and language of who you're becoming, before you believe it's possible.",
  },
  {
    heading: "90-day transformation protocol",
    caption:
      "Personalized to your pattern. Built to make new mental defaults inevitable.",
  },
  {
    heading: "Rehearse future self responses",
    caption: "Practice thinking at your best before the moment demands it.",
  },
];

/* Calendar dot grid (17 cols × 6 rows). 'o' = filled cell. */
const CAL_ROWS = [
  "........o.o...o.o",
  "........ooooooooo",
  ".....o.oooooooooo",
  "...o.oooooooooooo",
  "o.oooooooooooooo",
  "ooooooooooooooooo",
];

/* MailerLite embedded form — account 1766848, form 189837262958101971.
   We keep the custom design and POST to MailerLite's subscribe endpoint. */
const ML_ENDPOINT =
  "https://assets.mailerlite.com/jsonp/1766848/forms/189837262958101971/subscribe";

export default function LandingPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(2); // start on the middle card
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const n = CARD_DATA.length;

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
      form.reset();
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

  // Auto-advance the slider every 4s.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, 4000);
    return () => clearInterval(timer);
  }, [n]);

  const go = (dir: number) => setCurrent((c) => (c + dir + n) % n);

  const cardClass = (i: number) => {
    const rel = (i - current + n) % n;
    if (rel === 0) return "tcard is-center";
    if (rel === 1) return "tcard is-right";
    if (rel === n - 1) return "tcard is-left";
    return "tcard is-hidden";
  };

  // Clicking a side card rotates toward it.
  const onCardClick = (i: number) => {
    const rel = (i - current + n) % n;
    if (rel === 1) go(1);
    else if (rel === n - 1) go(-1);
  };

  const active = CARD_DATA[current] ?? CARD_DATA[0];

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
          <span
            className="quote1__type"
            data-text="This is your space to start performing from confidence"
          >
            This is your space to start performing from confidence
          </span>
        </p>

        {/* ===== 90-DAY PROTOCOL ===== */}
        <div className="protocol-img">
          <div className="bubbles" aria-hidden="true">
            <span className="bubble is-active" />
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
          </div>
        </div>
        <h3 className="protocol-cap">90 day transformation protocol</h3>

        {/* ===== MODULE 4 — training stack ===== */}
        <h2 className="stack-h1">Future-self training ™</h2>
        <h2 className="stack-h2">Your complete mental training stack</h2>
        <p className="stack-p">
          Most self-improvement apps give you content. Space of mind gives you a
          relationship, with a concrete model of who you&apos;re becoming. An
          actual identity to train toward.
        </p>

        {/* ===== CARD SLIDER ===== */}
        <div className="cards" id="cards">
          <button
            className="cards-nav cards-prev"
            type="button"
            aria-label="Previous card"
            onClick={() => go(-1)}
          >
            ‹
          </button>

          <div className="cards-track">
            {/* GROUP 1 — Real-time pattern mapping */}
            <div className={cardClass(0)} onClick={() => onCardClick(0)}>
              <div
                className="tcard__img"
                style={{ backgroundImage: "url('/4.png')" }}
              />
              <div className="ov ov--pattern">
                <div className="pc-head">
                  <div className="pc-stat">
                    <span className="trend trend--up">
                      <i className="tri tri-up" />
                      <span className="trend-label">Improving</span>
                    </span>
                    <span className="pc-name">Perfectionism</span>
                  </div>
                  <span className="pc-arrow">›</span>
                  <span className="pc-score">+4.8</span>
                </div>
                <div className="calendar">
                  <div className="cal-grad" />
                  <div className="cal-dots" aria-hidden="true">
                    {CAL_ROWS.flatMap((row, r) =>
                      row.split("").map((ch, c) => (
                        <span
                          key={`${r}-${c}`}
                          className={ch === "o" ? "on" : undefined}
                        />
                      ))
                    )}
                  </div>
                  <div className="cal-week" aria-hidden="true">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 2 — Decision simulator */}
            <div className={cardClass(1)} onClick={() => onCardClick(1)}>
              <div
                className="tcard__img"
                style={{ backgroundImage: "url('/5.png')" }}
              />
              <div className="ov ov--decision">
                <p className="ov-q">
                  My boyfriend just got a new job in Atlanta. Should I go with
                  him or stay here to focus on my own career?
                </p>
                <div className="ov-opts">
                  <span className="ov-opt">
                    <i className="ov-dot" />
                    Asking your future self
                  </span>
                  <span className="ov-opt">
                    <i className="ov-dot" />
                    Asking your current self
                  </span>
                </div>
              </div>
            </div>

            {/* GROUP 3 — Future-self identity training */}
            <div className={cardClass(2)} onClick={() => onCardClick(2)}>
              <div
                className="tcard__img"
                style={{ backgroundImage: "url('/6.png')" }}
              />
              <div className="ov ov--identity">
                <span className="ov-label">New Pattern</span>
                <h4 className="ov-big">
                  I have the capacity to grow and learn
                </h4>
                <div className="ov-row">
                  Why this pathway
                  <i className="ov-chev" />
                </div>
                <div className="ov-row">
                  Training focus
                  <i className="ov-chev" />
                </div>
              </div>
            </div>

            {/* GROUP 4 — 90-day transformation protocol */}
            <div className={cardClass(3)} onClick={() => onCardClick(3)}>
              <div
                className="tcard__img"
                style={{ backgroundImage: "url('/7.png')" }}
              />
              <div className="ov ov--phases">
                <div className="ov-phase">
                  <div className="ov-phase-txt">
                    <span className="ov-label">Phase 1</span>
                    <span className="ov-phase-title">Pattern recognition</span>
                  </div>
                  <span className="ov-arrow2">›</span>
                </div>
                <div className="ov-phase">
                  <div className="ov-phase-txt">
                    <span className="ov-label">Phase 2</span>
                    <span className="ov-phase-title">Pattern interruption</span>
                  </div>
                  <span className="ov-arrow2">›</span>
                </div>
              </div>
            </div>

            {/* GROUP 5 — Rehearse future self responses */}
            <div className={cardClass(4)} onClick={() => onCardClick(4)}>
              <div
                className="tcard__img"
                style={{ backgroundImage: "url('/8.png')" }}
              />
              <div className="ov ov--rehearse">
                <span className="ov-pill">Prime</span>
                <span className="ov-pill">Shift</span>
                <span className="ov-pill">Deep Dive</span>
              </div>
            </div>
          </div>

          <button
            className="cards-nav cards-next"
            type="button"
            aria-label="Next card"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>

        <h3 className="feature-title">{active.heading}</h3>
        <p className="feature-sub">{active.caption}</p>

        {/* ===== QUOTE 2 ===== */}
        <p className="quote2">
          <span
            className="quote2__type quote2__a"
            data-text="Your future is being created by what you repeat today,"
          >
            Your future is being created by what you repeat today,
          </span>
          <span
            className="quote2__type quote2__b"
            data-text="not what you intend to do tomorrow."
          >
            not what you intend to do tomorrow.
          </span>
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
        <div className="cta-glow" aria-hidden="true" />
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
            {status === "success"
              ? "You're on the list — welcome to the Founding 100."
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
