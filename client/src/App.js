import React from "react";

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
