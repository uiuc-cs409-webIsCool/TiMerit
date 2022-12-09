import React from "react";
import { Link, Routes, Route } from 'react-router-dom';

import Welcome from "./components/Welcome";
import Signup from "./components/Signup";
import Analysis from "./components/TimeAnalysisView";
import Home from "./components/HomeView";
import Timer from "./components/TimerView"

function App() {
    return (
        <div>
            <Routes> 
                {/* <Route path="/" element={<Collection />} /> 
                <Route path="/" element={<Welcome />} />
                  */}
                  
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Welcome />} />
                <Route path="/analysis" element={<Analysis />} /> 
                <Route path="/signup" element={<Signup />} />
                {/* <Route path="/timer" element={<Timer />} /> */}
            </Routes>
        </div>
    )
}
export default App;