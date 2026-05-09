import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span>💎 ShubhCrystals</span>
          <p>Healing energies, beautifully crafted.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/cart">Cart</a>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>sakshyy1204@gmail.com</p>
          <p>Instagram: @shubhcrystals</p>
        </div>
      </div>
      <p className="footer-copy">&copy; 2026 ShubhCrystals. All rights reserved.</p>
    </footer>
  )
}
