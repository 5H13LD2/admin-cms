import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Modules from "./pages/Modules";
import ModuleDetails from "./pages/ModuleDetails";
import Lessons from "./pages/Lessons";
import LessonDetails from "./pages/LessonDetails";
import Quizzes from "./pages/Quizzes";
import UserProgress from "./pages/UserProgress";
import TechnicalAssessments from "./pages/TechnicalAssessments";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="modules" element={<Modules />} />
            <Route path="modules/:id" element={<ModuleDetails />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="lessons/:id" element={<LessonDetails />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="users" element={<UserProgress />} />
            <Route path="assessments" element={<TechnicalAssessments />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
