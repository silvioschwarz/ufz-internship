import React from "react"
import { createRoot } from 'react-dom/client';
import App from "./App"

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./css/style.css"

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);




// ReactDOM.render(<App />, document.getElementById("root"))

