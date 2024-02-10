import React from "react";
import "./Header.css"; // Import CSS file for styling
import Logo from "../assets/images/logo.png";
import Logo1 from "../assets/images/logo-v1.png";

function Header() {
  const accountAddress = "0x123456789ABCDEF"; // Example wallet address

  return (
    <header className="header-container">
      <div className="logo-container golden-textHeader">
        <img
          src={Logo}
          alt="Logo"
          className="logo-img"
          style={{ height: "50px", width: "50px" }}
        />
        {"  "}
        <img
          src={Logo1}
          alt="Logo"
          className="logo-img"
          style={{ height: "50px", width: "50px" }}
        />
        {"         "}
        GLOBAL VNP
      </div>
    </header>
  );
}

export default Header;
