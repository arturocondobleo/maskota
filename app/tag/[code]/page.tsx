"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "./tag.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function TagPage({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const code = params.code;

  useEffect(() => {
    checkTagStatus();
  }, [code]);

  async function checkTagStatus() {
    try {
      setLoading(true);
      
      // Buscar si existe una mascota con este código
      const { data: pets } = await client.models.Pet.list({
        filter: { tagCode: { eq: code } },
      });

      if (pets && pets.length > 0) {
        // La plaquita está activada
        setPet(pets[0]);
        setIsActive(true);
      } else {
        // La plaquita no está activada
        setIsActive(false);
      }
    } catch (err) {
      console.error("Error al verificar el tag:", err);
      setError("Error al cargar la información");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="tag-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tag-container">
        <div className="error-message">
          <h2>❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Si la plaquita está activada, mostrar información de la mascota
  if (isActive && pet) {
    return (
      <div className="tag-container">
        <div className="pet-card">
          <div className="pet-header">
            <h1>🐾 Mascota Encontrada</h1>
            <p className="tag-code">Código: {code}</p>
          </div>

          {pet.photo && (
            <div className="pet-photo">
              <img src={pet.photo} alt={pet.name} />
            </div>
          )}

          <div className="pet-info">
            <h2 className="pet-name">{pet.name}</h2>
            
            {pet.species && (
              <div className="info-row">
                <span className="label">Especie:</span>
                <span className="value">{pet.species}</span>
              </div>
            )}
            
            {pet.breed && (
              <div className="info-row">
                <span className="label">Raza:</span>
                <span className="value">{pet.breed}</span>
              </div>
            )}
            
            {pet.color && (
              <div className="info-row">
                <span className="label">Color:</span>
                <span className="value">{pet.color}</span>
              </div>
            )}
            
            {pet.age && (
              <div className="info-row">
                <span className="label">Edad:</span>
                <span className="value">{pet.age}</span>
              </div>
            )}
          </div>

          <div className="owner-info">
            <h3>📞 Información de Contacto</h3>
            
            <div className="info-row">
              <span className="label">Propietario:</span>
              <span className="value">{pet.ownerName}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Teléfono:</span>
              <span className="value">
                <a href={`tel:${pet.ownerPhone}`}>{pet.ownerPhone}</a>
              </span>
            </div>
            
            {pet.ownerEmail && (
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">
                  <a href={`mailto:${pet.ownerEmail}`}>{pet.ownerEmail}</a>
                </span>
              </div>
            )}
            
            {pet.ownerAddress && (
              <div className="info-row">
                <span className="label">Dirección:</span>
                <span className="value">{pet.ownerAddress}</span>
              </div>
            )}
          </div>

          {pet.notes && (
            <div className="notes">
              <h3>📝 Notas Adicionales</h3>
              <p>{pet.notes}</p>
            </div>
          )}

          <div className="action-buttons">
            <a href={`tel:${pet.ownerPhone}`} className="btn-primary">
              📞 Llamar al Propietario
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si la plaquita NO está activada, redirigir a activación
  if (!isActive) {
    window.location.href = `/activate/${code}`;
    return (
      <div className="tag-container">
        <div className="loading">
          <p>Redirigiendo a activación...</p>
        </div>
      </div>
    );
  }

  return null;
}
