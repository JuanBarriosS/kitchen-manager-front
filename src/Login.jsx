import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background-color: #1A1A2E;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #FF6B3515 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #FF6B3520 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .login-card {
    position: relative;
    z-index: 1;
    background: #16213E;
    border: 1px solid #FF6B3530;
    border-radius: 4px;
    width: 100%;
    max-width: 420px;
    padding: 48px 40px;
    box-shadow: 0 0 60px #FF6B3510, 0 24px 48px #00000060;
    animation: fadeUp 0.5s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #FF6B35, #FFC300);
    border-radius: 4px 4px 0 0;
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .login-logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #FF6B35, #FFC300);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .login-logo-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #F5F5F5;
    letter-spacing: 2px;
    line-height: 1;
  }

  .login-logo-sub {
    font-size: 10px;
    color: #A0A0A0;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .login-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    color: #F5F5F5;
    letter-spacing: 3px;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 13px;
    color: #A0A0A0;
    margin-bottom: 32px;
    font-weight: 300;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #A0A0A0;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .form-input-wrapper {
    position: relative;
  }

  .form-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #A0A0A0;
    font-size: 16px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .form-input {
    width: 100%;
    background: #1A1A2E;
    border: 1px solid #ffffff15;
    border-radius: 4px;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #F5F5F5;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder { color: #ffffff30; }

  .form-input:focus {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px #FF6B3520;
  }

  .form-input-wrapper:focus-within .form-input-icon {
    color: #FF6B35;
  }

  .btn-login {
    width: 100%;
    padding: 14px;
    margin-top: 8px;
    background: linear-gradient(135deg, #FF6B35, #FFC300);
    border: none;
    border-radius: 4px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 3px;
    color: #1A1A2E;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-login:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px #FF6B3540;
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
    background: linear-gradient(90deg, transparent, #ffffff30, transparent);
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
    background: #E6394615;
    border: 1px solid #E6394640;
    border-radius: 4px;
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
    border-top: 1px solid #ffffff08;
    margin: 28px 0 20px;
  }

  .login-footer {
    font-size: 11px;
    color: #A0A0A040;
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
            const respuesta = await axios.post("https://kitchen-manager-back-production.up.railway.app/login", {
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
                        <div className="login-logo-icon">🔥</div>
                        <div>
                            <div className="login-logo-text">KITCHEN MANAGER</div>
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