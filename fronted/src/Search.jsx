import { useForm } from "react-hook-form";
import styles from "./App.module.css";
import Optiones from "./optiones";
function SearchComp({ boolean, setBoolean }) {

    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        defaultValues: {
            status: "Inactivo"
        }
    });

    const statusOptions = [
        "Inactivo",
        "Activo",
        "Eliminado",
        "Pendiente"
    ];

    async function EnviarDeTodo(data) {

        try {

            const response = await fetch(
                "http://localhost:3000/InsertUser/user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            console.log(result);

            setBoolean(true);

            reset();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.search_Container}>

            <form
                className={styles.search_Div}
                onSubmit={handleSubmit(EnviarDeTodo)}
            >

                <input
                    type="text"
                    placeholder="Ingresa el nombre"
                    {...register("name", {
                        required: true
                    })}
                />

                <input
                    type="date"
                    {...register("date")}
                />

                <input
                    type="number"
                    placeholder="Ingresa balance"
                    {...register("balance")}
                />

                <div>
                    <select {...register("status")}>

                        {
                            statusOptions.map((item, index) => (
                                <option key={index}>
                                    {item}
                                </option>
                            ))
                        }

                    </select>
                </div>

                <div>

                    <input type="text" placeholder="Buscar..." />
                </div>
                <div className={styles.search_Div_button}>
                    <button
                        type="button"
                        className={styles.button_clear}
                        onClick={() => reset()}
                    >
                        Clear
                    </button>

                    <button
                        type="submit"
                        className={styles.button_send}
                    >
                        Enviar
                    </button>
                </div>

            </form>

            < Optiones />
        </div>
    );
}

export default SearchComp;