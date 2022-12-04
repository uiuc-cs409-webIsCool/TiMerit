import React from "react";
import { Link, Routes, Route } from 'react-router-dom';

import Welcome from "./components/Welcome";
import Signup from "./components/Signup";
import Collection from "./components/CollectionView";
import Home from "./components/HomeView";

function App() {
    return (
        <div>
            <Routes> 
                {/* <Route path="/" element={<Collection />} /> 
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Home />} />*/} 
                
                <Route path="/" element={<Welcome />} />
                {/* <Route path="/" element={<Welcome />} /> */} 
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </div>
    )
}
export default App;