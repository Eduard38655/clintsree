import styles from "./App.module.css";
function Optiones(params) {

    return (<div className={styles.options_Container}>
    <button className={styles.update}>Actualizar</button>
    <button className={styles.save}>Guardar</button>
 
    <button className={styles.print}>
        <i className="fa-solid fa-print"></i>
    </button>
    <button className={styles.excel}>
        <i className="fa-regular fa-file-excel"></i>
    </button>
    <button className={styles.close}>
        <i className="fa-solid fa-x"></i>
    </button>
</div>)
}

export default Optiones;