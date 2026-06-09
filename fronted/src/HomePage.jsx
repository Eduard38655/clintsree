import dayjs from "dayjs";
import { useEffect, useState } from "react";
import style from "./App.module.css";
import ButtonDownload from "./ButtonDownload";
import UserDialog from "./Dialog";
import SideMenu from "./SideBarMenu";

function App() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [operation, setOperation] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // ← usuario a editar

  const perPage = 5;
  const totalResults = users.length;
  const totalPages = Math.ceil(totalResults / perPage);

  useEffect(() => { fetchData(); }, []);

  async function fetchData(goToLastPage = false, preservePage = false) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ROUTER}/GetAllUser/info`);
      const data = await response.json();
      const rows = data.data || [];
      setUsers(rows);
      if (!preservePage) {
        const page = goToLastPage ? Math.max(1, Math.ceil(rows.length / perPage)) : 1;
        setCurrentPage(page);
      }
      setSelected([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const allSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selected.includes(user.id));

  function handleSelectAll(e) {
    if (e.target.checked) {
      const ids = paginatedUsers.map((u) => u.id);
      setSelected((prev) => [...new Set([...prev, ...ids])]);
    } else {
      const idsToRemove = paginatedUsers.map((u) => u.id);
      setSelected((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    }
  }

  function handleSelectRow(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function statusClass(status) {
    return style[`status-${status.toLowerCase()}`];
  }

  const start = totalResults === 0 ? 0 : startIndex + 1;
  const end = Math.min(endIndex, totalResults);

  return (
    <main>
      {dialogOpen && (
        <UserDialog
          operation={operation}
          open={dialogOpen}
          user={selectedUser}         // ← le pasamos el usuario
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(null);
          }}
          onSaved={(op) => fetchData(op === "create", op === "edit")} // ← create -> last, edit -> preserve
        />
      )}

      <SideMenu />
      <div className={style.container}>

        {/* Toolbar */}
        <div className={style.toolbar}>
          <div className={style.toolbarLeft}>
            <button className={`${style.btnIcon} ${style.btnRefresh}`} title="Actualizar" onClick={fetchData}>
              <i className="fa-solid fa-rotate"></i>
            </button>
            <button
              className={`${style.btn} ${style.btnGreen}`}
              onClick={() => {
                setOperation("create");
                setSelectedUser(null);
                setDialogOpen(true);
              }}
            >
              <i className="fa-regular fa-floppy-disk"></i> Nuevo Empleado
            </button>
          </div>
          <div className={style.toolbarRight}>
            <button
              className={`${style.btnIcon} ${style.btnImprimir}`}
              title="Imprimir"
            >
              <i className="fa-solid fa-print"></i>
            </button>

            <ButtonDownload DatosDownload={paginatedUsers} />
          </div>
        </div>

        {/* Table */}
        <div className={style.table_container}>
          <table>
            <thead>
              <tr>

                <th>ID</th>
                <th>NOMBRE {" "}
                  <button className={style.sortButton} >
                    <i className="fa-solid fa-sort"></i>
                  </button>  </th>
                <th>APELLIDO</th>
                <th>CORREO</th>
                <th>FECHA DE REGISTRO</th>
                <th>BALANCE</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>

                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.email}</td>
                  <td>{dayjs(user.fecha).format("MMM D, YYYY")}</td>
                  <td>  {Number(user.balance).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                  <td>
                    <span className={statusClass(user.status)}>{user.status}</span>
                  </td>
                  <td>
                    <button
                      className={style.actionBtn}
                      onClick={() => {
                        setOperation("edit");
                        setSelectedUser(user); // ← guardamos el objeto completo
                        setDialogOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-pen"></i> EDITAR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer + Pagination */}
          <div className={style.tableFooter}>
            <span>Mostrando {start} a {end} de {totalResults} resultados</span>
            <div className={style.pagination}>
              <button
                className={style.pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                &lsaquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${style.pageBtn} ${currentPage === p ? style.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className={style.pageBtn}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                &rsaquo;
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default App;