"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "./admin.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tags");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [numberOfCodes, setNumberOfCodes] = useState(1);
  const [editingPet, setEditingPet] = useState<any>(null);

  // Contraseña simple (en producción deberías usar AWS Cognito)
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    setPassword("");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [tagsData, petsData] = await Promise.all([
        client.models.Tag.list(),
        client.models.Pet.list(),
      ]);
      setTags(tagsData.data || []);
      setPets(petsData.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleGenerateCodes = async () => {
    setLoading(true);
    try {
      const promises = [];
      for (let i = 0; i < numberOfCodes; i++) {
        const code = generateCode();
        promises.push(
          client.models.Tag.create({
            code: code,
            isActive: false,
          })
        );
      }
      await Promise.all(promises);
      alert(`${numberOfCodes} código(s) generado(s) exitosamente`);
      setShowGenerateModal(false);
      setNumberOfCodes(1);
      await loadData();
    } catch (error) {
      console.error("Error al generar códigos:", error);
      alert("Error al generar códigos");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este código?")) return;
    
    setLoading(true);
    try {
      await client.models.Tag.delete({ id });
      alert("Código eliminado exitosamente");
      await loadData();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta mascota?")) return;
    
    setLoading(true);
    try {
      await client.models.Pet.delete({ id });
      alert("Mascota eliminada exitosamente");
      await loadData();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la mascota");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.models.Pet.update({
        id: editingPet.id,
        name: editingPet.name,
        species: editingPet.species,
        breed: editingPet.breed,
        color: editingPet.color,
        age: editingPet.age,
        photo: editingPet.photo,
        ownerName: editingPet.ownerName,
        ownerPhone: editingPet.ownerPhone,
        ownerEmail: editingPet.ownerEmail,
        ownerAddress: editingPet.ownerAddress,
        notes: editingPet.notes,
      });
      alert("Mascota actualizada exitosamente");
      setEditingPet(null);
      await loadData();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar la mascota");
    } finally {
      setLoading(false);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <h1>🔐 Panel de Administración</h1>
          <p>Ingresa la contraseña para acceder</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="login-input"
              required
            />
            <button type="submit" className="login-btn">
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>🐾 Panel de Administración - Maskota</h1>
          <p>Gestiona códigos de plaquitas y mascotas registradas</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <h3>{tags.length}</h3>
            <p>Códigos Totales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{tags.filter(t => t.isActive).length}</h3>
            <p>Plaquitas Activadas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{tags.filter(t => !t.isActive).length}</h3>
            <p>Sin Activar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🐕</div>
          <div className="stat-info">
            <h3>{pets.length}</h3>
            <p>Mascotas Registradas</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "tags" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tags")}
        >
          Códigos de Plaquitas
        </button>
        <button
          className={activeTab === "pets" ? "tab active" : "tab"}
          onClick={() => setActiveTab("pets")}
        >
          Mascotas Registradas
        </button>
      </div>

      {activeTab === "tags" && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Códigos de Plaquitas</h2>
            <div className="action-buttons">
              <button
                onClick={() => setShowGenerateModal(true)}
                className="btn-generate"
              >
                + Generar Códigos
              </button>
              <button onClick={loadData} className="btn-refresh">
                🔄 Actualizar
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Estado</th>
                    <th>Fecha Activación</th>
                    <th>Link QR</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id}>
                      <td className="code-cell">{tag.code}</td>
                      <td>
                        <span className={`status-badge ${tag.isActive ? 'active' : 'inactive'}`}>
                          {tag.isActive ? "✅ Activada" : "⏳ Sin Activar"}
                        </span>
                      </td>
                      <td>{tag.activatedAt ? new Date(tag.activatedAt).toLocaleDateString() : "-"}</td>
                      <td>
                        <a
                          href={`/tag/${tag.code}`}
                          target="_blank"
                          className="link-btn"
                        >
                          Ver Página
                        </a>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "pets" && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Mascotas Registradas</h2>
            <button onClick={loadData} className="btn-refresh">
              🔄 Actualizar
            </button>
          </div>

          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Mascota</th>
                    <th>Especie</th>
                    <th>Propietario</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map((pet) => (
                    <tr key={pet.id}>
                      <td className="code-cell">{pet.tagCode}</td>
                      <td>{pet.name}</td>
                      <td>{pet.species || "-"}</td>
                      <td>{pet.ownerName}</td>
                      <td>{pet.ownerPhone}</td>
                      <td>
                        <button
                          onClick={() => setEditingPet(pet)}
                          className="btn-edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet.id)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal para generar códigos */}
      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Generar Códigos de Plaquitas</h2>
            <p>¿Cuántos códigos deseas generar?</p>
            <input
              type="number"
              min="1"
              max="100"
              value={numberOfCodes}
              onChange={(e) => setNumberOfCodes(parseInt(e.target.value))}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                onClick={handleGenerateCodes}
                className="btn-confirm"
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar"}
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar mascota */}
      {editingPet && (
        <div className="modal-overlay" onClick={() => setEditingPet(null)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Mascota</h2>
            <form onSubmit={handleUpdatePet} className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={editingPet.name}
                    onChange={(e) => setEditingPet({...editingPet, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Especie</label>
                  <input
                    type="text"
                    value={editingPet.species || ""}
                    onChange={(e) => setEditingPet({...editingPet, species: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Raza</label>
                  <input
                    type="text"
                    value={editingPet.breed || ""}
                    onChange={(e) => setEditingPet({...editingPet, breed: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={editingPet.color || ""}
                    onChange={(e) => setEditingPet({...editingPet, color: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Propietario</label>
                <input
                  type="text"
                  value={editingPet.ownerName}
                  onChange={(e) => setEditingPet({...editingPet, ownerName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={editingPet.ownerPhone}
                  onChange={(e) => setEditingPet({...editingPet, ownerPhone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingPet.ownerEmail || ""}
                  onChange={(e) => setEditingPet({...editingPet, ownerEmail: e.target.value})}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-confirm" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPet(null)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
