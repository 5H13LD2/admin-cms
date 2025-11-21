import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, Award, GraduationCap, Users, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "User Progress" },
  { to: "/courses", icon: GraduationCap, label: "Courses" },
  { to: "/modules", icon: BookOpen, label: "Modules" },
  { to: "/lessons", icon: FileText, label: "My Lessons" },
  { to: "/quizzes", icon: Award, label: "Quizzes" },
  { to: "/assessments", icon: Code, label: "Assessments" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            TechLaunch
          </h1>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-4">
            <p className="text-sm font-medium text-sidebar-accent-foreground">
              Need Help?
            </p>
            <p className="mt-1 text-xs text-sidebar-foreground/70">
              Check our documentation
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
