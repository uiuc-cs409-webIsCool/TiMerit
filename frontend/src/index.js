import React from 'react';
import ReactDOM from "react-dom/client"
import { BrowserRouter } from 'react-router-dom';
import {disableReactDevTools} from "@fvilers/disable-react-devtools";
import App from "./App"

// Disable react dev tool in production mode
if (process.env.NODE_ENV === "production") disableReactDevTools();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);