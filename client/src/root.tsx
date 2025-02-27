import "./globals.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./routes/layout/page";
import Home from "./routes/home/page";
import Dashboard from "./routes/dashboard/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
