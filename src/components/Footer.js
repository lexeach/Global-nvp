import React from "react";
import "./Footer.css"; // Import CSS file for styling

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© 2024 Your Website. All rights reserved.</p>
        <div className="social-icons">
          <a href="https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d/">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
      <div className="cbc-link cbc-link-corner">
        <a href="https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d/">
          CBC
        </a>
      </div>
    </footer>
  );
}

export default Footer;
