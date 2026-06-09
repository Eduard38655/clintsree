import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from './HomePage';
function App(params) {
    return (
         

        <>
         <ToastContainer />
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
        </>
    )
}


export default App