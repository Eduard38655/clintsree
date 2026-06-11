import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Search from "../src/Search.jsx";
import style from "./App.module.css";
import ButtonDownload from "./ButtonDownload";
import UserDialog from "./Dialog";
import SideMenu from "./SideBarMenu";


function HomePage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [operation, setOperation] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  const perPage = 5;


  useEffect(() => { fetchData(); }, []);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);


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




  const filteredUsers = users.filter((user) => {

    const texto = search.toLowerCase();
    const matchNombre =
      user.nombre.toLowerCase().includes(texto) ||
      user.apellido.toLowerCase().includes(texto);
    const matchStatus = statusFilter === "" || user.status.toLowerCase() === statusFilter;
    return matchNombre && matchStatus;
  });


  const totalResults = filteredUsers.length;
  const totalPages = Math.ceil(totalResults / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);


  const allSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selected.includes(user.id));


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
          user={selectedUser}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(null);
          }}
          onSaved={(op) => fetchData(op === "create", op === "edit")}
        />
      )}


      <SideMenu />
      <div className={style.container}>
        <Search
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />


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
            <button className={`${style.btnIcon} ${style.btnImprimir}`} title="Imprimir">
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
                <th>
                  NOMBRE

                </th>
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
                  <td>{Number(user.balance).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                  <td>
                    <span className={statusClass(user.status)}>{user.status}</span>
                  </td>
                  <td>
                    <button
                      className={style.actionBtn}
                      onClick={() => {
                        setOperation("edit");
                        setSelectedUser(user);
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


export default HomePage;

