import React from 'react';
import '../../css/Header.css'; // Assuming you use a CSS file for styling

function Header() {
  return (
    <div className="header">
      {/* Logo on the left */}
      
      <img src="/src/assets/logo.png" alt="Logo" className="logo" />
      <h1 className="title">Sustainable Farming Advisor</h1>
    </div>
  );
}

export default Header;