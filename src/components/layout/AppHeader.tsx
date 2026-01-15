import { Search, Bell, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function AppHeader() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search risks, articles, jobs..."
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-critical rounded-full" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center ml-2">
            <span className="text-sm font-medium text-primary">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
