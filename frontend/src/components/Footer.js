import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Survey App. All rights reserved.
      </p>
      <p className="footer-sub">
      Created by Gokilasundarraj
      </p>
    </footer>
  );
};

export default Footer;
