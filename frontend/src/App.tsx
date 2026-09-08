import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from "./Top";
import Login from "./auth/pages/login";
import Accounting from "./accounting/pages/InputPage";
import ReportPage from "./accounting/pages/ReportPage";
import ReportOneCategory from "./accounting/pages/ReportOneCategory";
import TestPage from "./Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/accounting/report" element={<ReportPage />} />
        <Route
          path="/accounting/report/category/:categoryId"
          element={<ReportOneCategory />}
        />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
