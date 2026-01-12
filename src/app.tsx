import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ConvexClientProvider } from "@/lib/convex-provider";
import FamilyHubPage from "@/pages/family-hub";
import AdminLoginPage from "@/pages/admin/admin-login";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ConvexClientProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<FamilyHubPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ConvexClientProvider>
    </ThemeProvider>
  );
};

export default App;
