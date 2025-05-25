import { Users, BarChart3, Calendar, Settings, Mail, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { name: 'Leads', icon: Users, href: '/leads' },
  { name: 'E-Mail Kampagnen', icon: Mail, href: '/campaigns' },
  { name: 'KI-Call', icon: Zap, href: '/ai-calls' },
  { name: 'Termine', icon: Calendar, href: '/calendar' },
  { name: 'Einstellungen', icon: Settings, href: '/settings' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const [userCompany, setUserCompany] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const company = user.user_metadata?.company || "Unbekanntes Unternehmen";
          setUserCompany(company);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
        setUserCompany("Unbekanntes Unternehmen");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="h-full bg-gray-950/95 backdrop-blur-sm border-r border-green-500/20 shadow-2xl">
        <div className="flex h-16 items-center justify-between px-4 border-b border-green-500/20">
          {isOpen && (
            <div className="flex flex-col w-full">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  CRMbase
                </span>
              </div>
              <p className="text-xs text-gray-300 ml-10 truncate font-bold">
                {userCompany}
              </p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-green-500/10 transition-colors group"
          >
            <BarChart3 className="w-5 h-5 text-gray-300 group-hover:text-green-400" />
          </button>
        </div>
        
        <nav className="mt-8 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isCurrent = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isCurrent
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10"
                        : "text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0 w-5 h-5 transition-colors",
                        isCurrent ? "text-green-400" : "text-gray-400 group-hover:text-green-400"
                      )}
                    />
                    {isOpen && (
                      <span className="ml-3 transition-opacity duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
