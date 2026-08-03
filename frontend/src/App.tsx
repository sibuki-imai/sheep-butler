import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from "./Top";
import TestPage from "./Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
