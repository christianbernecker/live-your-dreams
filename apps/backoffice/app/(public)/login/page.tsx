"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="lyd-login">
      <div className="lyd-login__card">
        <header className="lyd-login__header">
          <h1>Live Your Dreams</h1>
          <p>Backoffice für Immobilienvermarktung</p>
        </header>
        <form className="lyd-login__form" action="/api/auth/signin" method="post">
          <label className="lyd-field">
            <span className="lyd-field__label">E-Mail-Adresse</span>
            <span className="lyd-input">
              <input 
                name="email" 
                type="email" 
                className="lyd-input__control"
                autoComplete="username" 
                required 
                placeholder="ihre@email.de"
              />
            </span>
          </label>
          
          <label className="lyd-field">
            <span className="lyd-field__label">Passwort</span>
            <span className="lyd-input">
              <input 
                name="password" 
                type="password" 
                className="lyd-input__control"
                autoComplete="current-password" 
                required 
                placeholder="••••••••"
              />
            </span>
          </label>
          
          <button type="submit" className="lyd-btn lyd-btn--primary lyd-btn--block">
            <span className="lyd-btn__label">Anmelden</span>
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
