import { LayoutDashboard, ListTodo, Shield, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Jobs", icon: ListTodo, path: "/jobs" },
  { title: "Risks", icon: Shield, path: "/risks" },
  { title: "Articles", icon: FileText, path: "/articles" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">AI Risk</span>
              <span className="text-xs text-sidebar-foreground/60">Intelligence</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary-foreground")} />
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.title}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings & Collapse */}
      <div className="p-2 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            location.pathname === "/settings"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </NavLink>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 text-sidebar-foreground hover:bg-sidebar-accent justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
}
