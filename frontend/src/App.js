import React from "react";
import { Link, Routes, Route } from 'react-router-dom';

import Welcome from "./components/Welcome";
import Signup from "./components/Signup";
import Collection from "./components/CollectionView";
import TaskList from "./components/TaskList";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Collection />} />
                {/* <Route path="/" element={<Welcome />} /> */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/tasks" element={<TaskList />} />
            </Routes>
        </div>
    )
}
export default App;