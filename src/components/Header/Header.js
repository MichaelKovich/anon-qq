import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="Header">
      <Link className="Link__none" to="/">
        Anon-QQ
      </Link>
    </header>
  );
};

export default Header;
