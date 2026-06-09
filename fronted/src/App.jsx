import { Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
function App(params) {
    return (
         

        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    )
}


export default App