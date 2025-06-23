'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaFilePdf, FaBars, FaTimes } from 'react-icons/fa'
import { VibeThemeSwitch } from '@/components/theme-toggle'
import './Navbar.css'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <Link href="/" className="navbar-logo">
          <FaFilePdf className="navbar-logo-icon" />
          <span className="navbar-logo-text bg-gradient-text">PDF Merger</span>
        </Link>
        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <Link href="/">Home</Link>
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How It Works</Link>
        </nav>
        {/* Desktop Auth Buttons */}
        <div className="navbar-auth">
          <VibeThemeSwitch />
        </div>
        {/* Mobile Menu Button */}
        <div className="navbar-mobile-toggle">
          <VibeThemeSwitch />
          <button
            onClick={toggleMobileMenu}
            className="navbar-mobile-btn"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <FaTimes className="navbar-mobile-icon" aria-hidden="true" />
            ) : (
              <FaBars className="navbar-mobile-icon" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu animate-fade-in">
          <div className="navbar-mobile-links">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
          </div>
          <div className="navbar-mobile-auth">
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
