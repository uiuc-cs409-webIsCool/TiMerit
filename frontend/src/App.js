import React from "react";
import { Link, Routes, Route } from 'react-router-dom'

import Welcome from "./components/Welcome"


function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Welcome />} />
            </Routes>
        </div>
    )
}
export default App;