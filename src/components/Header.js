import React from "react";
import "./Header.css"; // Import CSS file for styling
import Logo from "../assets/images/logo.png";

function Header() {
  return (
    <header className="header-container">
      <div className="logo-container golden-text">
        <img
          src={Logo}
          alt="Logo"
          className="logo-img"
          style={{ height: "50px", width: "50px" }}
        />{" "}
        GLOBAL VNP
      </div>
      <nav className="nav-links">
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
