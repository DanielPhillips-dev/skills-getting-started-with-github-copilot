import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import  DashboardPage from "./pages/DashboardPage";
import PromptDetailPage from "./pages/PromptDetailPage";
import { AppRoutes } from "./app/route";
import { AppShell } from "./app/AppShell";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  );
}
