import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #0C0E14;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* glow de fondo igual que el hero de la landing */
  .login-root::after {
    content: '';
    position: absolute;
    width: 700px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(200,137,42,0.1) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .login-card {
    position: relative;
    z-index: 1;
    background: #10131C;
    border: 1px solid rgba(255,255,255,0.07);
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

  /* línea dorada superior */
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, #C8892A, #E8A830);
    border-radius: 12px 12px 0 0;
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .login-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #C8892A, #E8A830);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .login-logo-icon svg { width: 22px; height: 22px; fill: white; }

  .login-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; letter-spacing: 0.03em;
    color: #F2EDE4; line-height: 1;
  }
  .login-logo-text span { color: #C8892A; }

  .login-logo-sub {
    font-size: 9px;
    color: rgba(232,230,223,0.4);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 3px;
  }

  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; letter-spacing: 0.02em;
    color: #F2EDE4;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 13px;
    color: rgba(232,230,223,0.45);
    margin-bottom: 32px;
    font-weight: 300;
  }

  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block;
    font-size: 10px; font-weight: 600;
    color: rgba(232,230,223,0.45);
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 8px;
  }

  .form-input-wrapper { position: relative; }

  .form-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: rgba(232,230,223,0.3);
    font-size: 15px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .form-input {
    width: 100%;
    background: #0C0E14;
    border: 1px solid rgba(200,137,42,0.2);
    border-radius: 6px;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #F2EDE4;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder { color: rgba(255,255,255,0.2); }

  .form-input:focus {
    border-color: rgba(200,137,42,0.6);
    box-shadow: 0 0 0 3px rgba(200,137,42,0.1);
  }

  .form-input-wrapper:focus-within .form-input-icon {
    color: #C8892A;
  }

  .btn-login {
    width: 100%;
    padding: 14px;
    margin-top: 8px;
    background: linear-gradient(135deg, #C8892A, #E8A830);
    border: none;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    letter-spacing: 0.05em;
    color: #0C0E14;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-login:hover {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,137,42,0.3);
  }

  .btn-login:active { transform: translateY(0); }

  .btn-login:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn-login.loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
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
    background: rgba(230,57,70,0.08);
    border: 1px solid rgba(230,57,70,0.25);
    border-radius: 6px;
    color: #E63946;
    font-size: 13px;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-6px); }
    75%       { transform: translateX(6px); }
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin: 28px 0 20px;
  }

  .login-footer {
    font-size: 10px;
    color: rgba(232,230,223,0.2);
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
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
            const respuesta = await axios.post("https://archlinux.taildc096b.ts.net:8443/login", {
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
                        <div className="...logo-icon" style={{ fontSize: "20px" }}>
                            🫕
                        </div>
                        <div>
                            <div className="login-logo-text">Kitchen<span>Manager</span></div>
                            <div className="login-logo-sub">Sistema de Pedidos y Facturacion</div>
                        </div>
                    </div>

                    <div className="login-title">INICIAR SESIÓN</div>
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
                                <span className="form-input-icon">👤</span>
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
                                <span className="form-input-icon">🔒</span>
                            </div>
                        </div>

                        <button
                            className={`btn-login ${loading ? 'loading' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "VERIFICANDO..." : "INGRESAR"}
                        </button>

                        {mensaje && (
                            <div className="error-msg">
                                <span>⚠</span> {mensaje}
                            </div>
                        )}
                    </form>

                    <hr className="divider" />
                    <div className="login-footer">SISTEMA INTERNO — SOLO PERSONAL AUTORIZADO</div>
                </div>
            </div>
        </>
    );
}

export default Login;