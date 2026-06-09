import { toast } from "react-toastify";

export default function Toast() {
  const handleClick = () => {
    toast.success("Guardado correctamente!");
  };

  return (
    <button onClick={handleClick}>
      Mostrar Toast
    </button>
  );
}