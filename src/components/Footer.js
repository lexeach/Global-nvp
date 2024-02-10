import React from "react";
import "./Footer.css"; // Import CSS file for styling

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-menu">
          <ul>
            <li>
              <a href="https://youtube.com">Youtube</a>
            </li>
            <li>
              <a href="https://facebook.com">Facebook</a>
            </li>
            <li>
              <a href="https://telegram.com">Telegram</a>
            </li>
            <li>
              <a href="https://bscscan.com/address/0x3af2e4ecedc614d730c8113cd8fcced1e9bb4985#writeContract">NVP Contract</a>
            </li>
            <li>
              <a href="https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d/">
                SWAP
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="copy-right">© 2024 Global NVP. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
