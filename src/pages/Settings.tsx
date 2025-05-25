import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/crm/DashboardHeader";
import { User, ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    company: "",
    phone: "",
  });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
  });
  const [privacy, setPrivacy] = useState({
    profile_visibility: true,
    data_sharing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingLeads, setIsDeletingLeads] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setProfile({
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          company: user.user_metadata?.company || "",
          phone: user.user_metadata?.phone || "",
        });
      }
    } catch (error) {
      console.error("Fehler beim Laden der Benutzerdaten:", error);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          company: profile.company,
          phone: profile.phone,
        }
      });

      if (error) throw error;

      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profildaten wurden erfolgreich gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Aktualisieren des Profils.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      
      if (error) throw error;
      
      toast({
        title: "Passwort zurücksetzen",
        description: "Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Zurücksetzen des Passworts.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllLeads = async () => {
    setIsDeletingLeads(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Alle Leads gelöscht",
        description: "Alle Ihre Leads wurden erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Löschen der Leads.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingLeads(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Abmelden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Einstellungen</h1>
          <p className="text-gray-400 mt-2">Verwalten Sie Ihre Konto- und Anwendungseinstellungen</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Profil Einstellungen */}
          <Card className="bg-gray-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profil Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">Vorname</Label>
                  <Input
                    id="firstName"
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    className="bg-gray-900/50 border-green-500/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Nachname</Label>
                  <Input
                    id="lastName"
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    className="bg-gray-900/50 border-green-500/30 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company" className="text-gray-300">Firma</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                  className="bg-gray-900/50 border-green-500/30 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-gray-300">Telefon</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="bg-gray-900/50 border-green-500/30 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-300">E-Mail</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-900/50 border-green-500/30 text-gray-400"
                />
                <p className="text-sm text-gray-500 mt-1">E-Mail-Adresse kann nicht geändert werden</p>
              </div>
              
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Speichern..." : "Profil speichern"}
              </Button>
            </CardContent>
          </Card>

          {/* Benachrichtigungseinstellungen */}
          <Card className="bg-gray-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">Benachrichtigungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">E-Mail Benachrichtigungen</Label>
                  <p className="text-sm text-gray-500">Erhalten Sie Updates per E-Mail</p>
                </div>
                <Switch
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, email_notifications: checked})
                  }
                />
              </div>
              
              <Separator className="bg-green-500/20" />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Push Benachrichtigungen</Label>
                  <p className="text-sm text-gray-500">Browser-Benachrichtigungen aktivieren</p>
                </div>
                <Switch
                  checked={notifications.push_notifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, push_notifications: checked})
                  }
                />
              </div>
              
              <Separator className="bg-green-500/20" />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Marketing E-Mails</Label>
                  <p className="text-sm text-gray-500">Neuigkeiten und Angebote erhalten</p>
                </div>
                <Switch
                  checked={notifications.marketing_emails}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, marketing_emails: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Datenschutz Einstellungen */}
          <Card className="bg-gray-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">Datenschutz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Profil Sichtbarkeit</Label>
                  <p className="text-sm text-gray-500">Profil für andere Benutzer sichtbar</p>
                </div>
                <Switch
                  checked={privacy.profile_visibility}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, profile_visibility: checked})
                  }
                />
              </div>
              
              <Separator className="bg-green-500/20" />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Daten Teilen</Label>
                  <p className="text-sm text-gray-500">Anonyme Nutzungsdaten zur Verbesserung teilen</p>
                </div>
                <Switch
                  checked={privacy.data_sharing}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, data_sharing: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Daten Management */}
          <Card className="bg-gray-800/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                Daten Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Alle Leads löschen</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Löscht permanent alle Ihre gespeicherten Leads. Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      disabled={isDeletingLeads}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeletingLeads ? "Lösche Leads..." : "Alle Leads löschen"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-red-500/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-400">
                        Alle Leads löschen?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Diese Aktion löscht permanent alle Ihre Leads aus der Datenbank. 
                        Diese Aktion kann nicht rückgängig gemacht werden.
                        <br /><br />
                        Sind Sie sicher, dass Sie fortfahren möchten?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600">
                        Abbrechen
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAllLeads}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Ja, alle Leads löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Sicherheit */}
          <Card className="bg-gray-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">Sicherheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Passwort</Label>
                <p className="text-sm text-gray-500 mb-3">Passwort über E-Mail zurücksetzen</p>
                <Button 
                  onClick={handlePasswordReset}
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  Passwort zurücksetzen
                </Button>
              </div>
              
              <Separator className="bg-green-500/20" />
              
              <div>
                <Label className="text-gray-300">Abmelden</Label>
                <p className="text-sm text-gray-500 mb-3">Von diesem Gerät abmelden</p>
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                >
                  Abmelden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
