import style from "./App.module.css";
function ButtonDownload({DatosDownload}) {


function Download(params) {

    const blob = new Blob([JSON.stringify(DatosDownload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json'; 
    link.click();
    URL.revokeObjectURL(url);
}

    return (
        <button onClick={() => Download()}
            className={`${style.btnIcon} ${style.btnDownload}`}
            title="Descargar"
        >
            <i className="fa-solid fa-download"></i>
        </button>
    )
}

export default ButtonDownload