import React from 'react';
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { GamesGalore } from "./components/GamesGalore";

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <GamesGalore />
    </BrowserRouter>
)
