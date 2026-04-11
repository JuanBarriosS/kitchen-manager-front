import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .km-root {
    min-height: 100vh;
    background: #0C0F1A;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  .km-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 600px 400px at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .km-wrap {
    width: 100%;
    max-width: 400px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .km-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .km-logo-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .km-wordmark {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .km-wordmark-kitchen {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 300;
    letter-spacing: 8px;
    color: #C9A84C;
    text-transform: uppercase;
    line-height: 1;
  }

  .km-wordmark-sep {
    width: 100px;
    height: 0.5px;
    background: rgba(201,168,76,0.25);
  }

  .km-wordmark-manager {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px;
    letter-spacing: 6px;
    color: rgba(240,235,224,0.3);
    text-transform: uppercase;
  }

  .km-card {
    background: #10131C;
    border: 0.5px solid rgba(201,168,76,0.15);
    border-radius: 12px;
    padding: 40px 36px;
    position: relative;
    overflow: hidden;
  }

  .km-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  }

  .km-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 4px;
    color: #F0EBE0;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .km-card-sub {
    font-size: 12px;
    font-weight: 300;
    color: rgba(240,235,224,0.3);
    letter-spacing: 0.5px;
    margin-bottom: 32px;
  }

  .km-field {
    margin-bottom: 20px;
  }

  .km-label {
    display: block;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(201,168,76,0.5);
    margin-bottom: 8px;
  }

  .km-input-wrap {
    position: relative;
  }

  .km-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .km-input {
    width: 100%;
    background: #0C0F1A;
    border: 0.5px solid rgba(201,168,76,0.2);
    border-radius: 6px;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #F0EBE0;
    outline: none;
    transition: border-color 0.2s;
    letter-spacing: 0.5px;
  }

  .km-input::placeholder {
    color: rgba(240,235,224,0.2);
  }

  .km-input:focus {
    border-color: rgba(201,168,76,0.55);
  }

  .km-btn {
    width: 100%;
    margin-top: 8px;
    padding: 14px;
    background: transparent;
    border: 0.5px solid #C9A84C;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #C9A84C;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .km-btn:hover:not(:disabled) {
    background: rgba(201,168,76,0.1);
    transform: translateY(-1px);
  }

  .km-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .km-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .km-btn.loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent);
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  .km-error {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding: 12px 14px;
    background: rgba(230,57,70,0.06);
    border: 0.5px solid rgba(230,57,70,0.3);
    border-radius: 6px;
    color: rgba(230,57,70,0.85);
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.3px;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-5px); }
    75%      { transform: translateX(5px); }
  }

  .km-footer {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 0.5px solid rgba(201,168,76,0.08);
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px;
    font-style: italic;
    color: rgba(240,235,224,0.15);
    letter-spacing: 1px;
  }
`;

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4"/>
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const LogoMark = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4"/>
    <g transform="rotate(-20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="1.8">
      <line x1="44" y1="14" x2="44" y2="35"/>
      <line x1="50" y1="11" x2="50" y2="35"/>
      <line x1="56" y1="14" x2="56" y2="35"/>
      <path d="M44 35 Q47 41 50 42 Q53 41 56 35"/>
      <line x1="50" y1="42" x2="50" y2="86"/>
    </g>
    <g transform="rotate(20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="1.8">
      <path d="M50 11 Q58 30 54 44"/>
      <line x1="50" y1="11" x2="46" y2="44"/>
      <line x1="46" y1="44" x2="54" y2="44"/>
      <line x1="50" y1="46" x2="50" y2="86"/>
    </g>
  </svg>
);

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { username, password }
      );

      const roles = respuesta.data.roles;
      localStorage.setItem('username', respuesta.data.usuario);
      localStorage.setItem('role', roles[0]);
      localStorage.setItem('token', respuesta.data.token);

      if (roles.includes('ADMIN')) {
        navigate('/admin');
      } else if (roles.includes('EMPLEADO')) {
        navigate('/empleado');
      }
    } catch {
      setMensaje('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="km-root">
        <div className="km-wrap">

          <div className="km-header">
            <div className="km-logo-mark">
              <LogoMark />
            </div>
            <div className="km-wordmark">
              <div className="km-wordmark-kitchen">Kitchen</div>
              <div className="km-wordmark-sep" />
              <div className="km-wordmark-manager">Manager</div>
            </div>
          </div>

          <div className="km-card">
            <div className="km-card-title">Iniciar sesión</div>
            <div className="km-card-sub">Acceso exclusivo para personal autorizado</div>

            <form onSubmit={manejarLogin}>
              <div className="km-field">
                <label className="km-label">Usuario</label>
                <div className="km-input-wrap">
                  <span className="km-input-icon"><IconUser /></span>
                  <input
                    className="km-input"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="km-field">
                <label className="km-label">Contraseña</label>
                <div className="km-input-wrap">
                  <span className="km-input-icon"><IconLock /></span>
                  <input
                    className="km-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className={`km-btn${loading ? ' loading' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>

              {mensaje && (
                <div className="km-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(230,57,70,0.85)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {mensaje}
                </div>
              )}
            </form>

            <div className="km-footer">Gestión que sabe a calidad.</div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;