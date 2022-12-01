import React from "react";
import { Link, Routes, Route } from 'react-router-dom';

import Welcome from "./components/Welcome";
import Signup from "./components/Signup";


function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </div>
    )
}
export default App;