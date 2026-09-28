import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import { useAuth } from "../auth/useAuth";
import { ErrorBox } from "../components/ErrorBox";
import { S } from "../lib/strings";

/** Giriş — canvas: Giris.dc.html. Solda marka alanı, sağda giriş kartı. Hata metinleri
 * backend'in kendi mesajlarıdır (hatalı şifre, çok fazla deneme); burada çevrilmez.
 * Şifre sıfırlama ve kayıt yok: hesapları sistem yöneticisi açar. */
export function LoginPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const mutation = useMutation({
    mutationFn: () => login(username.trim(), password),
    onSuccess: (data) => {
      setUser(data);
      navigate(from, { replace: true });
    },
  });

  if (user) return <Navigate to="/" replace />;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }

  const t = S.login;
  return (
    <div className="login-page">
      <aside className="login-brand">
        <div className="login-brand-top">
          <span className="brand-mark" aria-hidden="true" />
          {S.app}
        </div>
        <div className="login-brand-body">
          <span className="brand-mark login-mark" aria-hidden="true" />
          <div className="login-wordmark">{S.app}</div>
          <div className="login-slogan" lang="en">
            {t.slogan}
          </div>
          <p className="login-pitch">{t.pitch}</p>
        </div>
        <div className="login-access-note">{t.accessNote}</div>
      </aside>

      <main className="login-main">
        <form className="login-card" onSubmit={onSubmit}>
          <div>
            <h1>{t.title}</h1>
            <p className="muted">{t.subtitle}</p>
          </div>
          {mutation.isError && <ErrorBox error={mutation.error} />}
          <div className="field">
            <label htmlFor="username">{t.username}</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              disabled={mutation.isPending}
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t.password}</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={mutation.isPending}
              />
              <button
                type="button"
                className="icon-button password-toggle"
                aria-label={showPassword ? t.hidePassword : t.showPassword}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="login-submit" disabled={mutation.isPending}>
            {mutation.isPending && <span className="login-spinner" aria-hidden="true" />}
            {mutation.isPending ? t.submitting : t.submit}
          </button>
          <p className="login-help muted small">{t.help}</p>
        </form>
      </main>
    </div>
  );
}
