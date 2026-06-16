// frontend/src/app/routes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import PromptListPage from "../pages/PromptListPage"
import PromptDetailPage from "../pages/PromptDetailPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PromptListPage />} />
      <Route path="/prompts/:id" element={<PromptDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}