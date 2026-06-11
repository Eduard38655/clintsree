import styles from "./App.module.css";


function SearchComp({ search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <div className={styles.filterBar}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="🔍 Buscar empleado..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


    {/*  <select
        className={styles.filterSelect}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>*/}


     {/* <button
        type="button"
        className={styles.filterButton}
        onClick={() => { setSearch(""); setStatusFilter(""); }}
      >
        <i className="fa-solid fa-filter-circle-xmark"></i>
        Limpiar
      </button> */}
    </div>
  );
}


export default SearchComp;



