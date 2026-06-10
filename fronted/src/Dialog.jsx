import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
      setNombre((user.nombre || "").toUpperCase());
      setApellido((user.apellido || "").toUpperCase());
      setEmail((user.email || ""));
      setBalance(user.balance?.toString() || "");
      setStatus(user.status || "");
    } else {
      setNombre("");
      setApellido("");
      setEmail("");
      setBalance("");
      setStatus("ACTIVO");
    }
    setErrors({});
  }, [open, operation, user]);

  if (!open) return null;

  function formatBalance(value) {
    if (value === "" || value === null || value === undefined) return "";
    const num = Number(value.toString().replace(/,/g, ""));
    if (Number.isNaN(num)) return value;
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function handleBalanceChange(e) {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parts = raw.split(".");
    const clean = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw;
    setBalance(clean);
  }

  function validate() {
    const newErrors = {};

    if (!nombre.trim())
      newErrors.nombre = "Campo requerido";

    if (!apellido.trim())
      newErrors.apellido = "Campo requerido";

    if (!email.trim())
      newErrors.email = "Campo requerido";
    else if (!/\S+@\S+\.\S+/.test(email.toLowerCase()))
      newErrors.email = "Email inválido";

    if (!balance.toString().trim())
      newErrors.balance = "Campo requerido";
    else if (Number.isNaN(Number(balance.replace(/,/g, ""))))
      newErrors.balance = "Balance inválido";

    if (!status)
      newErrors.status = "Selecciona un status";

    return newErrors;
  }

  async function handleSave() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanBalance = Number(balance.toString().replace(/,/g, ""));

    try {
      let response;

      if (operation === "create") {
        response = await fetch(`${import.meta.env.VITE_API_ROUTER}/InsertUser/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            email: email.toLowerCase(),
            balance: cleanBalance,
            status,
            fecha: new Date(),
          }),
        });
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_ROUTER}/InsertUser/UpdateUser/${user.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              apellido,
              email: email,
              balance: cleanBalance,
              status,
              fecha: new Date(),
            }),
          }
        );
      }

      const data = await response.json();

      if (data.ok) {
        onSaved(operation);
        onClose();
        toast.success("Operación exitosa");
      } else {
        toast.error("No se pudo realizar la operación");
        setErrors(data.errors || { general: "Error al guardar" });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("No se pudo realizar la operación");
      setErrors({ general: "Error de conexión" });
    }
  }

  return (
    <div className={style.overlay}>
      <div
        className={style.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className={style.header}>
          <div className={style.headerTitle}>
            <div className={style.avatar}>
              <i
                className={`fa-solid ${
                  operation === "create" ? "fa-user-plus" : "fa-user-pen"
                }`}
              ></i>
            </div>
            <div>
              <p className={style.title} id="dialog-title">
                {operation === "create"
                  ? "Nuevo Empleado"
                  : `Editar — ${user?.nombre} ${user?.apellido}`}
              </p>
            </div>
          </div>
          <button className={style.closeBtn} aria-label="Cerrar" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={style.body}>
          {errors.general && (
            <p style={{ color: "var(--error)", fontSize: "13px" }}>{errors.general}</p>
          )}

          <div className={style.row}>
            <div className={style.field}>
              <label htmlFor="nombre">
                Nombre <span className={style.required}>*</span>
              </label>
              <div className={style.inputIcon}>
                <i className="fa-solid fa-user"></i>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value.toUpperCase())}
                  className={errors.nombre ? style.inputError : ""}
                />
              </div>
              {errors.nombre && (
                <span className={style.errorMsg}>{errors.nombre}</span>
              )}
            </div>

            <div className={style.field}>
              <label htmlFor="apellido">
                Apellido <span className={style.required}>*</span>
              </label>
              <div className={style.inputIcon}>
                <i className="fa-solid fa-user"></i>
                <input
                  id="apellido"
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value.toUpperCase())}
                  className={errors.apellido ? style.inputError : ""}
                />
              </div>
              {errors.apellido && (
                <span className={style.errorMsg}>{errors.apellido}</span>
              )}
            </div>
          </div>

          <div className={style.field}>
            <label htmlFor="email">
              Correo electrónico <span className={style.required}>*</span>
            </label>
            <div className={style.inputIcon}>
              <i className="fa-solid fa-envelope"></i>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? style.inputError : ""}
              />
            </div>
            {errors.email && (
              <span className={style.errorMsg}>{errors.email}</span>
            )}
          </div>

          <div className={style.field}>
            <label htmlFor="balance">
              Balance inicial <span className={style.required}>*</span>
            </label>
            <div className={style.inputIcon}>
              <i className="fa-solid fa-dollar-sign"></i>
              <input
                id="balance"
                type="text"
                placeholder="0"
                value={formatBalance(balance)}
                onChange={handleBalanceChange}
                className={errors.balance ? style.inputError : ""}
              />
            </div>
            {errors.balance && (
              <span className={style.errorMsg}>{errors.balance}</span>
            )}
          </div>

          <div className={style.field}>
            <label htmlFor="status">
              Estado <span className={style.required}>*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={errors.status ? style.inputError : ""}
              disabled={operation === "create"}
            >
              {operation === "create" ? (
                <option value="ACTIVO">ACTIVO</option>
              ) : (
                <>
                  <option value="" disabled>
                    Seleccionar status...
                  </option>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </>
              )}
            </select>
            {errors.status && (
              <span className={style.errorMsg}>{errors.status}</span>
            )}
          </div>
        </div>

        <div className={style.footer}>
          <button className={style.btnCancel} onClick={onClose}>
            <i className="fa-solid fa-rotate-left"></i> Cancelar
          </button>
          <button className={style.btnSave} onClick={handleSave}>
            <i
              className={`fa-solid ${
                operation === "create" ? "fa-check" : "fa-pen"
              }`}
            ></i>{" "}
            {operation === "create" ? "Guardar" : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}