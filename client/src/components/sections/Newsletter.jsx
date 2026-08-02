import  { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <section className="newsletter">
      <div className="newsletter__zigzag" aria-hidden="true" />
      <div className="newsletter__inner">
        <h2 className="h2 h2--light">Be the First to Drape the New Season</h2>
        <p className="newsletter__sub">One email a fortnight. New arrivals, restocks, no noise.</p>
        {sent ? (
          <p className="newsletter__thanks">You're on the list. Welcome to Kashida.</p>
        ) : (
          <form className="newsletter__form" onSubmit={submit}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn--gold">
              Join the List
            </button>
          </form>
        )}
      </div>
    </section>
  );
}