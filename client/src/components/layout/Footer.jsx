
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__border" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__col footer__brand">
          <span className="nav__logo">Kashida</span>
          <p>Hand-loomed ethnic wear, woven with the weavers who make it.</p>
        </div>
        <div className="footer__col">
          <h4>Shop</h4>
          <a href="#">Sarees</a>
          <a href="#">Lehenga Sets</a>
          <a href="#">Kurta Sets</a>
          <a href="#">Jewelry</a>
        </div>
        <div className="footer__col">
          <h4>Help</h4>
          <a href="#">Size Guide</a>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer__col">
          <h4>Visit the Atelier</h4>
          <p>14 Malabar Hill Road, Mumbai</p>
          <p>Open Tue–Sun, 11am–7pm</p>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 Kashida. All rights reserved.</span>
      </div>
    </footer>
  );
}