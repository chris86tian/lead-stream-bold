import { Bell, Search, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { UserDropdown } from "./UserDropdown";

export function DashboardHeader() {
  return (
    <header className="bg-gray-950/90 backdrop-blur-sm border-b border-green-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent hover:from-green-300 hover:to-emerald-200 transition-all duration-200 cursor-pointer">
              Lead Management Dashboard
            </h1>
          </Link>
          <p className="text-gray-300 mt-1">
            Verwalten Sie Ihre Leads und verfolgen Sie den automatisierten Workflow
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
            <Input
              placeholder="Leads durchsuchen..."
              className="pl-10 w-80 bg-gray-900/80 border-green-500/30 focus:bg-gray-900 focus:border-green-400 transition-all duration-200 text-gray-100 placeholder:text-gray-400"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-green-500/10 hover:text-green-400">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          </Button>
          
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-green-500/10 hover:text-green-400" title="Zurück zur Homepage">
              <House className="w-5 h-5 text-gray-300" />
            </Button>
          </Link>
          
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
