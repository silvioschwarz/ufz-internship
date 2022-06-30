import React from "react";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";


import './css/style.css';
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Footer from "./components/Footer";

export default function App() {

  return (
    <div className="App-container">
      <Navbar />
      <Main />
      <Footer/>
    </div>
  );
}
