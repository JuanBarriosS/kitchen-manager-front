import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #0C0F1A;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  .login-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 600px 400px at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-card {
    position: relative;
    z-index: 1;
    background: #10131C;
    border: 0.5px solid rgba(201,168,76,0.15);
    border-radius: 12px;
    width: 100%;
    max-width: 420px;
    padding: 48px 40px;
    animation: fadeUp 0.5s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  }

  .login-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 36px;
  }

  .login-logo-wordmark {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .login-logo-kitchen {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 8px;
    color: #C9A84C;
    text-transform: uppercase;
    line-height: 1;
  }

  .login-logo-sep {
    width: 100px;
    height: 0.5px;
    background: rgba(201,168,76,0.25);
  }

  .login-logo-manager {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px;
    letter-spacing: 6px;
    color: rgba(240,235,224,0.3);
    text-transform: uppercase;
  }

  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 4px;
    color: #F0EBE0;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 12px;
    color: rgba(240,235,224,0.3);
    margin-bottom: 32px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block;
    font-size: 9px;
    font-weight: 500;
    color: rgba(201,168,76,0.5);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .form-input-wrapper { position: relative; }

  .form-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: rgba(201,168,76,0.35);
    font-size: 14px;
    pointer-events: none;
    transition: color 0.2s;
    display: flex;
    align-items: center;
  }

  .form-input {
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

  .form-input::placeholder { color: rgba(240,235,224,0.2); }

  .form-input:focus { border-color: rgba(201,168,76,0.55); }

  .form-input-wrapper:focus-within .form-input-icon {
    color: rgba(201,168,76,0.7);
  }

  .btn-login {
    width: 100%;
    padding: 14px;
    margin-top: 8px;
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
    transition: background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .btn-login:hover { background: rgba(201,168,76,0.08); transform: translateY(-1px); }
  .btn-login:active { transform: translateY(0); }
  .btn-login:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .btn-login.loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent);
    animation: shimmer 1.2s infinite;
  }

  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  .error-msg {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px 14px;
    background: rgba(230,57,70,0.06);
    border: 0.5px solid rgba(230,57,70,0.3);
    border-radius: 6px;
    color: rgba(230,57,70,0.85);
    font-size: 12px;
    font-weight: 300;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-6px); }
    75%       { transform: translateX(6px); }
  }

  .divider {
    border: none;
    border-top: 0.5px solid rgba(201,168,76,0.08);
    margin: 28px 0 20px;
  }

  .login-footer {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px;
    font-style: italic;
    color: rgba(240,235,224,0.15);
    text-align: center;
    letter-spacing: 1px;
  }
`;

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            const respuesta = await axios.post("https://kitchen-manager-back.onrender.com/login", {
                username,
                password
            });

            const roles = respuesta.data.roles;
            localStorage.setItem("username", respuesta.data.usuario);
            localStorage.setItem("role", roles[0]);
            localStorage.setItem("token", respuesta.data.token);

            if (roles.includes("ADMIN")) {
                navigate("/admin");
            } else if (roles.includes("EMPLEADO")) {
                navigate("/empleado");
            }

        } catch (error) {
            setMensaje("Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div className="login-card">

                    <div className="login-logo">
                        <svg width="56" height="56" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
                        <div className="login-logo-wordmark">
                            <div className="login-logo-kitchen">Kitchen</div>
                            <div className="login-logo-sep" />
                            <div className="login-logo-manager">Manager</div>
                        </div>
                    </div>

                    <div className="login-title">Iniciar sesión</div>
                    <div className="login-subtitle">Ingresa tus credenciales para continuar</div>

                    <form onSubmit={manejarLogin}>
                        <div className="form-group">
                            <label className="form-label">Usuario</label>
                            <div className="form-input-wrapper">
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Tu nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <span className="form-input-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <div className="form-input-wrapper">
                                <input
                                    className="form-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="form-input-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <button
                            className={`btn-login ${loading ? 'loading' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "VERIFICANDO..." : "INGRESAR"}
                        </button>

                      <button className="btn-login" type="button" onClick={() => navigate('/mesero')}> Portal Meseros</button>

                        {mensaje && (
                            <div className="error-msg">
                                <span>⚠</span> {mensaje}
                            </div>
                        )}
                    </form>

                    <hr className="divider" />
                    <div className="login-footer">Gestión que sabe a calidad.</div>
                </div>
            </div>
        </>
    );
}

export default Login;
