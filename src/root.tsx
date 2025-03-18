import "./globals.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./routes/layout/page";
import Home from "./routes/home/page";
import Dashboard from "./routes/dashboard/page";
import Analytics from "./routes/analytics/page";
import About from "./routes/about/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
