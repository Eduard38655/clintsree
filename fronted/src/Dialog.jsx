import { useEffect, useState } from "react";
import style from "./App.module.css";

export default function UserDialog({ open, onClose, onSaved, operation, user }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (operation === "edit" && user) {
      setNombre(user.nombre || "");
      setApellido(user.apellido || "");
      setEmail(user.email || "");
      setBalance(user.balance || "");
      setStatus(user.status || "");
    } else {
      setNombre("");
      setApellido("");
      setEmail("");
      setBalance("");
      setStatus("Activo"); // ✅ Preestablecido para que la validación no falle en create
    }
    setErrors({});
  }, [open, operation, user]);

  if (!open) return null;

  function validate() {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "Campo requerido";
    if (!apellido.trim()) newErrors.apellido = "Campo requerido";
    if (!email.trim()) newErrors.email = "Campo requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email inválido";
    if (!status) newErrors.status = "Selecciona un status";
    return newErrors;
  }

  async function handleSave() {
    console.log(nombre, apellido, balance, status,email)
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;

      if (operation === "create") {
        response = await fetch( `${import.meta.env.VITE_API_ROUTER}/InsertUser/user` , {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            email,
            balance,
            status,
            fecha: new Date(),
          }),
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_ROUTER}/InsertUser/UpdateUser/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            balance,
            status,
            fecha: new Date(),
            email
          }),
        });
      }

      const data = await response.json();

      if (data.ok) {
        onSaved();
        onClose();
      } else {
        setErrors(data.errors || { general: "Error al guardar" });
      }
    } catch (err) {
      console.error("Error:", err);
      setErrors({ general: "Error de conexión" });
    }
  }

  return (
    <div className={style.overlay}>
      <div className={style.dialog} role="dialog" aria-modal="true" aria-labelledby="dialog-title">

        {/* Header */}
        <div className={style.header}>
          <div className={style.headerTitle}>
            <div className={style.avatar}>
              <i className={`fa-solid ${operation === "create" ? "fa-user-plus" : "fa-user-pen"}`}></i>
            </div>
            <div>
              <p className={style.title} id="dialog-title">
                {operation === "create" ? "Nuevo usuario" : `Editar — ${user?.nombre} ${user?.apellido}`}
              </p>
              <p className={style.subtitle}>
                {operation === "create" ? "Completa los campos para registrar" : "Modifica los campos y guarda"}
              </p>
            </div>
          </div>
          <button className={style.closeBtn} aria-label="Cerrar" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}

        <div className={style.body}>

          {errors.general && (
            <p style={{ color: "var(--error)", fontSize: "13px" }}>{errors.general}</p>
          )}

          <div className={style.row}>
            <div className={style.field}>
              <label htmlFor="nombre">Nombre <span className={style.required}>*</span></label>
              <div className={style.inputIcon}>
                <i className="fa-solid fa-user"></i>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Eduardo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={errors.nombre ? style.inputError : ""}
                />
              </div>
              {errors.nombre && <span className={style.errorMsg}>{errors.nombre}</span>}
            </div>

            <div className={style.field}>
              <label htmlFor="apellido">Apellido <span className={style.required}>*</span></label>
              <div className={style.inputIcon}>
                <i className="fa-solid fa-user"></i>
                <input
                  id="apellido"
                  type="text"
                  placeholder="Ferreras"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className={errors.apellido ? style.inputError : ""}
                />
              </div>
              {errors.apellido && <span className={style.errorMsg}>{errors.apellido}</span>}
            </div>
          </div>

          <div className={style.field}>
            <label htmlFor="email">Correo electrónico <span className={style.required}>*</span></label>
            <div className={style.inputIcon}>
              <i className="fa-solid fa-envelope"></i>
              <input
                id="email"
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? style.inputError : ""}
               />
            </div>
            {errors.email && <span className={style.errorMsg}>{errors.email}</span>}
          </div>

          <div className={style.field}>
            <label htmlFor="balance">Balance inicial</label>
            <div className={style.inputIcon}>
              <i className="fa-solid fa-dollar-sign"></i>
              <input
                id="balance"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </div>

          <div className={style.field}>
            <label htmlFor="status">Estado <span className={style.required}>*</span></label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={errors.status ? style.inputError : ""}
              disabled={operation === "create"} // ✅ Deshabilitado en create, siempre será Activo
            >
              {operation === "create" ? (
                <option value="Activo">Activo</option>
              ) : (
                <>
                  <option value="" disabled>Seleccionar status...</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </>
              )}
            </select>
            {errors.status && <span className={style.errorMsg}>{errors.status}</span>}
          </div>

        </div>

        {/* Footer */}
        <div className={style.footer}>
          <button className={style.btnCancel} onClick={onClose}>
            <i className="fa-solid fa-rotate-left"></i> Cancelar
          </button>
          <button className={style.btnSave} onClick={handleSave}>
            <i className={`fa-solid ${operation === "create" ? "fa-check" : "fa-pen"}`}></i>{" "}
            {operation === "create" ? "Guardar" : "Actualizar"}
          </button>
        </div>

      </div>
    </div>
  );
}