import { useState, useEffect } from "react";
import Portfolio from "./Portfolio.jsx";
import AdminConsole from "./AdminConsole.jsx";
import { loadData, saveData } from "./data.js";

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [view, setView] = useState("portfolio"); // "portfolio" | "admin"

  // Persist whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Route: /?admin  →  show admin
  useEffect(() => {
    if (window.location.search.includes("admin")) setView("admin");
  }, []);

  if (view === "admin") {
    return (
      <AdminConsole
        data={data}
        setData={setData}
        onPreview={() => setView("portfolio")}
        onBack={() => setView("portfolio")}
      />
    );
  }

  return (
    <Portfolio
      data={data}
      onOpenAdmin={() => setView("admin")}
    />
  );
}
