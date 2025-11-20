import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="px-6 pb-8 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
