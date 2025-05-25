import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [shouldRedirectAfterLogin, setShouldRedirectAfterLogin] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Nur nach erfolgreichem Login weiterleiten, nicht bei jeder Statusänderung
        if (session?.user && shouldRedirectAfterLogin) {
          setTimeout(() => {
            navigate('/dashboard');
            onClose();
            setShouldRedirectAfterLogin(false);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate, onClose, shouldRedirectAfterLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShouldRedirectAfterLogin(true); // Flag setzen für Weiterleitung

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setShouldRedirectAfterLogin(false); // Bei Fehler Flag zurücksetzen
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Anmeldung fehlgeschlagen",
            description: "E-Mail oder Passwort ist falsch.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fehler",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen zurück!",
        });
      }
    } catch (error) {
      setShouldRedirectAfterLogin(false); // Bei Fehler Flag zurücksetzen
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShouldRedirectAfterLogin(true); // Flag setzen für Weiterleitung

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company: company,
            phone: phone,
          },
        },
      });

      if (error) {
        setShouldRedirectAfterLogin(false); // Bei Fehler Flag zurücksetzen
        if (error.message.includes('User already registered')) {
          toast({
            title: "Registrierung fehlgeschlagen",
            description: "Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fehler",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Registrierung erfolgreich",
          description: "Sie wurden automatisch angemeldet. Willkommen bei CRMbase!",
        });
      }
    } catch (error) {
      setShouldRedirectAfterLogin(false); // Bei Fehler Flag zurücksetzen
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCompany("");
    setPhone("");
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-sm border-green-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            {isLogin ? "Anmelden" : "Registrieren"}
          </DialogTitle>
        </DialogHeader>
        
        <Card className="bg-transparent border-green-500/20">
          <CardContent className="pt-6">
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">Vorname</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                      placeholder="Max"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">Nachname</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                      placeholder="Mustermann"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="company" className="text-gray-300">Firma</Label>
                  <Input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                    placeholder="Musterfirma GmbH"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="phone" className="text-gray-300">Telefonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                    placeholder="+49 123 456789"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-300">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                  placeholder="ihre@email.de"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 shadow-lg shadow-green-500/25"
              >
                {isLoading ? "Lädt..." : (isLogin ? "Anmelden" : "Registrieren")}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                {isLogin ? "Noch kein Konto? Jetzt registrieren" : "Bereits ein Konto? Jetzt anmelden"}
              </button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
