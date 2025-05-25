import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Settings, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function UserDropdown() {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Abmelden.",
        variant: "destructive",
      });
    }
  };

  const userName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
    : user?.email || "Benutzer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-green-500/10 hover:text-green-400">
          <UserCircle className="w-6 h-6 text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-green-500/20">
        <DropdownMenuLabel className="text-green-400">
          {userName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-green-500/20" />
        <DropdownMenuItem 
          onClick={() => navigate("/settings")}
          className="text-gray-300 hover:bg-green-500/10 hover:text-green-400 cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Einstellungen</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/settings")}
          className="text-gray-300 hover:bg-green-500/10 hover:text-green-400 cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-green-500/20" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Abmelden</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
