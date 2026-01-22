import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import FamilyHubPage from "@/pages/family-hub";
import AdminLoginPage from "@/pages/admin/admin-login";
import StudioPage from "@/pages/StudioPage";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FamilyHubPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/studio/*" element={<StudioPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
