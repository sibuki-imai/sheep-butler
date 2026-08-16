import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from "./Top";
import Login from "./auth/pages/login";
import Accounting from "./accounting/pages/InputPage";
import TestPage from "./Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
