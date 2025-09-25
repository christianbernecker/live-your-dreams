"use client";

import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="lyd-login">
      <div className="lyd-login__card">
        <header className="lyd-login__header">
          <div className="lyd-login__logo">
            <Image 
              src="/lyd-logo.svg" 
              alt="Live Your Dreams - Real Estate Logo" 
              width={200} 
              height={60}
              priority
            />
          </div>
          <h1 className="lyd-heading-luxury">Backoffice</h1>
          <p className="lyd-text-muted">Exklusive Immobilienvermarktung</p>
        </header>
        <form className="lyd-login__form" action="/api/auth/signin" method="post">
          <div className="lyd-input-field">
            <label className="lyd-input-label">E-Mail-Adresse</label>
            <div className="lyd-input-wrapper has-icon">
              <svg className="lyd-input-icon" viewBox="0 0 24 24" width="16" height="16">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              <input 
                name="email" 
                type="email" 
                className="lyd-input"
                autoComplete="username" 
                required 
                placeholder="ihre@email.de"
              />
            </div>
          </div>
          
          <div className="lyd-input-field">
            <label className="lyd-input-label">Passwort</label>
            <div className="lyd-input-wrapper has-icon">
              <svg className="lyd-input-icon" viewBox="0 0 24 24" width="16" height="16">
                <path d="M18 10V6c0-3.3-2.7-6-6-6s-6 2.7-6 6v4H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H18zm-1 0H7V6c0-2.8 2.2-5 5-5s5 2.2 5 5v4z" fill="currentColor"/>
              </svg>
              <input 
                name="password" 
                type="password" 
                className="lyd-input"
                autoComplete="current-password" 
                required 
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button type="submit" className="lyd-button lyd-button-primary large">
            Anmelden
          </button>
        </form>
        <footer className="lyd-login__footer">
          <small>© {new Date().getFullYear()} Live Your Dreams GmbH</small>
          <nav>
            <Link href="/impressum">Impressum</Link> · <Link href="/datenschutz">Datenschutz</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
