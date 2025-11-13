"use client";

import { useState } from "react";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo">🐾</span>
          <span className="brand-name">Maskota</span>
        </div>
        <ul className="nav-menu">
          <li className={activeSection === "inicio" ? "active" : ""}>
            <a href="#inicio" onClick={() => setActiveSection("inicio")}>Inicio</a>
          </li>
          <li className={activeSection === "plaquita" ? "active" : ""}>
            <a href="#plaquita" onClick={() => setActiveSection("plaquita")}>Plaquita</a>
          </li>
          <li className={activeSection === "buscar" ? "active" : ""}>
            <a href="#buscar" onClick={() => setActiveSection("buscar")}>Buscar Mascota</a>
          </li>
          <li className={activeSection === "nosotros" ? "active" : ""}>
            <a href="#nosotros" onClick={() => setActiveSection("nosotros")}>Nosotros</a>
          </li>
          <li className={activeSection === "tienda" ? "active" : ""}>
            <a href="#tienda" onClick={() => setActiveSection("tienda")}>Tienda</a>
          </li>
        </ul>
        <button className="login-btn">Iniciar Sesión</button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Protege a tu Mejor Amigo</h1>
          <p className="hero-subtitle">
            Plaquitas identificadoras inteligentes con tecnología QR
          </p>
          <p className="hero-description">
            Cada plaquita tiene un código QR único. Si tu mascota se pierde, quien la encuentre 
            puede escanear la plaquita y ver inmediatamente tu información de contacto. 
            ¡Seguridad y tranquilidad en un solo click!
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => window.location.href = '#como-funciona'}>
              Cómo Funciona
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = '#tienda'}>
              Comprar Plaquita
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="pet-tag-preview">
            <div className="tag-icon">🏷️</div>
            <p className="tag-text">Plaquita QR</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section" id="como-funciona">
        <h2 className="section-title">¿Cómo Funciona?</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">🛒</div>
            <h3>Compra tu Plaquita</h3>
            <p>Cada plaquita viene con un código QR único (ej: 1eR38G) grabado</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">📱</div>
            <h3>Escanea y Activa</h3>
            <p>Escanea el QR por primera vez e ingresa los datos de tu mascota y tus contactos</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🐕</div>
            <h3>Colócala en el Collar</h3>
            <p>Pon la plaquita en el collar de tu mascota. Ya está protegida!</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon">✅</div>
            <h3>Si la Encuentran</h3>
            <p>Quien escanee el QR verá tus datos de contacto y podrá comunicarse contigo</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">¿Por qué elegir Maskota?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Código QR</h3>
            <p>Escanea y accede a toda la información de tu mascota al instante</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Datos Seguros</h3>
            <p>Tu información y la de tu mascota siempre protegida</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Contacto Rápido</h3>
            <p>Notificación inmediata si alguien encuentra a tu mascota</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Personalizable</h3>
            <p>Diseña tu plaquita con colores y estilos únicos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💪</div>
            <h3>Resistente</h3>
            <p>Material duradero para uso diario de tu mascota</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Actualizable</h3>
            <p>Modifica los datos sin necesidad de cambiar la plaquita</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>¿Listo para proteger a tu mascota?</h2>
        <p>Únete a miles de dueños que ya protegen a sus mascotas con Maskota</p>
        <button className="cta-button" onClick={() => window.location.href = '#tienda'}>
          Obtener Mi Plaquita
        </button>
      </section>

      {/* Demo Section */}
      <section className="demo-section">
        <h2 className="section-title">Prueba el Sistema</h2>
        <p className="demo-description">
          ¿Quieres ver cómo funciona? Ingresa un código de ejemplo para probar el sistema:
        </p>
        <div className="demo-examples">
          <button 
            className="demo-btn"
            onClick={() => window.location.href = '/tag/1eR38G'}
          >
            Probar con código: 1eR38G
          </button>
          <button 
            className="demo-btn"
            onClick={() => window.location.href = '/activate/DEMO123'}
          >
            Ver proceso de activación
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🐾 Maskota</h4>
            <p>Protegiendo a tus mascotas desde 2025</p>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>info@maskota.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Síguenos</h4>
            <p>Facebook | Instagram | Twitter</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Maskota. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
