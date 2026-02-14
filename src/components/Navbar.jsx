import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Search, Heart, User } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/discover" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Compass size={24} />
        <span>Discover</span>
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={24} />
        <span>Search</span>
      </NavLink>

      <NavLink to="/watchlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Heart size={24} />
        <span>Watchlist</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;