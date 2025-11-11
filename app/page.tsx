"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main className="pet-card-container">
      <div className="pet-card">
        {/* Header */}
        <div className="pet-card-header">
          <h1>🐾 IDENTIFICACIÓN DE MASCOTA 🐾</h1>
        </div>

        {/* Photo Section */}
        <div className="pet-photo-section">
          <div className="pet-photo">
            <span className="photo-placeholder">📷</span>
          </div>
        </div>

        {/* Pet Info */}
        <div className="pet-info">
          <div className="info-row">
            <span className="label">Nombre:</span>
            <span className="value">Max</span>
          </div>
          <div className="info-row">
            <span className="label">Raza:</span>
            <span className="value">Labrador</span>
          </div>
          <div className="info-row">
            <span className="label">Color:</span>
            <span className="value">Dorado</span>
          </div>
          <div className="info-row">
            <span className="label">Edad:</span>
            <span className="value">3 años</span>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="emergency-section">
          <h2>📞 CONTACTO DE EMERGENCIA</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Dueño:</span>
              <span className="contact-value">Juan Pérez</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Teléfono:</span>
              <span className="contact-value">+1 234-567-8900</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Dirección:</span>
              <span className="contact-value">Calle Principal 123</span>
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="medical-section">
          <h3>⚕️ Información Médica</h3>
          <div className="medical-info">
            <div className="medical-item">
              <span>✓ Vacunado</span>
            </div>
            <div className="medical-item">
              <span>✓ Esterilizado</span>
            </div>
            <div className="medical-item">
              <span className="alert">⚠️ Alérgico a: Ninguno</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pet-card-footer">
          <p className="reward-message">
            🏆 Si encuentras a esta mascota, por favor contacta inmediatamente
          </p>
          <p className="thank-you">¡GRACIAS POR TU AYUDA!</p>
        </div>
      </div>
    </main>
  );
}
