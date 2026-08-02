
export default function FloatingChat() {
  return (
    <button className="fab" aria-label="Chat with us">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M4 18l1.4-3.8A8 8 0 1 1 9 19.6L4 18z" />
      </svg>
      <span className="fab__badge">1</span>
    </button>
  );
}