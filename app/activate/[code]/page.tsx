"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "./activate.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function ActivatePage({ params }: { params: { code: string } }) {
  const code = params.code;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    color: "",
    age: "",
    photo: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerAddress: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verificar si ya existe una mascota con este código
      const { data: existingPets } = await client.models.Pet.list({
        filter: { tagCode: { eq: code } },
      });

      if (existingPets && existingPets.length > 0) {
        setError("Esta plaquita ya está activada");
        setLoading(false);
        return;
      }

      // Crear la mascota
      await client.models.Pet.create({
        tagCode: code,
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        color: formData.color,
        age: formData.age,
        photo: formData.photo || undefined,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail || undefined,
        ownerAddress: formData.ownerAddress || undefined,
        notes: formData.notes || undefined,
      });

      setSuccess(true);
      
      // Redirigir a la página de visualización después de 2 segundos
      setTimeout(() => {
        window.location.href = `/tag/${code}`;
      }, 2000);
    } catch (err) {
      console.error("Error al activar plaquita:", err);
      setError("Error al guardar la información. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="activate-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>¡Plaquita Activada!</h1>
          <p>La información de tu mascota ha sido guardada correctamente.</p>
          <p className="redirect-text">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activate-container">
      <div className="activate-card">
        <div className="activate-header">
          <h1>🐾 Activar Plaquita</h1>
          <p className="tag-code">Código: {code}</p>
          <p className="subtitle">Ingresa los datos de tu mascota para activar esta plaquita</p>
        </div>

        {error && (
          <div className="error-alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="activate-form">
          <div className="form-section">
            <h2>Información de la Mascota</h2>
            
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Max"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="species">Especie *</label>
                <select
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="breed">Raza</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Ej: Labrador"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej: Marrón"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Edad</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ej: 3 años"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="photo">URL de Foto (opcional)</label>
              <input
                type="url"
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Información del Propietario</h2>
            
            <div className="form-group">
              <label htmlFor="ownerName">Nombre *</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerPhone">Teléfono *</label>
              <input
                type="tel"
                id="ownerPhone"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                required
                placeholder="+52 123 456 7890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerEmail">Email</label>
              <input
                type="email"
                id="ownerEmail"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerAddress">Dirección</label>
              <input
                type="text"
                id="ownerAddress"
                name="ownerAddress"
                value={formData.ownerAddress}
                onChange={handleChange}
                placeholder="Tu dirección"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Notas Adicionales</h2>
            
            <div className="form-group">
              <label htmlFor="notes">Información adicional (opcional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Ej: Tiene una mancha blanca en la pata derecha, es muy amigable, necesita medicación diaria, etc."
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Guardando..." : "Activar Plaquita"}
          </button>
        </form>
      </div>
    </div>
  );
}
